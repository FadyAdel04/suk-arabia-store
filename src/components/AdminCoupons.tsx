
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: null as number | null,
    expires_at: null as string | null,
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    // For now, using hardcoded data since the types aren't updated yet
    const hardcodedCoupons: Coupon[] = [
      {
        id: '1',
        code: 'WELCOME15',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_amount: 0,
        max_uses: null,
        used_count: 0,
        expires_at: null,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        code: 'SAVE50',
        discount_type: 'fixed',
        discount_value: 50,
        min_order_amount: 200,
        max_uses: 100,
        used_count: 50,
        expires_at: null,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    
    setCoupons(hardcodedCoupons);
    setLoading(false);
  };

  const handleAddCoupon = async () => {
    // For now, just add to local state since DB types aren't updated
    const newCouponData: Coupon = {
      id: Date.now().toString(),
      ...newCoupon,
      used_count: 0,
      created_at: new Date().toISOString()
    };
    
    setCoupons([...coupons, newCouponData]);
    toast.success('تم إضافة كود الخصم بنجاح');
    setIsAddingNew(false);
    setNewCoupon({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_uses: null,
      expires_at: null,
      is_active: true
    });
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;
    
    setCoupons(coupons.map(c => c.id === editingCoupon.id ? editingCoupon : c));
    toast.success('تم تحديث كود الخصم بنجاح');
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = async (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success('تم حذف كود الخصم بنجاح');
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل أكواد الخصم...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة أكواد الخصم</h2>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة كود خصم جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة كود خصم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">كود الخصم</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: SAVE20"
                />
              </div>

              <div>
                <Label htmlFor="discount_type">نوع الخصم</Label>
                <Select 
                  value={newCoupon.discount_type} 
                  onValueChange={(value: 'percentage' | 'fixed') => setNewCoupon({ ...newCoupon, discount_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount_value">
                  قيمة الخصم {newCoupon.discount_type === 'percentage' ? '(%)' : '(جنيه)'}
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={newCoupon.discount_value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="min_order_amount">الحد الأدنى للطلب (جنيه)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={newCoupon.min_order_amount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="max_uses">الحد الأقصى للاستخدام (اتركه فارغاً لعدم التحديد)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={newCoupon.max_uses || ''}
                  onChange={(e) => setNewCoupon({ 
                    ...newCoupon, 
                    max_uses: e.target.value ? Number(e.target.value) : null 
                  })}
                />
              </div>

              <div>
                <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية (اختياري)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={newCoupon.expires_at || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value || null })}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="is_active"
                  checked={newCoupon.is_active}
                  onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, is_active: checked })}
                />
                <Label htmlFor="is_active">نشط</Label>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button onClick={handleAddCoupon} className="flex-1">
                  إضافة كود الخصم
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{coupon.code}</h3>
                    {coupon.is_active ? (
                      <Badge variant="default">نشط</Badge>
                    ) : (
                      <Badge variant="destructive">غير نشط</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      الخصم: {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}%` 
                        : `${coupon.discount_value} جنيه`}
                    </span>
                    <span>الحد الأدنى: {coupon.min_order_amount} جنيه</span>
                    {coupon.max_uses && (
                      <span>الاستخدام: {coupon.used_count}/{coupon.max_uses}</span>
                    )}
                    {coupon.expires_at && (
                      <span>ينتهي: {new Date(coupon.expires_at).toLocaleDateString('ar-EG')}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCoupon(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تعديل كود الخصم</DialogTitle>
                      </DialogHeader>
                      {editingCoupon && (
                        <div className="space-y-4">
                          {/* Similar form fields as add coupon */}
                          <div>
                            <Label htmlFor="edit_code">كود الخصم</Label>
                            <Input
                              id="edit_code"
                              value={editingCoupon.code}
                              onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                            />
                          </div>
                          
                          <div className="flex space-x-2 space-x-reverse">
                            <Button onClick={handleUpdateCoupon} className="flex-1">
                              حفظ التغييرات
                            </Button>
                            <Button variant="outline" onClick={() => setEditingCoupon(null)}>
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
