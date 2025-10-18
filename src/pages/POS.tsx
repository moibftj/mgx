import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
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

type PaymentMethod = 'cash' | 'qris';

interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  change?: number;
}

const POS = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

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
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    const total = calculateTotal();
    
    if (paymentMethod === 'cash') {
      const cashValue = parseFloat(cashAmount);
      if (isNaN(cashValue) || cashValue < total) {
        toast.error('Jumlah pembayaran tidak mencukupi');
        return;
      }
    }

    // Update rider stocks
    cart.forEach(cartItem => {
      const riderStock = riderStocks.find(stock => stock.productId === cartItem.productId);
      if (riderStock) {
        riderStock.quantity -= cartItem.quantity;
      }
    });

    // Create transaction
    const newTransaction = {
      id: Date.now().toString(),
      riderId: user?.id || '',
      products: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
      paymentMethod,
      cashAmount: paymentMethod === 'cash' ? parseFloat(cashAmount) : undefined,
      change: paymentMethod === 'cash' ? parseFloat(cashAmount) - total : undefined,
      date: new Date().toISOString()
    };

    // Clear states
    setCart([]);
    setCashAmount('');
    setPaymentMethod('cash');
    setShowPaymentDialog(false);
    
    const successMessage = paymentMethod === 'cash' 
      ? `Transaksi berhasil! Total: Rp ${total.toLocaleString('id-ID')}, Kembalian: Rp ${(parseFloat(cashAmount) - total).toLocaleString('id-ID')}`
      : `Transaksi berhasil! Total: Rp ${total.toLocaleString('id-ID')} via QRIS`;
    
    toast.success(successMessage);
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
                <Card 
                  key={product.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    availableStock > 0 
                      ? 'hover:border-primary hover:bg-primary/5' 
                      : 'opacity-50'
                  }`}
                  onClick={() => {
                    if (availableStock > 0) {
                      addToCart(product);
                      // Tambahkan efek visual saat diklik
                      const audio = new Audio();
                      audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPz8/Pz8/TU1NTU1NW1tbW1tbaWlpaWl3d3d3d3eFhYWFhYWTk5OTk5OgoKCgoK6urq6urru7u7u7u8nJycnJydvb29vb2+jo6Ojo6Pf39/f39/////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAHjMxqze0AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/D+PimYavV8elKUpT5fqx5VjV6vZ38eJR48eRKa9KUp7v396UgPHkQwMAAAAAA//8MAOp39CECAAhlIEEIIECBAgTT1oj///tEQYT0wgEIYxgDC09aIiE7u7u7uIiIz+LtoRh+3//9xhgQAMAwAAAABhGBgDC8PAwADlASBhQMAgGIaDoYQA0BCmEANkARBBAyKCGR///+g0QSQxQT4iIYRhGEYRUy0eIiIz/////+MYxjQMSQMSQpjGMYwCEOFABk1HNRMQ09//DTmu7u7uBAAAAP/7kmRAAAIkKs4AexhQjkJJgBgJLgAAAaQAAAAgAAA0gAAABAmJkZGRoGMZC/k0eje7v1uBAAAAAAAAGGjTu7uIiIzKCGhoaCxkZGRoGMiIz///EcRxHMTEwAQEP/////gAAwAAAAAAAAAYADG8vH4AAAQAAAAAAAAAAAAAAA/+5JkQAAACgBJMAAAAIAAAlAAAAAAIAAAAAAAAAAAIAAAAAAEABsBBBAMIkAvvc7u7uBAAAAAAAAB+Q/EAGOPQ0NAGEAYTk0ePh+IAQM0ejRMQ09//DRM0eNHjR44ePGj0c3jQi5rNpCFAiNAoQEAAAAAA//73Q89PTWBgYGBAAAAAR/AAAAcR/CwD8DAD4//0ZAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMIAMnpzpz0P//9MTAwMR/EcRxHMTEwAQEP/////gAAwAAAAAAAAAYADAAAAAAAAAAAAAAA//uSZEAAAAAAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
                      audio.play();
                    }
                  }}
                >
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
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            returnToWarehouse(product.id);
                          }}
                          disabled={!riderStock || riderStock.quantity === 0}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {cartItem && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Dalam keranjang: {cartItem.quantity}
                      </div>
                    )}
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

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
            <DialogDescription>
              Total: Rp {calculateTotal().toLocaleString('id-ID')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Kolom Pembayaran Tunai */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-1">Tunai</h3>
                  <p className="text-sm text-muted-foreground">Pembayaran dengan uang tunai</p>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div className="space-y-2">
                    <Label htmlFor="cashAmount">Jumlah Tunai</Label>
                    <Input
                      id="cashAmount"
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="Masukkan jumlah uang"
                      className="text-lg"
                      autoFocus
                    />
                    {cashAmount && !isNaN(parseFloat(cashAmount)) && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Total: Rp {calculateTotal().toLocaleString('id-ID')}</div>
                        <div className="text-sm text-muted-foreground">
                          Kembalian: Rp {Math.max(0, parseFloat(cashAmount) - calculateTotal()).toLocaleString('id-ID')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kolom Pembayaran QRIS */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'qris' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('qris')}
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-1">QRIS</h3>
                  <p className="text-sm text-muted-foreground">Pembayaran dengan scan QR</p>
                </div>

                {paymentMethod === 'qris' && (
                  <div className="space-y-2">
                    <p className="text-sm text-center text-muted-foreground">Silakan scan QR code berikut</p>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex items-center justify-center">
                      <div>
                        <div className="text-4xl mb-2">📱</div>
                        <div className="text-sm text-muted-foreground">QR Code</div>
                        <div className="text-sm font-medium">Rp {calculateTotal().toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPaymentDialog(false);
                setCashAmount('');
                setPaymentMethod('cash');
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handlePaymentSubmit}
              disabled={
                (paymentMethod === 'cash' && (!cashAmount || parseFloat(cashAmount) < calculateTotal())) ||
                (paymentMethod === 'qris' && false) // Add QRIS validation here if needed
              }
              className="min-w-[140px]"
            >
              {paymentMethod === 'cash' 
                ? `Bayar ${cashAmount ? `(${parseFloat(cashAmount).toLocaleString('id-ID')})` : ''}` 
                : 'Konfirmasi QRIS'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;