import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Truck,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Point of Sale",
      description: "Interface penjualan yang mudah digunakan untuk kasir dan rider",
      gradient: "gradient-purple",
      hoverClass: "card-hover-purple",
      shadowClass: "shadow-purple"
    },
    {
      icon: Package,
      title: "Manajemen Produk",
      description: "Kelola produk, kategori, dan stok dengan mudah",
      gradient: "gradient-green",
      hoverClass: "card-hover-green",
      shadowClass: "shadow-green"
    },
    {
      icon: Truck,
      title: "Distribusi",
      description: "Distribusikan produk dari gudang ke rider secara efisien",
      gradient: "gradient-orange",
      hoverClass: "card-hover-orange",
      shadowClass: "shadow-orange"
    },
    {
      icon: BarChart3,
      title: "Laporan Lengkap",
      description: "Analisis penjualan, stok, dan performa dengan detail",
      gradient: "gradient-pink",
      hoverClass: "card-hover-pink",
      shadowClass: "shadow-pink"
    },
    {
      icon: Users,
      title: "Multi-User",
      description: "Sistem role-based untuk admin dan rider/kasir",
      gradient: "gradient-teal",
      hoverClass: "card-hover-purple",
      shadowClass: "shadow-purple"
    },
    {
      icon: Settings,
      title: "Pengaturan Fleksibel",
      description: "Kustomisasi sistem sesuai kebutuhan bisnis Anda",
      gradient: "gradient-blue",
      hoverClass: "card-hover-green",
      shadowClass: "shadow-green"
    }
  ];

  const benefits = [
    "Antarmuka yang intuitif dan mudah digunakan",
    "Manajemen stok real-time",
    "Laporan penjualan yang komprehensif",
    "Sistem distribusi terintegrasi",
    "Multi-role access control",
    "Responsive design untuk semua perangkat"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl gradient-purple">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                POS System
              </h1>
              <p className="text-xs text-gray-500">Smart & Colorful</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                Masuk
              </Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-purple text-white shadow-purple hover:shadow-lg transform hover:scale-105 transition-all">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Badge className="gradient-pink text-white px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Sistem Point of Sale Terdepan
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Kelola Bisnis
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              dengan Mudah
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistem POS lengkap dengan tampilan yang <span className="text-pink-500 font-semibold">colorful</span> dan 
            <span className="text-purple-500 font-semibold"> user-friendly</span>. 
            Dirancang khusus untuk kemudahan penggunaan dan efisiensi operasional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 gradient-purple text-white shadow-purple hover:shadow-xl transform hover:scale-105 transition-all">
                <Star className="mr-2 h-5 w-5" />
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300">
                Login ke Akun
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="gradient-green text-white px-4 py-2 mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Fitur Unggulan
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fitur Lengkap
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                untuk Bisnis Anda
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola bisnis retail dalam satu platform yang 
              <span className="text-purple-500 font-semibold"> colorful</span> dan 
              <span className="text-pink-500 font-semibold"> menyenangkan</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`border-0 shadow-xl ${feature.hoverClass} ${feature.shadowClass} transition-all duration-300 cursor-pointer`}>
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 gradient-purple text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white px-4 py-2 mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                Keunggulan Kami
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Mengapa Memilih
                <br />
                <span className="text-yellow-300">POS System Kami?</span>
              </h2>
              <p className="text-xl mb-8 text-purple-100 leading-relaxed">
                Solusi terpadu yang dirancang untuk meningkatkan efisiensi dan produktivitas bisnis Anda 
                dengan tampilan yang <span className="text-yellow-300 font-semibold">menarik</span> dan 
                <span className="text-pink-300 font-semibold"> mudah digunakan</span>.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="bg-green-400 p-1 rounded-full group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg text-purple-100 group-hover:text-white transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-white">Siap Memulai?</h3>
                  <p className="text-purple-100 mb-6 text-lg">
                    Bergabunglah dengan ribuan bisnis yang telah mempercayai sistem kami.
                  </p>
                </div>
                <Link to="/register">
                  <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all text-lg py-3">
                    <Star className="mr-2 h-5 w-5" />
                    Daftar Gratis Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="gradient-orange text-white px-4 py-2 mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistik Kami
            </Badge>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Dipercaya Ribuan Bisnis
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl card-hover-purple">
              <div className="text-5xl font-bold gradient-purple bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-600 text-lg font-medium">Bisnis Terdaftar</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl card-hover-green">
              <div className="text-5xl font-bold gradient-green bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-600 text-lg font-medium">Transaksi Harian</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl card-hover-orange">
              <div className="text-5xl font-bold gradient-orange bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-600 text-lg font-medium">Uptime Sistem</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 rounded-xl gradient-purple">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                POS System
              </h3>
              <p className="text-purple-300 text-sm">Smart & Colorful Solution</p>
            </div>
          </div>
          <p className="text-gray-300 mb-6 text-lg">
            Solusi Point of Sale terpercaya untuk bisnis modern dengan tampilan yang 
            <span className="text-purple-300 font-semibold"> colorful</span> dan 
            <span className="text-pink-300 font-semibold"> user-friendly</span>
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <Link to="/login" className="text-gray-300 hover:text-purple-300 transition-colors text-lg font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-300 hover:text-pink-300 transition-colors text-lg font-medium">
              Daftar
            </Link>
          </div>
          <div className="pt-8 border-t border-gray-700 text-gray-400">
            <p className="flex items-center justify-center">
              &copy; 2024 POS System. Dibuat dengan 
              <Heart className="w-4 h-4 mx-2 text-red-400" />
              menggunakan MGX Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}