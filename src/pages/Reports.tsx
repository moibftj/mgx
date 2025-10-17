import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Filter
} from 'lucide-react';
import { mockTransactions, mockProducts, mockUsers, mockRiderStocks } from '@/lib/mockData';
import { toast } from 'sonner';

const Reports = () => {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRider, setSelectedRider] = useState('all');

  const riders = mockUsers.filter(u => u.role === 'rider');

  // Filter transactions based on date and rider
  const filteredTransactions = mockTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const dateMatch = (!fromDate || transactionDate >= fromDate) && 
                     (!toDate || transactionDate <= toDate);
    
    const riderMatch = selectedRider === 'all' || transaction.riderId === selectedRider;

    // For riders, only show their own transactions
    if (user?.role === 'rider') {
      return dateMatch && transaction.riderId === user.id;
    }

    return dateMatch && riderMatch;
  });

  // Calculate statistics
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const downloadReport = (type: 'sales' | 'stock' | 'transactions') => {
    let reportData = '';
    let filename = '';

    switch (type) {
      case 'sales':
        reportData = generateSalesReport();
        filename = 'laporan-penjualan.csv';
        break;
      case 'stock':
        reportData = generateStockReport();
        filename = 'laporan-stok.csv';
        break;
      case 'transactions':
        reportData = generateTransactionReport();
        filename = 'laporan-transaksi.csv';
        break;
    }

    const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Laporan ${type} berhasil didownload`);
  };

  const generateSalesReport = () => {
    let csv = 'Tanggal,Rider,Total Penjualan,Jumlah Item\n';
    filteredTransactions.forEach(transaction => {
      const rider = mockUsers.find(u => u.id === transaction.riderId);
      const date = new Date(transaction.date).toLocaleDateString('id-ID');
      const itemCount = transaction.products.reduce((sum, p) => sum + p.quantity, 0);
      csv += `${date},${rider?.name || 'Unknown'},${transaction.total},${itemCount}\n`;
    });
    return csv;
  };

  const generateStockReport = () => {
    let csv = 'Produk,Kategori,Stok Gudang,Stok Terdistribusi,Total Stok\n';
    mockProducts.forEach(product => {
      const distributedStock = mockRiderStocks
        .filter(stock => stock.productId === product.id)
        .reduce((sum, stock) => sum + stock.quantity, 0);
      csv += `${product.name},${product.categoryId},${product.warehouseStock},${distributedStock},${product.warehouseStock + distributedStock}\n`;
    });
    return csv;
  };

  const generateTransactionReport = () => {
    let csv = 'ID Transaksi,Tanggal,Rider,Produk,Jumlah,Harga,Total\n';
    filteredTransactions.forEach(transaction => {
      const rider = mockUsers.find(u => u.id === transaction.riderId);
      const date = new Date(transaction.date).toLocaleDateString('id-ID');
      transaction.products.forEach(product => {
        const productInfo = mockProducts.find(p => p.id === product.productId);
        csv += `${transaction.id},${date},${rider?.name || 'Unknown'},${productInfo?.name || 'Unknown'},${product.quantity},${product.price},${product.quantity * product.price}\n`;
      });
    });
    return csv;
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' 
              ? 'Laporan penjualan, stok, dan transaksi lengkap'
              : 'Laporan penjualan dan transaksi Anda'
            }
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Dari Tanggal</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Sampai Tanggal</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            {user?.role === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="rider">Rider</Label>
                <Select value={selectedRider} onValueChange={setSelectedRider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Rider</SelectItem>
                    {riders.map(rider => (
                      <SelectItem key={rider.id} value={rider.id}>
                        {rider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setSelectedRider('all');
                }}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {averageTransaction.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periode</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dateFrom && dateTo ? `${Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24))} hari` : 'Semua'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          {user?.role === 'admin' && (
            <>
              <TabsTrigger value="sales">Laporan Penjualan</TabsTrigger>
              <TabsTrigger value="stock">Laporan Stok</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Riwayat Transaksi</CardTitle>
                <CardDescription>
                  Daftar semua transaksi yang telah dilakukan
                </CardDescription>
              </div>
              <Button onClick={() => downloadReport('transactions')}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    {user?.role === 'admin' && <TableHead>Rider</TableHead>}
                    <TableHead>Jumlah Item</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const rider = mockUsers.find(u => u.id === transaction.riderId);
                    const itemCount = transaction.products.reduce((sum, p) => sum + p.quantity, 0);
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('id-ID')}</TableCell>
                        {user?.role === 'admin' && <TableCell>{rider?.name}</TableCell>}
                        <TableCell>{itemCount}</TableCell>
                        <TableCell>Rp {transaction.total.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === 'admin' && (
          <>
            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Laporan Penjualan per Rider</CardTitle>
                    <CardDescription>
                      Ringkasan penjualan berdasarkan rider
                    </CardDescription>
                  </div>
                  <Button onClick={() => downloadReport('sales')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Rider</TableHead>
                        <TableHead>Jumlah Transaksi</TableHead>
                        <TableHead>Total Penjualan</TableHead>
                        <TableHead>Rata-rata per Transaksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riders.map((rider) => {
                        const riderTransactions = filteredTransactions.filter(t => t.riderId === rider.id);
                        const totalSales = riderTransactions.reduce((sum, t) => sum + t.total, 0);
                        const avgPerTransaction = riderTransactions.length > 0 ? totalSales / riderTransactions.length : 0;
                        
                        return (
                          <TableRow key={rider.id}>
                            <TableCell className="font-medium">{rider.name}</TableCell>
                            <TableCell>{riderTransactions.length}</TableCell>
                            <TableCell>Rp {totalSales.toLocaleString('id-ID')}</TableCell>
                            <TableCell>Rp {avgPerTransaction.toLocaleString('id-ID')}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stock" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Laporan Stok Produk</CardTitle>
                    <CardDescription>
                      Status stok semua produk di gudang dan yang terdistribusi
                    </CardDescription>
                  </div>
                  <Button onClick={() => downloadReport('stock')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Stok Gudang</TableHead>
                        <TableHead>Stok Terdistribusi</TableHead>
                        <TableHead>Total Stok</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProducts.map((product) => {
                        const distributedStock = mockRiderStocks
                          .filter(stock => stock.productId === product.id)
                          .reduce((sum, stock) => sum + stock.quantity, 0);
                        const totalStock = product.warehouseStock + distributedStock;
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
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
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Reports;