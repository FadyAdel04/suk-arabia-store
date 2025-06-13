
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="text-xl font-bold text-gray-900">متجري</span>
          </Link>

          {/* Navigation */}
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
              اتصل بنا
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
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
                    <Link to="/orders" className="flex items-center">
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings className="h-4 w-4 ml-2" />
                      لوحة الإدارة
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="flex items-center text-red-600">
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm">تسجيل الدخول</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
