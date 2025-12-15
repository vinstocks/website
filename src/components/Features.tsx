import { Brain, BarChart3, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
    icon: BarChart3,
    title: "Qualitative & Quantitative Parameters",
    description:
      "Our framework blends measurable data with contextual insights, ensuring decisions are both precise and meaningful.",
    color: "success",
  },
];

const Features = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  // Always show 3 consecutive cards
  const visible = [
    features[index],
    features[(index + 1) % features.length],
    features[(index + 2) % features.length],
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How do we <span className="text-gradient">do?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our data-driven approach combines cutting-edge technology with fundamental analysis
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="p-3 rounded-full border border-border bg-white shadow hover:bg-primary/10 transition"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* 3 visible cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 transition-all duration-700 ease-in-out">
            {visible.map((feature, i) => (
              <div
                key={`${feature.title}-${i}`}
                className="group relative p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    feature.color === "primary"
                      ? "bg-primary/15 text-primary"
                      : feature.color === "secondary"
                      ? "bg-secondary/15 text-secondary"
                      : "bg-success/15 text-success"
                  }`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="p-3 rounded-full border border-border bg-white shadow hover:bg-primary/10 transition"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;