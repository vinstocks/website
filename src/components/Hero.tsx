import { ArrowRight } from "lucide-react";
import ChartBackground from "./ChartBackground";
import CoinStack from "./illustrations/CoinStack";
import logo from "@/assets/logo.png";
import WhatsAppIcon from "@/assets/WhatsAppIcon";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen pt-24 md:pt-28 lg:pt-32">
      <ChartBackground />

      {/* Decorative illustrations */}
      <div className="absolute left-10 top-1/3 hidden lg:block animate-float">
        {/* <ChartArrow className="w-32 h-24 opacity-60" /> */}
      </div>
      <div className="absolute right-10 bottom-1/4 hidden lg:block animate-float animation-delay-400">
        <CoinStack className="w-24 h-32 opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto text-center flex flex-col md:flex-row-reverse justify-center items-center gap-4 md:gap-8 lg:gap-20">
          {/* Logo with float animation */}

          <div
            className="flex relative h-64 md:h-80 lg:h-full items-center justify-center animate-slideInRight"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-40 animate-pulse" />

            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse" />
              <div
                className="absolute inset-8 rounded-full border border-secondary/30 animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="absolute inset-4 rounded-full border border-accent/20 animate-rotate-slow"
                style={{ animationDelay: "0.6s" }}
              />

              <div className="relative w-full h-full animate-float flex items-center justify-center">
                <img
                  src={logo}
                  alt="Vinstocks Bull Logo"
                  width={320}
                  height={320}
                  className="w-full h-full  object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Floating particles effect */}
            <div
              className="absolute top-0 right-0 w-24 h-24 border border-primary/30 rounded-lg transform animate-rotate-slow opacity-20"
              style={{ animationDuration: "15s" }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 border border-secondary/20 rounded-lg transform animate-rotate-slow opacity-15"
              style={{
                animationDuration: "20s",
                animationDirection: "reverse",
              }}
            />
          </div>

          <div>
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
              <span className="text-foreground">Real Strategies</span>
              <br />
              <span className="text-gradient">Real Stocks</span>
              <br />
              <span className="text-foreground">Real Confidence</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-400">
              We track only fundamentally strong stocks, focus on timing, and
              let performance speak for itself. Your trust is earned, not
              assumed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:opacity-90 transition-all glow-primary"
              >
                Learn more
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/917977524553?text=Hello%20Vinstocks%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-lg hover:bg-[#20BA5A] transition-all shadow-sm"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 pt-8 border-t border-border animate-fade-in-up animation-delay-600">
            <div>
              <div className="text-2xl md:text-4xl font-bold text-gradient">5+</div>
              <div className="text-sm md:text-base text-muted-foreground">Years of Back-Tested Algos</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-success">3x-10x</div>
              <div className="text-sm md:text-base text-muted-foreground">Potential Returns</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-secondary">100%</div>
              <div className="text-sm md:text-base text-muted-foreground">Fundamentally Strong</div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
