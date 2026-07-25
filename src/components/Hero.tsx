import { ArrowRight, CalendarCheck } from "lucide-react";
import ChartBackground from "./ChartBackground";
import CoinStack from "./illustrations/CoinStack";
import logo from "@/assets/logo.png";

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

          <div className="flex relative h-64 md:h-80 lg:h-full items-center justify-center">
            {/* Glowing uptrend candlestick chart behind the bull */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 280 220" className="w-64 h-52 md:w-80 md:h-64 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="candle-glow-red" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="candle-glow-green" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Candle 1 - red */}
                <g filter="url(#candle-glow-red)">
                  <line x1="40" y1="100" x2="40" y2="170" stroke="#ef4444" strokeWidth="2" />
                  <rect x="32" y="120" width="16" height="40" rx="2" fill="#ef4444" />
                </g>
                {/* Candle 2 - green */}
                <g filter="url(#candle-glow-green)">
                  <line x1="75" y1="90" x2="75" y2="165" stroke="#22c55e" strokeWidth="2" />
                  <rect x="67" y="90" width="16" height="50" rx="2" fill="#22c55e" />
                </g>
                {/* Candle 3 - red */}
                <g filter="url(#candle-glow-red)">
                  <line x1="110" y1="80" x2="110" y2="145" stroke="#ef4444" strokeWidth="2" />
                  <rect x="102" y="95" width="16" height="30" rx="2" fill="#ef4444" />
                </g>
                {/* Candle 4 - green */}
                <g filter="url(#candle-glow-green)">
                  <line x1="145" y1="55" x2="145" y2="130" stroke="#22c55e" strokeWidth="2" />
                  <rect x="137" y="55" width="16" height="50" rx="2" fill="#22c55e" />
                </g>
                {/* Candle 5 - green */}
                <g filter="url(#candle-glow-green)">
                  <line x1="180" y1="35" x2="180" y2="110" stroke="#22c55e" strokeWidth="2" />
                  <rect x="172" y="35" width="16" height="55" rx="2" fill="#22c55e" />
                </g>
                {/* Candle 6 - green */}
                <g filter="url(#candle-glow-green)">
                  <line x1="215" y1="20" x2="215" y2="90" stroke="#22c55e" strokeWidth="2" />
                  <rect x="207" y="20" width="16" height="45" rx="2" fill="#22c55e" />
                </g>
              </svg>
            </div>

            {/* Animated green uptrend line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 300 240" className="w-72 h-56 md:w-96 md:h-72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <linearGradient id="line-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 210 L35 185 L50 195 L75 155 L90 170 L115 120 L130 140 L155 90 L170 110 L195 55 L215 75 L245 25 L270 15"
                  stroke="url(#line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#line-glow)"
                  className="uptrend-line"
                />
                {/* Glowing dot at the tip */}
                <circle cx="270" cy="15" r="4" fill="#4ade80" filter="url(#line-glow)" className="uptrend-dot" />
              </svg>
            </div>

            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <div className="relative w-full h-full animate-float flex items-center justify-center">
                <img
                  src={logo}
                  alt="Vinstocks Bull Logo"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          <div>
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 heading-serif animate-fade-in-up animation-delay-200">
              <span className="text-foreground">Real Strategies</span>
              <br />
              <span className="text-gradient">Real Stocks</span>
              <br />
              <span className="text-foreground">Real Confidence</span>
            </h1>

            {/* Subheadline */}
            {/* <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-400">
              We track only fundamentally strong stocks, focus on timing, and
              let performance speak for itself. Your trust is earned, not
              assumed.
            </p> */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in-up animation-delay-400">
              We track only fundamentally strong stocks, focus on timing, and
              let performance speak for itself. Your trust is earned, not
              assumed.
            </p>

            <p className="text-2xl md:text-3xl font-bold text-gradient tracking-wide max-w-2xl mx-auto mb-2 animate-fade-in-up animation-delay-500">
              SEBI REGISTERED
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 animate-fade-in-up animation-delay-500">
              Reg. No: INA000021766
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
                href="https://wa.me/917977524553?text=Hello%20Vinstocks%2C%20I%20would%20like%20to%20schedule%20a%20consultation%20to%20discuss%20investment%20opportunities."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold text-lg hover:bg-primary hover:text-white transition-all"
              >
                <CalendarCheck className="w-5 h-5" />
                Book a Call
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
