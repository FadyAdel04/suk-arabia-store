
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error('خطأ في تسجيل الدخول: ' + error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast.error('خطأ في إنشاء الحساب: ' + error.message);
    } else {
      toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            مرحباً بك في متجري
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            قم بتسجيل الدخول أو إنشاء حساب جديد
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>تسجيل الدخول</CardTitle>
                <CardDescription>
                  ادخل بياناتك لتسجيل الدخول إلى حسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">كلمة المرور</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>إنشاء حساب جديد</CardTitle>
                <CardDescription>
                  املأ البيانات التالية لإنشاء حساب جديد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
