
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً');
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-xl text-gray-600">
            نحن هنا للمساعدة! لا تتردد في التواصل معنا
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>أرسل لنا رسالة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input id="subject" name="subject" required />
                </div>
                <div>
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">الهاتف</p>
                    <p className="text-gray-600">+20 123 456 7890</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">البريد الإلكتروني</p>
                    <p className="text-gray-600">info@mystore.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">العنوان</p>
                    <p className="text-gray-600">القاهرة، مصر</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">ساعات العمل</p>
                    <p className="text-gray-600">السبت - الخميس: 9:00 ص - 6:00 م</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأسئلة الشائعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">ما هي طرق الدفع المتاحة؟</h4>
                  <p className="text-gray-600 text-sm">
                    نقبل الدفع عند الاستلام والدفع الإلكتروني عبر البطاقات البنكية
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">كم تستغرق عملية الشحن؟</h4>
                  <p className="text-gray-600 text-sm">
                    عادة ما تستغرق عملية الشحن من 2-5 أيام عمل داخل القاهرة و 5-7 أيام للمحافظات
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">هل يمكنني إرجاع المنتج؟</h4>
                  <p className="text-gray-600 text-sm">
                    نعم، يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
