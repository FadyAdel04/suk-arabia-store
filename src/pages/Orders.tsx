
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      name_ar: string;
    };
  }[];
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        payment_method,
        created_at,
        order_items(
          quantity,
          price,
          product:products(name_ar)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">جاري تحميل الطلبات...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'confirmed': return 'مؤكد';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">طلباتي</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لم تقم بأي طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>طلب #{order.id.slice(0, 8)}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.product.name_ar} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString()} جنيه</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-bold">المجموع: {order.total_amount.toLocaleString()} جنيه</span>
                    <span className="text-sm text-gray-600">
                      {order.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'دفع إلكتروني'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
