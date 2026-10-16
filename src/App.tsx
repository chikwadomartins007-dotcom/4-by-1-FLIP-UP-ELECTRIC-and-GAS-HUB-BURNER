import React, { useState, useEffect } from "react";
import { TopAnnouncementBar } from "./components/TopAnnouncementBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { OrderingSteps } from "./components/OrderingSteps";
import { TrustSection } from "./components/TrustSection";
import { WarrantyAfterSales } from "./components/WarrantyAfterSales";
import { OrderForm } from "./components/OrderForm";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { MobileStickyBar } from "./components/MobileStickyBar";
import { QuickOrderModal } from "./components/QuickOrderModal";
import { CrmPortal } from "./components/CrmPortal";
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

  // Exit-intent detection: opens the QuickOrderModal when cursor leaves towards top
  useExitIntent({
    enabled: !isQuickOrderOpen,
    threshold: 25,
    dwellTimeMs: 1500,
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

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Top Urgency Banner with Live Countdown Timer */}
      <TopAnnouncementBar />

      {/* 2. Header */}
      <Header
        onOrderClick={handleOpenOrder}
        onQuickOrderClick={handleOpenOrder}
        hasSubmittedOrder={Boolean(submittedOrderRef)}
        orderRef={submittedOrderRef}
      />

      {/* Main Direct-Response Landing Page Body — Clean, Focused, Simple */}
      <main className="flex-1">
        {/* 3. Hero Section (Clean 2-Column Showcase, Value Prop, Pricing & CTAs) */}
        <Hero
          onOrderClick={handleOpenOrder}
          onQuickOrderClick={handleOpenOrder}
          currentQuantity={quantity}
        />

        {/* 4. Easy & Straightforward to Use + Technical Blueprint & Aperture Specs */}
        <FeaturesGrid />

        {/* 5. How Ordering Works in Simple Steps */}
        <OrderingSteps />

        {/* 6. Customer Reviews & Verified Social Proof */}
        <TrustSection />

        {/* 7. 1-Year Product Warranty & Dedicated Technical Support */}
        <WarrantyAfterSales
          onOrderClick={handleOpenOrder}
          hasSubmittedOrder={Boolean(submittedOrderRef)}
        />

        {/* 8. Frequently Asked Questions */}
        <FAQ onOrderClick={handleOpenOrder} />

        {/* 9. Fill The Form Below To Place Order (Clean, Frictionless Checkout) */}
        <OrderForm
          quantity={quantity}
          onQuantityChange={setQuantity}
          onOrderSuccess={(ref) => setSubmittedOrderRef(ref)}
        />
      </main>

      {/* 10. Footer with Meta/Facebook Disclaimer & Staff CRM link */}
      <Footer onOpenCrm={() => setIsCrmOpen(true)} />

      {/* 11. Responsive Mobile Sticky Conversion Bar */}
      <MobileStickyBar
        quantity={quantity}
        total={pricing.total}
        onOrderClick={handleOpenOrder}
      />

      {/* 12. Fast 30-Second Express Quick Order Modal */}
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

      {/* 13. Executive Staff CRM & Meta Conversions API Hub Modal */}
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
