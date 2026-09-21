import React, { useState, useEffect } from "react";
import { TopAnnouncementBar } from "./components/TopAnnouncementBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Benefits } from "./components/Benefits";
import { ProductVideo } from "./components/ProductVideo";
import { FAQ } from "./components/FAQ";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { UpgradeComparison } from "./components/UpgradeComparison";
import { OrderingSteps } from "./components/OrderingSteps";
import { TrustSection } from "./components/TrustSection";
import { FinalSalesSection } from "./components/FinalSalesSection";
import { OrderForm } from "./components/OrderForm";
import { Footer } from "./components/Footer";
import { MobileStickyBar } from "./components/MobileStickyBar";
import { QuickOrderModal } from "./components/QuickOrderModal";
import { FloatingSupportButton } from "./components/FloatingSupportButton";
import { useExitIntent } from "./hooks/useExitIntent";
import { initAttribution } from "./utils/attribution";
import { Analytics } from "./utils/analytics";
import { calculatePricing } from "./utils/pricing";

export const App: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);
  const [isExitIntentTriggered, setIsExitIntentTriggered] = useState<boolean>(false);

  // Exit-intent detection: opens the QuickOrderModal when cursor moves towards top edge
  useExitIntent({
    enabled: !isQuickOrderOpen,
    threshold: 35,
    dwellTimeMs: 2000,
    onExitIntent: () => {
      setIsExitIntentTriggered(true);
      setIsQuickOrderOpen(true);
      Analytics.trackCTAClick("Exit Intent Triggered", "#quick-order-modal");
    },
  });

  useEffect(() => {
    // 1. Initialize attribution (UTMs, fbclid, cookies)
    initAttribution();

    // 2. Track PageView & ViewContent
    Analytics.trackPageView();
    Analytics.trackViewContent(280000);
  }, []);

  const pricing = calculatePricing(quantity);

  const handleOpenOrder = () => {
    setIsExitIntentTriggered(false);
    setIsQuickOrderOpen(true);
  };

  const scrollToOrderForm = () => {
    const el = document.getElementById("order-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Top Urgency Banner with Live Countdown Timer */}
      <TopAnnouncementBar />

      {/* 2. Header */}
      <Header onOrderClick={handleOpenOrder} />

      {/* Main Direct-Response Landing Page Body */}
      <main className="flex-1">
        {/* 3. Hero Section (Headline, Subtitle, Centered Image, Feature Highlights, Bold Quote, 3 Photos, CTA Button) */}
        <Hero
          onOrderClick={handleOpenOrder}
          currentQuantity={quantity}
        />

        {/* 4. Why You'll Love It (Checkmark Bullets) */}
        <Benefits />

        {/* 5. Showroom Demonstration Video Section (16:9 Dark Bezel Container) */}
        <ProductVideo onOrderClick={handleOpenOrder} />

        {/* 6. Frequently Asked Questions + Second CTA Button */}
        <FAQ onOrderClick={handleOpenOrder} />

        {/* 7. Easy & Straightforward to Use + Technical Blueprint Specs */}
        <FeaturesGrid />

        {/* 8. Ordinary Tabletop vs Luxury Built-In Upgrade Comparison */}
        <UpgradeComparison onOrderClick={handleOpenOrder} />

        {/* 9. How Ordering Works in 4 Transparent Steps */}
        <OrderingSteps />

        {/* 10. Customer Reviews + Facebook Reactions + 100% Satisfaction Guarantee */}
        <TrustSection />

        {/* 11. Special Information Before You Order (Strikethrough Price, Promo Price, Dashed Red Policy Box) */}
        <FinalSalesSection
          quantity={quantity}
          onOrderClick={handleOpenOrder}
        />

        {/* 12. Fill The Form Below To Place Order (Fluent Form Style) */}
        <OrderForm
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </main>

      {/* 13. Footer with Meta/Facebook Disclaimer & Copyright */}
      <Footer />

      {/* 14. Responsive Mobile Sticky Conversion Bar */}
      <MobileStickyBar
        quantity={quantity}
        total={pricing.total}
        onOrderClick={handleOpenOrder}
      />

      {/* 15. Fast 30-Second Express Quick Order Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => {
          setIsQuickOrderOpen(false);
          setIsExitIntentTriggered(false);
        }}
        quantity={quantity}
        onQuantityChange={setQuantity}
        isExitIntent={isExitIntentTriggered}
      />

      {/* 16. Floating Support & Quick FAQ Button */}
      <FloatingSupportButton />
    </div>
  );
};

export default App;
