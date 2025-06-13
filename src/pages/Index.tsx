
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import PromotionalOffers from '@/components/PromotionalOffers';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <PromotionalOffers />
    </div>
  );
};

export default Index;
