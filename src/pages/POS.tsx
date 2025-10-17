import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Trash2, 
  RotateCcw,
  Search
} from 'lucide-react';
import { mockProducts, mockRiderStocks, mockCategories, mockTaxSettings } from '@/lib/mockData';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

const POS = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get rider's available products
  const riderStocks = mockRiderStocks.filter(stock => stock.riderId === user?.id);
  const availableProducts = mockProducts.filter(product => 
    riderStocks.some(stock => stock.productId === product.id && stock.quantity > 0)
  );

  // Filter products based on category and search
  const filteredProducts = availableProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: typeof mockProducts[0]) => {
    const riderStock = riderStocks.find(stock => stock.productId === product.id);
    const cartItem = cart.find(item => item.productId === product.id);
    const currentCartQuantity = cartItem ? cartItem.quantity : 0;

    if (riderStock && currentCartQuantity < riderStock.quantity) {
      setCart(prev => {
        const existingItem = prev.find(item => item.productId === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { productId: product.id, quantity: 1, price: product.price }];
        }
      });
    } else {
      toast.error('Stok tidak mencukupi');
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.productId !== productId);
      }
    });
  };

  const deleteFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const returnToWarehouse = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    const riderStock = riderStocks.find(stock => stock.productId === productId);
    
    if (riderStock && riderStock.quantity > 0) {
      // Update rider stock (decrease)
      riderStock.quantity -= 1;
      // Update warehouse stock (increase)
      if (product) {
        product.warehouseStock += 1;
      }
      toast.success(`${product?.name} berhasil dikembalikan ke gudang`);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    if (mockTaxSettings.enabled) {
      return calculateSubtotal() * (mockTaxSettings.rate / 100);
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const processPayment = () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    // Update rider stocks
    cart.forEach(cartItem => {
      const riderStock = riderStocks.find(stock => stock.productId === cartItem.productId);
      if (riderStock) {
        riderStock.quantity -= cartItem.quantity;
      }
    });

    // Create transaction (in real app, this would be saved to database)
    const newTransaction = {
      id: Date.now().toString(),
      riderId: user?.id || '',
      products: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      total: calculateTotal(),
      date: new Date().toISOString()
    };

    // Clear cart
    setCart([]);
    
    toast.success(`Transaksi berhasil! Total: Rp ${calculateTotal().toLocaleString('id-ID')}`);
  };

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
            <p className="text-muted-foreground">Pilih produk untuk dijual</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {mockCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const riderStock = riderStocks.find(stock => stock.productId === product.id);
              const cartItem = cart.find(item => item.productId === product.id);
              const availableStock = riderStock ? riderStock.quantity - (cartItem?.quantity || 0) : 0;

              return (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant={availableStock > 0 ? "secondary" : "destructive"}>
                        Stok: {availableStock}
                      </Badge>
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={availableStock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => returnToWarehouse(product.id)}
                          disabled={!riderStock || riderStock.quantity === 0}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang Belanja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Keranjang kosong
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map(item => {
                      const product = mockProducts.find(p => p.id === item.productId);
                      return (
                        <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(product!)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFromCart(item.productId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                    </div>
                    {mockTaxSettings.enabled && (
                      <div className="flex justify-between text-sm">
                        <span>Pajak ({mockTaxSettings.rate}%):</span>
                        <span>Rp {calculateTax().toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={clearCart} className="flex-1">
                      Bersihkan
                    </Button>
                    <Button onClick={processPayment} className="flex-1">
                      Bayar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POS;