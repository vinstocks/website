import { Brain, BarChart3, Clock, Shield, Eye, Sliders, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    icon: Brain,
    title: "Predictive Model",
    description:
      "Advanced algorithms that analyze market patterns and predict optimal entry/exit points.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Fundamentally Strong Stocks",
    description:
      "We only recommend stocks with solid fundamentals, reducing risk and maximizing potential.",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Years of Back-Tested Algos",
    description:
      "Our strategies are rigorously tested against years of historical data for proven reliability.",
    color: "success",
  },
  {
    icon: Sliders,
    title: "Qualitative & Quantitative Parameters",
    description:
      "Our framework blends measurable data with contextual insights, ensuring decisions are both precise and meaningful.",
    color: "success",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Sophisticated risk assessment tools help you protect your portfolio and make informed decisions.",
    color: "primary",
  },
  {
    icon: Eye,
    title: "24/7 Market Monitoring",
    description:
      "Continuous market surveillance ensures you never miss critical opportunities or threats.",
    color: "secondary",
  },
];

const Features = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: carouselRef, isVisible: carouselVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= features.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 550);
    } else if (index < 0) {
      setIsTransitioning(false);
      setIndex(features.length - 1);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [index]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (index === 0) {
      setIsTransitioning(false);
      setIndex(features.length - 1);
      setTimeout(() => setIsTransitioning(true), 50);
    } else {
      setIsTransitioning(true);
      setIndex((prev) => prev - 1);
    }
  };

  const iconColorClass = (color: string) =>
    color === "primary"
      ? "bg-primary/15 text-primary"
      : color === "secondary"
      ? "bg-secondary/15 text-secondary"
      : "bg-success/15 text-success";

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "visible" : ""}`}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 heading-serif">
            Our <span className="text-gradient">Approach</span>
          </h2>
          <div className="section-divider mx-auto mt-4 mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our data-driven approach combines cutting-edge technology with fundamental analysis
          </p>
        </div>

        <div
          ref={carouselRef}
          className={`relative max-w-7xl mx-auto xl:px-16 reveal ${carouselVisible ? "visible" : ""}`}
        >
          <button
            onClick={prevSlide}
            className="absolute left-2 xl:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 xl:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex py-2"
              style={{
                transform: isMobile
                  ? `translateX(-${index * 100}%)`
                  : `translateX(-${index * (100 / 3)}%)`,
                transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
              }}
            >
              {[...features, ...features.slice(0, 3)].map((feature, i) => (
                <div
                  key={i}
                  className="w-full md:w-1/3 flex-shrink-0 px-2 md:px-4"
                >
                  <div className="group relative p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 h-full flex flex-col card-lift">
                    <div className={`icon-pop w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${iconColorClass(feature.color)}`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground flex-grow">{feature.description}</p>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:hidden justify-center gap-3 mt-8">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setIndex(i);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index % features.length === i
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
