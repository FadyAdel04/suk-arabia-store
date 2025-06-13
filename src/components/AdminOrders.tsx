
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  phone: string;
  notes: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  order_items: {
    quantity: number;
    price: number;
    product: {
      name_ar: string;
    };
  }[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        payment_method,
        shipping_address,
        phone,
        notes,
        created_at,
        profiles(full_name),
        order_items(
          quantity,
          price,
          product:products(name_ar)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast.error('خطأ في تحديث حالة الطلب');
    } else {
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchOrders();
    }
  };

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

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الطلبات</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">لا توجد طلبات</p>
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
                  العميل: {order.profiles?.full_name} | التاريخ: {new Date(order.created_at).toLocaleDateString('ar-EG')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">تفاصيل الاتصال:</h4>
                    <p className="text-sm">الهاتف: {order.phone}</p>
                    <p className="text-sm">العنوان: {order.shipping_address}</p>
                    {order.notes && (
                      <p className="text-sm">ملاحظات: {order.notes}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">تحديث الحالة:</h4>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="confirmed">مؤكد</SelectItem>
                        <SelectItem value="shipped">تم الشحن</SelectItem>
                        <SelectItem value="delivered">تم التسليم</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">المنتجات:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.product.name_ar} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString()} جنيه</span>
                      </div>
                    ))}
                  </div>
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
  );
};

export default AdminOrders;
