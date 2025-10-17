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
import { Truck, Package, Users, Send } from 'lucide-react';
import { mockProducts, mockUsers, mockRiderStocks, RiderStock } from '@/lib/mockData';
import { toast } from 'sonner';

const Distribution = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-destructive">Akses Ditolak</h1>
        <p className="text-muted-foreground">Hanya admin yang dapat mengakses halaman ini</p>
      </div>
    );
  }

  const riders = mockUsers.filter(u => u.role === 'rider');

  const handleDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRider || !selectedProduct || !quantity) {
      toast.error('Harap isi semua field');
      return;
    }

    const product = mockProducts.find(p => p.id === selectedProduct);
    const rider = riders.find(r => r.id === selectedRider);
    const distributionQuantity = parseInt(quantity);

    if (!product || !rider) return;

    if (product.warehouseStock < distributionQuantity) {
      toast.error('Stok gudang tidak mencukupi');
      return;
    }

    // Update warehouse stock
    product.warehouseStock -= distributionQuantity;

    // Update or create rider stock
    const existingRiderStock = mockRiderStocks.find(
      stock => stock.riderId === selectedRider && stock.productId === selectedProduct
    );

    if (existingRiderStock) {
      existingRiderStock.quantity += distributionQuantity;
    } else {
      mockRiderStocks.push({
        riderId: selectedRider,
        productId: selectedProduct,
        quantity: distributionQuantity
      });
    }

    toast.success(`Berhasil mendistribusikan ${distributionQuantity} ${product.name} ke ${rider.name}`);
    
    setIsDialogOpen(false);
    setSelectedRider('');
    setSelectedProduct('');
    setQuantity('');
  };

  const getRiderStock = (riderId: string, productId: string) => {
    const stock = mockRiderStocks.find(
      stock => stock.riderId === riderId && stock.productId === productId
    );
    return stock ? stock.quantity : 0;
  };

  const getTotalRiderStock = (riderId: string) => {
    return mockRiderStocks
      .filter(stock => stock.riderId === riderId)
      .reduce((sum, stock) => sum + stock.quantity, 0);
  };

  const totalDistributed = mockRiderStocks.reduce((sum, stock) => sum + stock.quantity, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distribusi Produk</h1>
          <p className="text-muted-foreground">
            Distribusikan produk dari gudang ke rider/kasir
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Send className="mr-2 h-4 w-4" />
          Distribusi Produk
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rider</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riders.length}</div>
            <p className="text-xs text-muted-foreground">
              Rider aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Terdistribusi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistributed}</div>
            <p className="text-xs text-muted-foreground">
              Unit di rider
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribusi Hari Ini</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Transaksi distribusi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rider Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {riders.filter(rider => getTotalRiderStock(rider.id) > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Memiliki stok
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Rider</CardTitle>
            <CardDescription>
              Daftar rider dan stok yang mereka miliki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Rider</TableHead>
                  <TableHead>Total Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riders.map((rider) => {
                  const totalStock = getTotalRiderStock(rider.id);
                  return (
                    <TableRow key={rider.id}>
                      <TableCell className="font-medium">{rider.name}</TableCell>
                      <TableCell>{totalStock}</TableCell>
                      <TableCell>
                        <Badge variant={totalStock > 0 ? "secondary" : "outline"}>
                          {totalStock > 0 ? "Aktif" : "Tidak Ada Stok"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Produk</CardTitle>
            <CardDescription>
              Detail distribusi produk ke setiap rider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRiderStocks.map((stock, index) => {
                  const rider = riders.find(r => r.id === stock.riderId);
                  const product = mockProducts.find(p => p.id === stock.productId);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rider?.name}</TableCell>
                      <TableCell>{product?.name}</TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Distribusi Produk</DialogTitle>
            <DialogDescription>
              Distribusikan produk dari gudang ke rider/kasir
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDistribution}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rider" className="text-right">
                  Rider *
                </Label>
                <Select
                  value={selectedRider}
                  onValueChange={setSelectedRider}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {riders.map(rider => (
                      <SelectItem key={rider.id} value={rider.id}>
                        {rider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              {selectedProduct && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Stok Tersedia</Label>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {mockProducts.find(p => p.id === selectedProduct)?.warehouseStock || 0} unit
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                Distribusikan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Distribution;