import React, { useState, useEffect } from "react";
import { TopAnnouncementBar } from "./components/TopAnnouncementBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Benefits } from "./components/Benefits";
import { SafetyFeatures } from "./components/SafetyFeatures";
import { FAQ } from "./components/FAQ";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { NationwideDeliverySection } from "./components/NationwideDeliverySection";
import { UpgradeComparison } from "./components/UpgradeComparison";
import { OrderingSteps } from "./components/OrderingSteps";
import { TrustSection } from "./components/TrustSection";
import { WarrantyAfterSales } from "./components/WarrantyAfterSales";
import { FinalSalesSection } from "./components/FinalSalesSection";
import { SavingsCalculator } from "./components/SavingsCalculator";
import { OrderForm } from "./components/OrderForm";
import { SocialProofTicker } from "./components/SocialProofTicker";
import { Footer } from "./components/Footer";
import { MobileStickyBar } from "./components/MobileStickyBar";
import { QuickOrderModal } from "./components/QuickOrderModal";
import { FloatingSupportButton } from "./components/FloatingSupportButton";
import { CrmPortal } from "./components/CrmPortal";
import { ReadingProgressBar } from "./components/ReadingProgressBar";
import { useExitIntent } from "./hooks/useExitIntent";
import { initAttribution } from "./utils/attribution";
import { Analytics } from "./utils/analytics";
import { calculatePricing } from "./utils/pricing";

export const App: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);
  const [isExitIntentTriggered, setIsExitIntentTriggered] = useState<boolean>(false);
  const [isCrmOpen, setIsCrmOpen] = useState<boolean>(false);
  const [submittedOrderRef, setSubmittedOrderRef] = useState<string>("");

  // Check URL hash for direct staff access e.g. #crm
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#crm" || window.location.pathname.startsWith("/crm")) {
        setIsCrmOpen(true);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

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

  // Recurring 35-Second Timer: Automatically shows Instant Order Desk every 35 seconds
  useEffect(() => {
    // When modal is already open, do not schedule another popup
    if (isQuickOrderOpen) return;

    const timer = setTimeout(() => {
      setIsExitIntentTriggered(false);
      setIsQuickOrderOpen(true);
      Analytics.trackCTAClick("35-Second Timed Instant Order Desk", "#quick-order-modal");
    }, 35000);

    return () => clearTimeout(timer);
  }, [isQuickOrderOpen]);

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
      {/* 0. Slim Scroll Reading Progress Bar at the Very Top of Window */}
      <ReadingProgressBar />

      {/* 1. Top Urgency Banner with Live Countdown Timer */}
      <TopAnnouncementBar />

      {/* 2. Header */}
      <Header
        onOrderClick={handleOpenOrder}
        onQuickOrderClick={handleOpenOrder}
        hasSubmittedOrder={Boolean(submittedOrderRef)}
        orderRef={submittedOrderRef}
      />

      {/* Main Direct-Response Landing Page Body */}
      <main className="flex-1">
        {/* 3. Hero Section (Split 12-Col Hero, Sticky Marquee, Factory-Direct Offer Box, Dark Challenge Section) */}
        <Hero
          onOrderClick={handleOpenOrder}
          onQuickOrderClick={handleOpenOrder}
          currentQuantity={quantity}
        />

        {/* 4. Why You'll Love It (Checkmark Bullets) */}
        <Benefits />

        {/* 5. Certified Safety Features (Auto-Shutoff & Gas Leakage Protection) */}
        <SafetyFeatures onOrderClick={handleOpenOrder} />

        {/* 6. Frequently Asked Questions + Second CTA Button */}
        <FAQ onOrderClick={handleOpenOrder} />

        {/* 7. Easy & Straightforward to Use + Technical Blueprint Specs */}
        <FeaturesGrid />

        {/* 7.5. Nationwide Delivery: 24-48 Hours to Major Nigerian Cities (Map Pin & Trust Badge Style) */}
        <NationwideDeliverySection onOrderClick={handleOpenOrder} />

        {/* 8. Ordinary Tabletop vs Luxury Built-In Upgrade Comparison */}
        <UpgradeComparison onOrderClick={handleOpenOrder} />

        {/* 9. How Ordering Works in 4 Transparent Steps */}
        <OrderingSteps />

        {/* 10. Customer Reviews + Facebook Reactions + 100% Satisfaction Guarantee */}
        <TrustSection />

        {/* 10.5. 1-Year Product Warranty & Dedicated After-Sales Technical Support */}
        <WarrantyAfterSales
          onOrderClick={handleOpenOrder}
          hasSubmittedOrder={Boolean(submittedOrderRef)}
        />

        {/* 11. Special Information Before You Order (Strikethrough Price, Promo Price, Dashed Red Policy Box) */}
        <FinalSalesSection
          quantity={quantity}
          onOrderClick={handleOpenOrder}
        />

        {/* 12. Visual Multi-Unit Bulk Savings Calculator Widget */}
        <SavingsCalculator
          quantity={quantity}
          onQuantityChange={setQuantity}
        />

        {/* 13. Fill The Form Below To Place Order (Fluent Form Style) */}
        <OrderForm
          quantity={quantity}
          onQuantityChange={setQuantity}
          onOrderSuccess={(ref) => setSubmittedOrderRef(ref)}
        />
      </main>

      {/* Social Proof Live Order Ticker above Footer */}
      <SocialProofTicker />

      {/* 14. Footer with Meta/Facebook Disclaimer & Staff CRM link */}
      <Footer onOpenCrm={() => setIsCrmOpen(true)} />

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
        onOrderSuccess={(ref) => setSubmittedOrderRef(ref)}
      />

      {/* 16. Floating Support & Quick FAQ Button */}
      <FloatingSupportButton hasSubmittedOrder={Boolean(submittedOrderRef)} />

      {/* 17. Executive Staff CRM & Meta Conversions API Hub Modal */}
      <CrmPortal
        isOpen={isCrmOpen}
        onClose={() => {
          setIsCrmOpen(false);
          if (window.location.hash === "#crm") {
            try {
              history.replaceState(null, "", " ");
            } catch {}
          }
        }}
      />
    </div>
  );
};

export default App;
