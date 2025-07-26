
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SubscriptionsSection = () => {
  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gray-400 text-lg mb-4">
            Enjoy exclusive benefits by subscribing to any of our plans
          </p>
        </div>
        {/* Short term calls Service */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Quarterly Plan */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <CardTitle className="text-2xl text-white">Quarterly</CardTitle>
              </div>
              <p className="text-gray-400">₹2000/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹6000</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Stock recommendations</li>
                <li>• Short-Mid term recommendations</li>
                <li>• Chat support</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                Short-Mid term calls
              </Button>
            </CardContent>
          </Card>
          {/* Bi-annually Plan */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <CardTitle className="text-2xl text-white">Bi-Annually</CardTitle>
              </div>
              <p className="text-gray-400">₹1666/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹10,000</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Stock recommendations</li>
                <li>• Short-Mid term recommendations</li>
                <li>• Chat support</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                Short-Mid term calls
              </Button>
            </CardContent>
          </Card>
          {/* Yearly Plan */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              POPULAR
            </Badge>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Y</span>
                </div>
                <CardTitle className="text-2xl text-white">Yearly</CardTitle>
              </div>
              <p className="text-gray-400">₹1500/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹18,000</span>
                {/* <p className="text-sm text-green-400 mt-1">Save 55%</p> */}
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Everything in Quarterly</li>
                <li>• Priority customer support</li>
                {/* <li>• Advanced risk analytics</li> */}
                <li>• Exclusive market insights</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Short-Mid term calls
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Multibagger 6 months service */}
        <div className="grid grid-cols-1 max-w-2xl mx-auto mt-16">
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <CardTitle className="text-2xl text-white">Smart Portfolio Basket 6 Months</CardTitle>
              </div>
              <p className="text-gray-400">Smart Portfolio Basket</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹6000</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Future-Focused Stock Selection</li>
                <li>• Risk Mitigation</li>
                <li>• Goal-Oriented Approach</li>
                <li>• Diversified Investment Baskets</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                Smart Portfolio Basket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsSection;
