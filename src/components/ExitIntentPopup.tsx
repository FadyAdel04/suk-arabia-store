
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ 
  isOpen, 
  onClose, 
  onApplyCoupon 
}) => {
  const handleApplyCoupon = (code: string) => {
    onApplyCoupon(code);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2 space-x-reverse">
              <Gift className="h-6 w-6 text-yellow-500" />
              <span>انتظر! عرض خاص</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">خصم 15%</h3>
            <p className="text-lg">على جميع المنتجات</p>
          </div>
          
          <p className="text-gray-600">
            لا تفوت هذا العرض المحدود! احصل على خصم 15% على طلبك الأول
          </p>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => handleApplyCoupon('WELCOME15')}
            >
              احصل على الخصم الآن
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500"
              onClick={onClose}
            >
              لا شكراً، سأتصفح فقط
            </Button>
          </div>
          
          <div className="text-xs text-gray-400">
            * العرض صالح لفترة محدودة
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
