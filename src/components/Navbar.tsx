import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Tags,
  FileText,
  Settings,
  LogOut,
  User,
  Menu,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      path: '/pos', 
      label: 'POS', 
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      path: '/products', 
      label: 'Produk', 
      icon: Package,
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      path: '/warehouse', 
      label: 'Gudang', 
      icon: Warehouse,
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      path: '/distribution', 
      label: 'Distribusi', 
      icon: Truck,
      gradient: 'from-teal-500 to-blue-500'
    },
    { 
      path: '/categories', 
      label: 'Kategori', 
      icon: Tags,
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      path: '/reports', 
      label: 'Laporan', 
      icon: FileText,
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      path: '/settings', 
      label: 'Pengaturan', 
      icon: Settings,
      gradient: 'from-gray-500 to-slate-500'
    },
  ];

  const riderNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      path: '/pos', 
      label: 'POS', 
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      path: '/reports', 
      label: 'Laporan', 
      icon: FileText,
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      path: '/settings', 
      label: 'Pengaturan', 
      icon: Settings,
      gradient: 'from-gray-500 to-slate-500'
    },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : riderNavItems;

  const NavLink = ({ item, mobile = false }: { item: any, mobile?: boolean }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsOpen(false)}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${isActive 
            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
          ${mobile ? 'w-full' : ''}
        `}
      >
        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
        <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
          {item.label}
        </span>
        {isActive && (
          <Sparkles className="h-4 w-4 text-white ml-auto animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                POS System
              </h1>
              <p className="text-xs text-gray-500">Smart & Colorful</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <Badge 
              className={`
                ${user?.role === 'admin' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                } 
                shadow-lg capitalize font-medium
              `}
            >
              {user?.role}
            </Badge>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-purple-200 hover:ring-purple-300 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Pengaturan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6 text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="text-center pb-4 border-b border-gray-200">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg inline-block mb-3">
                        <ShoppingCart className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        POS System
                      </h2>
                      <p className="text-sm text-gray-500">Smart & Colorful</p>
                    </div>
                    
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <NavLink key={item.path} item={item} mobile />
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;