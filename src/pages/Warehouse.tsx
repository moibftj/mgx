import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { mockProducts, mockCategories, mockRiderStocks } from '@/lib/mockData';
import { toast } from 'sonner';

const Warehouse = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-destructive">Akses Ditolak</h1>
        <p className="text-muted-foreground">Hanya admin yang dapat mengakses halaman ini</p>
      </div>
    );
  }

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity) {
      toast.error('Harap pilih produk dan masukkan jumlah');
      return;
    }

    const product = mockProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    const adjustmentQuantity = parseInt(quantity);
    
    if (adjustmentType === 'add') {
      product.warehouseStock += adjustmentQuantity;
      toast.success(`Berhasil menambah ${adjustmentQuantity} stok ${product.name}`);
    } else {
      if (product.warehouseStock >= adjustmentQuantity) {
        product.warehouseStock -= adjustmentQuantity;
        toast.success(`Berhasil mengurangi ${adjustmentQuantity} stok ${product.name}`);
      } else {
        toast.error('Stok tidak mencukupi untuk pengurangan');
        return;
      }
    }

    setIsDialogOpen(false);
    setSelectedProduct('');
    setQuantity('');
    setReason('');
  };

  const getTotalDistributedStock = (productId: string) => {
    return mockRiderStocks
      .filter(stock => stock.productId === productId)
      .reduce((sum, stock) => sum + stock.quantity, 0);
  };

  const totalWarehouseStock = mockProducts.reduce((sum, product) => sum + product.warehouseStock, 0);
  const totalDistributedStock = mockRiderStocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const lowStockProducts = mockProducts.filter(p => p.warehouseStock < 10).length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Gudang</h1>
          <p className="text-muted-foreground">
            Kelola stok produk di gudang dan pantau distribusi
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Package className="mr-2 h-4 w-4" />
          Sesuaikan Stok
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok Gudang</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouseStock}</div>
            <p className="text-xs text-muted-foreground">
              Unit di gudang
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Terdistribusi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistributedStock}</div>
            <p className="text-xs text-muted-foreground">
              Unit di rider
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Stok Rendah</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Perlu restock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouseStock + totalDistributedStock}</div>
            <p className="text-xs text-muted-foreground">
              Gudang + Terdistribusi
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Stok Produk</CardTitle>
          <CardDescription>
            Pantau stok di gudang dan yang telah didistribusikan ke rider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Gudang</TableHead>
                <TableHead>Stok Terdistribusi</TableHead>
                <TableHead>Total Stok</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => {
                const category = mockCategories.find(c => c.id === product.categoryId);
                const distributedStock = getTotalDistributedStock(product.id);
                const totalStock = product.warehouseStock + distributedStock;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{category?.name}</TableCell>
                    <TableCell>{product.warehouseStock}</TableCell>
                    <TableCell>{distributedStock}</TableCell>
                    <TableCell>{totalStock}</TableCell>
                    <TableCell>
                      <Badge variant={
                        product.warehouseStock > 10 ? "secondary" : 
                        product.warehouseStock > 0 ? "outline" : "destructive"
                      }>
                        {product.warehouseStock > 10 ? "Aman" : 
                         product.warehouseStock > 0 ? "Rendah" : "Habis"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Penyesuaian Stok</DialogTitle>
            <DialogDescription>
              Tambah atau kurangi stok produk di gudang
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockAdjustment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Produk *
                </Label>
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (Stok: {product.warehouseStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipe *
                </Label>
                <Select
                  value={adjustmentType}
                  onValueChange={(value: 'add' | 'remove') => setAdjustmentType(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Stok
                      </div>
                    </SelectItem>
                    <SelectItem value="remove">
                      <div className="flex items-center">
                        <Minus className="mr-2 h-4 w-4" />
                        Kurangi Stok
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Jumlah *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Alasan
                </Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan penyesuaian stok"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {adjustmentType === 'add' ? 'Tambah' : 'Kurangi'} Stok
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Warehouse;