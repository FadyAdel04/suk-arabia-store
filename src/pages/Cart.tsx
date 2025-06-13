
import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">جاري تحميل السلة...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
          <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <Link to="/shop">
            <Button>تصفح المنتجات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة التسوق</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name_ar}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name_ar}
                      </h3>
                      <p className="text-lg font-bold text-blue-600">
                        {item.product.price.toLocaleString()} جنيه
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{totalPrice.toLocaleString()} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم الشحن:</span>
                    <span>مجاني</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع الكلي:</span>
                      <span>{totalPrice.toLocaleString()} جنيه</span>
                    </div>
                  </div>
                </div>
                <Link to="/checkout" className="block mt-6">
                  <Button className="w-full" size="lg">
                    إتمام الطلب
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
