
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { Menu, ShoppingCart, User, LogOut, Settings } from 'lucide-react';

const MobileNav = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            الرئيسية
          </Link>
          <Link
            to="/shop"
            className="text-lg font-medium hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            المتجر
          </Link>
          <Link
            to="/offers"
            className="text-lg font-medium hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            العروض
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            تواصل معنا
          </Link>

          <div className="border-t pt-4 mt-4">
            {user ? (
              <div className="space-y-4">
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 space-x-reverse text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={closeSheet}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>السلة</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 space-x-reverse text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={closeSheet}
                >
                  <User className="h-5 w-5" />
                  <span>الملف الشخصي</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center space-x-2 space-x-reverse text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={closeSheet}
                >
                  <Settings className="h-5 w-5" />
                  <span>طلباتي</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 h-auto text-lg font-medium hover:text-red-600"
                  onClick={() => {
                    signOut();
                    closeSheet();
                  }}
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 space-x-reverse text-lg font-medium hover:text-blue-600 transition-colors"
                onClick={closeSheet}
              >
                <User className="h-5 w-5" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
