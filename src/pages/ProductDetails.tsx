import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Star, ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  category: {
    name_ar: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name_ar)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } else {
      setProduct(data as Product);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('product_reviews')
      .select('id,rating,comment,created_at,profiles(full_name)')
      .eq('product_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      setReviews([]);
    } else {
      setReviews(data as Review[]);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول لإضافة مراجعة');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }
    setSubmittingReview(true);

    const { error } = await supabase.from('product_reviews').insert({
      product_id: id,
      user_id: user.id,
      rating: newReview.rating,
      comment: newReview.comment
    });

    if (error) {
      toast.error('خطأ في إضافة المراجعة');
    } else {
      toast.success('تم إضافة المراجعة بنجاح');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    }
    setSubmittingReview(false);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">جاري تحميل المنتج...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">المنتج غير موجود</div>
        </div>
      </div>
    );
  }

  // Prepare image gallery from the images array
  const imageGallery = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => navigate('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للمتجر
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={imageGallery[currentImageIndex]}
                alt={product.name_ar}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              
              {/* Navigation arrows for multiple images */}
              {imageGallery.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              {imageGallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {imageGallery.length}
                </div>
              )}

              {/* Badges */}
              {product.is_featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  <Star className="h-3 w-3 ml-1" />
                  مميز
                </Badge>
              )}
              {product.original_price && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {imageGallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {imageGallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`صورة ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-blue-600 font-medium">
                {product.category?.name_ar}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {product.name_ar}
              </h1>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                ({reviews.length} مراجعة)
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description_ar}
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-3xl font-bold text-blue-600">
                  {product.price.toLocaleString()} جنيه
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.original_price.toLocaleString()} جنيه
                  </span>
                )}
              </div>
              <div className="text-gray-600">
                المخزون المتاح: {product.stock_quantity}
              </div>
            </div>

            <Button
              onClick={() => addToCart(product.id)}
              className="w-full py-3 text-lg"
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? (
                'نفدت الكمية'
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  أضف للسلة
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Review */}
          <Card>
            <CardHeader>
              <CardTitle>إضافة مراجعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">التقييم</label>
                    <div className="flex space-x-1 space-x-reverse">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-6 w-6 cursor-pointer ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setNewReview({ ...newReview, rating })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">التعليق</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="اكتب مراجعتك هنا..."
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="w-full"
                  >
                    {submittingReview ? 'جاري الإرسال...' : 'إرسال المراجعة'}
                  </Button>
                </>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  يجب تسجيل الدخول لإضافة مراجعة
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>المراجعات ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  لا توجد مراجعات بعد
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="font-medium">{review.profiles?.full_name || 'مستخدم'}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
