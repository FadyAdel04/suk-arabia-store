
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MobileNav from './MobileNav';

const Header = () => {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            متجرنا
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              الرئيسية
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 transition-colors">
              المتجر
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-blue-600 transition-colors">
              العروض
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              تواصل معنا
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      الملف الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full">
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full">
                      لوحة الإدارة
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
