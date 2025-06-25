import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xl mb-4 inline-block">
              متجري
            </div>
            <p className="text-gray-300 mb-4">
              متجرك الإلكتروني الموثوق لأفضل المنتجات بأسعار منافسة وجودة عالية
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-primary transition-colors">
                  المتجر
                </Link>
              </li>
              <li>
                <Link to="/#" className="text-gray-300 hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/#" className="text-gray-300 hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link to="/#" className="text-gray-300 hover:text-primary transition-colors">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link to="/#" className="text-gray-300 hover:text-primary transition-colors">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link to="/#" className="text-gray-300 hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-300">+20 100 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-300">contact@mystore-eg.com</span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span className="text-gray-300">
                  الإسكندرية، جمهورية مصر العربية
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 متجري. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
