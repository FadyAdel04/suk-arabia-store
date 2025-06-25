
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: null as number | null,
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      toast.error('خطأ في تحميل الكوبونات');
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  const handleAddCoupon = async () => {
    const { error } = await supabase
      .from('coupons')
      .insert({
        code: newCoupon.code.toUpperCase(),
        discount_type: newCoupon.discount_type,
        discount_value: newCoupon.discount_value,
        min_order_amount: newCoupon.min_order_amount || null,
        max_uses: newCoupon.max_uses,
        expires_at: newCoupon.expires_at || null,
        is_active: newCoupon.is_active
      });

    if (error) {
      console.error('Error adding coupon:', error);
      toast.error('خطأ في إضافة الكوبون');
    } else {
      toast.success('تم إضافة الكوبون بنجاح');
      setIsAddingNew(false);
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: 0,
        max_uses: null,
        expires_at: '',
        is_active: true
      });
      fetchCoupons();
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;

    const { error } = await supabase
      .from('coupons')
      .update({
        code: editingCoupon.code.toUpperCase(),
        discount_type: editingCoupon.discount_type,
        discount_value: editingCoupon.discount_value,
        min_order_amount: editingCoupon.min_order_amount || null,
        max_uses: editingCoupon.max_uses,
        expires_at: editingCoupon.expires_at || null,
        is_active: editingCoupon.is_active
      })
      .eq('id', editingCoupon.id);

    if (error) {
      console.error('Error updating coupon:', error);
      toast.error('خطأ في تحديث الكوبون');
    } else {
      toast.success('تم تحديث الكوبون بنجاح');
      setEditingCoupon(null);
      fetchCoupons();
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting coupon:', error);
      toast.error('خطأ في حذف الكوبون');
    } else {
      toast.success('تم حذف الكوبون بنجاح');
      fetchCoupons();
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل الكوبونات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الكوبونات</h2>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة كوبون جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة كوبون جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">كود الكوبون</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
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
                <Label htmlFor="max_uses">عدد مرات الاستخدام المسموح</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={newCoupon.max_uses || ''}
                  onChange={(e) => setNewCoupon({ 
                    ...newCoupon, 
                    max_uses: e.target.value ? Number(e.target.value) : null 
                  })}
                  placeholder="غير محدود"
                />
              </div>

              <div>
                <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={newCoupon.expires_at}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
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
                  إضافة الكوبون
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
                      <Badge variant="secondary">نشط</Badge>
                    ) : (
                      <Badge variant="destructive">غير نشط</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      الخصم: {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}%` 
                        : `${coupon.discount_value} جنيه`}
                    </p>
                    {coupon.min_order_amount && (
                      <p>الحد الأدنى: {coupon.min_order_amount} جنيه</p>
                    )}
                    {coupon.max_uses && (
                      <p>الاستخدام: {coupon.used_count}/{coupon.max_uses}</p>
                    )}
                    {coupon.expires_at && (
                      <p>ينتهي: {new Date(coupon.expires_at).toLocaleDateString('ar-EG')}</p>
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
                        <DialogTitle>تعديل الكوبون</DialogTitle>
                      </DialogHeader>
                      {editingCoupon && (
                        <div className="space-y-4">
                          {/* Same form fields as add coupon but with editingCoupon state */}
                          <div>
                            <Label htmlFor="edit_code">كود الكوبون</Label>
                            <Input
                              id="edit_code"
                              value={editingCoupon.code}
                              onChange={(e) => setEditingCoupon({ 
                                ...editingCoupon, 
                                code: e.target.value.toUpperCase() 
                              })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit_discount_type">نوع الخصم</Label>
                            <Select 
                              value={editingCoupon.discount_type} 
                              onValueChange={(value: 'percentage' | 'fixed') => 
                                setEditingCoupon({ ...editingCoupon, discount_type: value })
                              }
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
                            <Label htmlFor="edit_discount_value">
                              قيمة الخصم {editingCoupon.discount_type === 'percentage' ? '(%)' : '(جنيه)'}
                            </Label>
                            <Input
                              id="edit_discount_value"
                              type="number"
                              value={editingCoupon.discount_value}
                              onChange={(e) => setEditingCoupon({ 
                                ...editingCoupon, 
                                discount_value: Number(e.target.value) 
                              })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit_min_order_amount">الحد الأدنى للطلب (جنيه)</Label>
                            <Input
                              id="edit_min_order_amount"
                              type="number"
                              value={editingCoupon.min_order_amount || ''}
                              onChange={(e) => setEditingCoupon({ 
                                ...editingCoupon, 
                                min_order_amount: e.target.value ? Number(e.target.value) : undefined 
                              })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit_max_uses">عدد مرات الاستخدام المسموح</Label>
                            <Input
                              id="edit_max_uses"
                              type="number"
                              value={editingCoupon.max_uses || ''}
                              onChange={(e) => setEditingCoupon({ 
                                ...editingCoupon, 
                                max_uses: e.target.value ? Number(e.target.value) : undefined 
                              })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit_expires_at">تاريخ انتهاء الصلاحية</Label>
                            <Input
                              id="edit_expires_at"
                              type="datetime-local"
                              value={editingCoupon.expires_at ? 
                                new Date(editingCoupon.expires_at).toISOString().slice(0, 16) : ''
                              }
                              onChange={(e) => setEditingCoupon({ 
                                ...editingCoupon, 
                                expires_at: e.target.value || undefined 
                              })}
                            />
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Switch
                              id="edit_is_active"
                              checked={editingCoupon.is_active}
                              onCheckedChange={(checked) => setEditingCoupon({ 
                                ...editingCoupon, 
                                is_active: checked 
                              })}
                            />
                            <Label htmlFor="edit_is_active">نشط</Label>
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
