import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import car_mob from "@/assets/carous-mob.png";
import car_lap from "@/assets/carous-laptop.png";

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: car_mob,
      header: "Research & Ranking",
      tiles: [
        "Investment solutions for retail & HNI investors",
        "A portfolio of 20 to 25 stocks (5 in S), & 1 stock every month (MPQ)",
        "Timely buy-hold-sell recommendations",
        "User-friendly web & app interface"
      ]
    },
    {
      id: 2,
      image: car_lap,
      header: "Advanced Analytics",
      tiles: [
        "Real-time market insights and data visualization",
        "AI-powered stock screening and analysis",
        "Comprehensive portfolio tracking and reporting",
        "Expert guidance from SEBI registered advisors"
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Our Platform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover how we help investors make informed decisions with cutting-edge technology and expert insights
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto xl:px-16">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 xl:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 xl:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="min-w-full"
                >
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-10">
                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
                      {/* Image */}
                      <div className="relative">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                          {slide.header}
                        </h3>
                        <img
                          src={slide.image}
                          alt={slide.header}
                          className="w-4/5 h-auto object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <div className="space-y-4">
                          {slide.tiles.map((tile, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-all duration-300"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <p className="text-muted-foreground leading-relaxed">
                                {tile}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end mt-6">
                          <a
                            href="#pricing"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                          >
                            Start Now
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        {slide.header}
                      </h3>
                      
                      {/* Image */}
                      <div className="relative mb-8">
                        <img
                          src={slide.image}
                          alt={slide.header}
                          className="w-4/5 mx-auto h-auto object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        {slide.tiles.map((tile, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground leading-relaxed text-sm">
                              {tile}
                            </p>
                          </div>
                        ))}
                        <div className="flex justify-end mt-6">
                          <a
                            href="#pricing"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                          >
                            Start Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
