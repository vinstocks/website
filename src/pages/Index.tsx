import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MarketTicker />
      <Hero />
      <AboutUs />
      <Features />
      <Services />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;