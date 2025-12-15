import { Check, Star, X } from "lucide-react";
import { useState } from "react";
import CoinStack from "./illustrations/CoinStack";

const plans = [
  {
    name: "Vinstocks Elite",
    letter: "E",
    price: "₹50,000",
    period: "Yearly",
    features: [
      "Capital > 25 lacs",
      "Customized Portfolio",
      "18-25 Stocks Portfolio",
      "7-8 High Growth Sectors",
      "Timely Entry & Exit",
      "Allocation of Stocks",
      "Research Report",
      "Personal Relationship Manager",
    ],
    popular: true,
  },
  {
    name: "Vinstocks Prime",
    letter: "P",
    price: "₹20,000",
    period: "Yearly",
    features: [
      "Capital 3 - 25 lacs",
      "Personalized Portfolio",
      "18-25 Stocks Portfolio",
      "7-8 High Growth Sectors",
      "Timely Entry & Exit",
      "Portfolio Review",
    ],
    popular: false,
  },
  {
    name: "Vinstocks Stars",
    letter: "S",
    price: "₹16,000",
    period: "Yearly",
    features: [
      "Midterm recommendations",
     " Time Horizon 3-8 Months",
      "Timely Entry & Exit",
      "Portfolio Review",
    ],
    popular: false,
  },
];

const smartPortfolio = {
  name: "Smart Portfolio Basket",
  letter: "M",
  price: "₹6000",
  period: "6 months",
  features: [
    "Future-Focused Stock Selection",
    "Risk Mitigation",
    "Goal-Oriented Approach",
    "Diversified Investment Baskets",
  ],
};

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  return (
    <section id="pricing" className="py-24 relative">
      {/* Decorative coin stack */}
      <div className="absolute right-10 top-20 hidden xl:block opacity-25">
        <CoinStack className="w-28 h-36" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enjoy exclusive benefits by subscribing to any of our plans
          </p>
        </div>

        {/* Main Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 flex flex-col h-full cursor-pointer ${
                plan.popular
                  ? "border-primary bg-gradient-to-b from-primary/10 to-transparent glow-primary"
                  : "border-border card-gradient"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3" /> POPULAR
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                {plan.letter}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground"> / {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li>
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
                    >
                      More...
                    </button>
                  </li>
                )}
              </ul>

              <a
                href={`https://wa.me/917977524553?text=${encodeURIComponent(
                  `Hi Vinstocks, I want to know more about the ${plan.name} plan.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`w-full inline-flex items-center justify-center py-3 rounded-xl font-semibold transition-all mt-auto ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Know More
              </a>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-card to-background shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-3xl font-bold">
                    {selectedPlan.letter}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{selectedPlan.name}</h3>
                    <div>
                      <span className="text-3xl font-bold text-foreground">{selectedPlan.price}</span>
                      <span className="text-muted-foreground"> / {selectedPlan.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
                <h4 className="text-lg font-semibold mb-4 text-foreground">All Features</h4>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer with CTA */}
              <div className="p-6 border-t border-border bg-card">
                <a
                  href={`https://wa.me/917977524553?text=${encodeURIComponent(
                    `Hi Vinstocks, I want to know more about the ${selectedPlan.name} plan.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                >
                  Know More
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
