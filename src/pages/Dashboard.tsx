import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Warehouse,
  TrendingDown
} from 'lucide-react';
import { mockProducts, mockTransactions, mockRiderStocks, mockUsers } from '@/lib/mockData';

const Dashboard = () => {
  const { user } = useAuth();

  // Calculate statistics
  const totalProducts = mockProducts.length;
  const totalWarehouseStock = mockProducts.reduce((sum, product) => sum + product.warehouseStock, 0);
  const totalTransactions = mockTransactions.length;
  const totalRevenue = mockTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalRiders = mockUsers.filter(u => u.role === 'rider').length;
  
  // Calculate rider's distributed stock
  const riderDistributedStock = user?.role === 'rider' 
    ? mockRiderStocks.filter(stock => stock.riderId === user.id).reduce((sum, stock) => sum + stock.quantity, 0)
    : 0;

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Ringkasan lengkap sistem POS Anda
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5 transaksi hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Gudang</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouseStock}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts} produk berbeda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rider</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRiders}</div>
            <p className="text-xs text-muted-foreground">
              Rider/Kasir aktif
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produk Stok Rendah</CardTitle>
            <CardDescription>
              Produk yang perlu direstock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProducts
                .filter(product => product.warehouseStock < 30)
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {product.warehouseStock}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Rendah
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>
              5 transaksi terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.slice(0, 5).map(transaction => {
                const rider = mockUsers.find(u => u.id === transaction.riderId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rider?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rp {transaction.total.toLocaleString('id-ID')}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.products.length} item
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const RiderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Rider</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Saya</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riderDistributedStock}</div>
            <p className="text-xs text-muted-foreground">
              Produk yang didistribusikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTransactions.filter(t => t.riderId === user?.id).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Penjualan hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {mockTransactions
                .filter(t => t.riderId === user?.id)
                .reduce((sum, t) => sum + t.total, 0)
                .toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total penjualan
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stok Produk Saya</CardTitle>
          <CardDescription>
            Produk yang telah didistribusikan kepada Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRiderStocks
              .filter(stock => stock.riderId === user?.id)
              .map(stock => {
                const product = mockProducts.find(p => p.id === stock.productId);
                return (
                  <div key={stock.productId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Harga: Rp {product?.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Stok: {stock.quantity}</p>
                      <Badge variant="secondary">Tersedia</Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {user?.role === 'admin' ? <AdminDashboard /> : <RiderDashboard />}
    </div>
  );
};

export default Dashboard;