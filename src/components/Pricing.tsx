import { Check, Star } from "lucide-react";
import CoinStack from "./illustrations/CoinStack";

const plans = [
  {
    name: "Vinstocks Elite",
    letter: "E",
    price: "₹50,000",
    period: "Yearly",
    features: [
      "Capital > 25 lacs",
      "Portfolio Review",
      "Multibagger portfolio",
      "Stocks analysis report",
      "One to one calls",
    ],
    popular: true,
  },
  {
    name: "Vinstocks Prime",
    letter: "P",
    price: "₹20,000",
    period: "Yearly",
    features: [
      "Capital < 25 lacs",
      "Portfolio Review",
      "Stocks analysis report",
      "Multibagger portfolio",
    ],
    popular: false,
  },
  {
    name: "Vinstocks Stars",
    letter: "S",
    price: "₹16,000",
    period: "Yearly",
    features: [
      "Short and Midterm calls",
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
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 flex flex-col h-full ${
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
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/917977524553?text=${encodeURIComponent(
                  `Hi Vinstocks, I want to know more about the ${plan.name} plan.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center py-3 rounded-xl font-semibold transition-all mt-auto ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        {/* Smart Portfolio */}
        <div className="max-w-md mx-auto">
          <div className="p-6 rounded-2xl border border-secondary/50 bg-gradient-to-b from-secondary/10 to-transparent flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl font-bold mb-4">
              {smartPortfolio.letter}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{smartPortfolio.name}</h3>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{smartPortfolio.price}</span>
              <span className="text-muted-foreground"> / {smartPortfolio.period}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {smartPortfolio.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={`https://wa.me/917977524553?text=${encodeURIComponent(
                `Hi Vinstocks, I want to know more about the ${smartPortfolio.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center py-3 rounded-xl font-semibold bg-secondary text-white hover:opacity-90 transition-opacity mt-auto"
            >
              Get Smart Portfolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
