import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import OnlinePaymentForm from '@/components/OnlinePaymentForm';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod'
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardHolder: ''
  });

  // Fetch profile and autofill shipping info
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, address, city')
          .eq('id', user.id)
          .single();
        if (data) {
          setFormData((prev) => ({
            ...prev,
            fullName: data.full_name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || ''
          }));
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: 'pending',
          payment_method: formData.paymentMethod,
          shipping_address: `${formData.address}, ${formData.city}`,
          phone: formData.phone,
          notes: formData.notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items & decrease product quantity
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Decrement product stock (run in parallel for all)
      for (const item of items) {
        await supabase
          .from('products')
          .update({ stock_quantity: item.product.stock_quantity - item.quantity })
          .eq('id', item.product_id);
      }

      // 4. Clear cart
      await clearCart();

      toast.success('تم إرسال طلبك بنجاح!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('حدث خطأ في إرسال الطلب');
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
            <div className="flex justify-center mt-4">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الشحن</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="button" onClick={nextStep} className="w-full">
                    التالي
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>مراجعة الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 space-x-reverse border-b pb-4">
                        <img
                          src={item.product.image_url || '/placeholder.svg'}
                          alt={item.product.name_ar}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.product.name_ar}</div>
                          {/* Remove description_ar as it's not in item.product type */}
                          {/* <div className="text-gray-500 text-sm line-clamp-2">{item.product.description_ar}</div> */}
                          <div className="text-gray-600 mt-2 flex gap-2">
                            <span>الكمية: <span className="font-semibold">{item.quantity}</span></span>
                            <span>السعر: <span className="font-semibold">{item.product.price.toLocaleString()} جنيه</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>المجموع الكلي:</span>
                        <span>{totalPrice.toLocaleString()} جنيه</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 space-x-reverse">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      السابق
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-1">
                      التالي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>طريقة الدفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">الدفع عند الاستلام</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">الدفع الإلكتروني</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'online' && (
                    <OnlinePaymentForm values={paymentData} onChange={handlePaymentInputChange} />
                  )}

                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="أي ملاحظات خاصة بالطلب..."
                    />
                  </div>

                  <div className="flex space-x-4 space-x-reverse">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      السابق
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
