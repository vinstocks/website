import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TopGainers, TopLosers } from "@/components/MarketTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [tenureYears, setTenureYears] = useState("10");
  const [lumpsumAmount, setLumpsumAmount] = useState("100000");
  const [lumpsumReturn, setLumpsumReturn] = useState("12");
  const [lumpsumYears, setLumpsumYears] = useState("10");
  const [goalAmount, setGoalAmount] = useState("10000000");
  const [goalReturn, setGoalReturn] = useState("12");
  const [goalYears, setGoalYears] = useState("15");

  const results = useMemo(() => {
    const monthlyInvestmentValue = Number(monthlyInvestment) || 0;
    const annualReturnValue = Number(annualReturn) || 0;
    const tenureYearsValue = Number(tenureYears) || 0;

    const monthlyRate = annualReturnValue / 12 / 100;
    const totalMonths = tenureYearsValue * 12;
    const investedAmount = monthlyInvestmentValue * totalMonths;

    const maturityAmount =
      monthlyRate === 0
        ? investedAmount
        : monthlyInvestmentValue *
          (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

    return {
      investedAmount,
      estimatedReturns: Math.max(maturityAmount - investedAmount, 0),
      maturityAmount,
    };
  }, [annualReturn, monthlyInvestment, tenureYears]);

  const lumpsumResults = useMemo(() => {
    const principal = Number(lumpsumAmount) || 0;
    const annualReturnValue = Number(lumpsumReturn) || 0;
    const years = Number(lumpsumYears) || 0;
    const maturityAmount = principal * Math.pow(1 + annualReturnValue / 100, years);

    return {
      investedAmount: principal,
      estimatedReturns: Math.max(maturityAmount - principal, 0),
      maturityAmount,
    };
  }, [lumpsumAmount, lumpsumReturn, lumpsumYears]);

  const goalPlannerResults = useMemo(() => {
    const targetAmount = Number(goalAmount) || 0;
    const annualReturnValue = Number(goalReturn) || 0;
    const years = Number(goalYears) || 0;
    const totalMonths = years * 12;
    const monthlyRate = annualReturnValue / 12 / 100;

    const requiredMonthlySip =
      totalMonths <= 0
        ? 0
        : monthlyRate === 0
          ? targetAmount / totalMonths
          : targetAmount /
            (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

    const investedAmount = Math.max(requiredMonthlySip * totalMonths, 0);

    return {
      targetAmount,
      requiredMonthlySip: Math.max(requiredMonthlySip, 0),
      estimatedReturns: Math.max(targetAmount - investedAmount, 0),
    };
  }, [goalAmount, goalReturn, goalYears]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TopGainers />

      <section className="pt-32 md:pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Mutual Fund <span className="text-gradient">Investment Calculators</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Plan your SIP, lumpsum growth, and long-term investment goals.
            </p>
          </div>

          <Tabs defaultValue="sip" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
              <TabsTrigger value="lumpsum">Lumpsum Calculator</TabsTrigger>
              <TabsTrigger value="goal">Goal Planner</TabsTrigger>
            </TabsList>

            <TabsContent value="sip">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Enter Your SIP Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-investment">Monthly Investment (INR)</Label>
                      <Input
                        id="monthly-investment"
                        type="number"
                        min={0}
                        value={monthlyInvestment}
                        onChange={(event) => setMonthlyInvestment(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annual-return">Expected Return (% p.a.)</Label>
                      <Input
                        id="annual-return"
                        type="number"
                        min={0}
                        step="0.1"
                        value={annualReturn}
                        onChange={(event) => setAnnualReturn(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure-years">Investment Tenure (Years)</Label>
                      <Input
                        id="tenure-years"
                        type="number"
                        min={1}
                        value={tenureYears}
                        onChange={(event) => setTenureYears(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Invested Amount</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(results.investedAmount)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Estimated Returns</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(results.estimatedReturns)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-semibold mt-1 text-primary">
                          {formatCurrency(results.maturityAmount)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lumpsum">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Enter Your Lumpsum Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lumpsum-amount">Investment Amount (INR)</Label>
                      <Input
                        id="lumpsum-amount"
                        type="number"
                        min={0}
                        value={lumpsumAmount}
                        onChange={(event) => setLumpsumAmount(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lumpsum-return">Expected Return (% p.a.)</Label>
                      <Input
                        id="lumpsum-return"
                        type="number"
                        min={0}
                        step="0.1"
                        value={lumpsumReturn}
                        onChange={(event) => setLumpsumReturn(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lumpsum-years">Investment Tenure (Years)</Label>
                      <Input
                        id="lumpsum-years"
                        type="number"
                        min={0}
                        value={lumpsumYears}
                        onChange={(event) => setLumpsumYears(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Invested Amount</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(lumpsumResults.investedAmount)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Estimated Returns</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(lumpsumResults.estimatedReturns)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-semibold mt-1 text-primary">
                          {formatCurrency(lumpsumResults.maturityAmount)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goal">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Enter Your Goal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-amount">Target Amount (INR)</Label>
                      <Input
                        id="goal-amount"
                        type="number"
                        min={0}
                        value={goalAmount}
                        onChange={(event) => setGoalAmount(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal-return">Expected Return (% p.a.)</Label>
                      <Input
                        id="goal-return"
                        type="number"
                        min={0}
                        step="0.1"
                        value={goalReturn}
                        onChange={(event) => setGoalReturn(event.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal-years">Time to Achieve Goal (Years)</Label>
                      <Input
                        id="goal-years"
                        type="number"
                        min={1}
                        value={goalYears}
                        onChange={(event) => setGoalYears(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Target Amount</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(goalPlannerResults.targetAmount)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Required Monthly SIP</p>
                        <p className="text-2xl font-semibold mt-1">
                          {formatCurrency(goalPlannerResults.requiredMonthlySip)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Projected Returns</p>
                        <p className="text-2xl font-semibold mt-1 text-primary">
                          {formatCurrency(goalPlannerResults.estimatedReturns)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <TopLosers />
      <Footer />
    </div>
  );
};

export default SipCalculator;
