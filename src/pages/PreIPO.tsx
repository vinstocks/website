import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TopGainers, TopLosers } from "@/components/MarketTicker";
import WhatsAppIcon from "@/assets/WhatsAppIcon";
import illustration from "@/assets/preipo/illustration.png";
import company1 from "@/assets/preipo/Screenshot 2025-12-16 030755.jpg";
import company2 from "@/assets/preipo/Screenshot 2025-12-16 030840.jpg";
import company3 from "@/assets/preipo/Screenshot 2025-12-16 030918.jpg";
import company4 from "@/assets/preipo/Screenshot 2025-12-16 030950.jpg";
import company5 from "@/assets/preipo/Screenshot 2025-12-16 031010.jpg";
import company6 from "@/assets/preipo/image-removebg-preview.png";

const companies = [
  { id: 1, image: company1, name: "Bira" },
  { id: 2, image: company2, name: "Capgemini" },
  { id: 3, image: company3, name: "HDB Financial Services" },
  { id: 4, image: company4, name: "OYO" },
  { id: 5, image: company5, name: "Chennai Super Kings" },
  { id: 6, image: company6, name: "NSE" },
];

const PreIPO = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isPreIPOPage={true} />
      <TopGainers />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                Pre-IPO's • Unlisted Shares
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Why wait for IPO when you{" "}
                <span className="text-gradient">can invest beforehand?</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground">
                Add <span className="text-primary font-semibold">Multibaggers</span> in your portfolio{" "}
                <span className="text-secondary font-semibold">before it goes public.</span>
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="#companies"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all hover:scale-105"
                >
                  Explore Opportunities
                </a>
                <a
                  href={`https://wa.me/917977524553?text=${encodeURIComponent(
                    "Hi Vinstocks, I want to know more about Pre-IPO investments."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Contact Us
                </a>
              </div>
            </div>
            
            {/* Right - Illustration */}
            <div className="relative hidden lg:flex justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-md">
                <img
                  src={illustration}
                  alt="Pre-IPO Investment Illustration"
                  className="w-full h-auto rounded-2xl opacity-90"
                />
              </div>
              {/* Decorative gradient blob */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Companies Grid */}
      <section id="companies" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Available <span className="text-gradient">Pre-IPO Opportunities</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Invest in high-growth companies before they go public
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center gap-4"
              >
                <div className="w-full aspect-square rounded-xl bg-white p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/917977524553?text=${encodeURIComponent(
                        `Hi Vinstocks, I want to know more about ${company.name} Pre-IPO opportunity.`
                      )}`,
                      "_blank"
                    );
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary hover:text-white transition-all text-sm"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <TopLosers />
      <Footer />
    </div>
  );
};

export default PreIPO;
