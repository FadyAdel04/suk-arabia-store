
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CouponInputProps {
  onApplyCoupon: (coupon: any, discount: number) => void;
  totalAmount: number;
  appliedCoupon?: any;
}

const CouponInput: React.FC<CouponInputProps> = ({ 
  onApplyCoupon, 
  totalAmount, 
  appliedCoupon 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    setLoading(true);

    try {
      // Query the actual coupons table
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        toast.error('كود الخصم غير صالح');
        setLoading(false);
        return;
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast.error('انتهت صلاحية كود الخصم');
        setLoading(false);
        return;
      }

      // Check usage limit
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        toast.error('تم استخدام كود الخصم بالحد الأقصى المسموح');
        setLoading(false);
        return;
      }

      // Check minimum order amount
      if (coupon.min_order_amount && totalAmount < coupon.min_order_amount) {
        toast.error(`الحد الأدنى للطلب ${coupon.min_order_amount} جنيه`);
        setLoading(false);
        return;
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = (totalAmount * coupon.discount_value) / 100;
      } else {
        discount = coupon.discount_value;
      }

      // Make sure discount doesn't exceed total amount
      discount = Math.min(discount, totalAmount);

      onApplyCoupon(coupon, discount);
      toast.success(`تم تطبيق كود الخصم! وفرت ${discount.toLocaleString()} جنيه`);
      setCouponCode('');
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('حدث خطأ في التحقق من كود الخصم');
    }

    setLoading(false);
  };

  const removeCoupon = () => {
    onApplyCoupon(null, 0);
    toast.success('تم إلغاء كود الخصم');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-800 font-medium">
              كود الخصم: {appliedCoupon.code}
            </p>
            <p className="text-green-600 text-sm">
              خصم {appliedCoupon.discount_type === 'percentage' 
                ? `${appliedCoupon.discount_value}%` 
                : `${appliedCoupon.discount_value} جنيه`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={removeCoupon}>
            إلغاء
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon">كود الخصم</Label>
      <div className="flex space-x-2 space-x-reverse">
        <Input
          id="coupon"
          placeholder="أدخل كود الخصم"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={validateCoupon}
          disabled={loading}
        >
          {loading ? 'جاري التحقق...' : 'تطبيق'}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
