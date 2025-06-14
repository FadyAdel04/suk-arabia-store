
import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface OnlinePaymentFormProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardHolder: string;
  };
}

const OnlinePaymentForm: React.FC<OnlinePaymentFormProps> = ({ values, onChange }) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="cardNumber">رقم البطاقة</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={values.cardNumber}
          onChange={onChange}
          inputMode="numeric"
          pattern="[0-9\s]{13,19}"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">تاريخ الإنتهاء</Label>
          <Input
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            maxLength={5}
            value={values.expiry}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            name="cvc"
            placeholder="123"
            maxLength={4}
            value={values.cvc}
            onChange={onChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="cardHolder">اسم صاحب البطاقة</Label>
        <Input
          id="cardHolder"
          name="cardHolder"
          placeholder="الإسم كما هو في البطاقة"
          value={values.cardHolder}
          onChange={onChange}
          required
        />
      </div>
      {/* Note: This is a demo form UI, no real processing! */}
    </div>
  );
};

export default OnlinePaymentForm;
