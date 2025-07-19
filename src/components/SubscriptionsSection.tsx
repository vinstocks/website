
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Quarterly Plan */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <CardTitle className="text-2xl text-white">Quarterly</CardTitle>
              </div>
              <p className="text-gray-400">₹833/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹2500</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• AI-powered stock recommendations</li>
                <li>• Real-time market analysis</li>
                <li>• Quarterly portfolio review</li>
                <li>• Email support</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                Choose Quarterly
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
              <p className="text-gray-400">₹375/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹4500</span>
                <p className="text-sm text-green-400 mt-1">Save 55%</p>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Everything in Quarterly</li>
                <li>• Priority customer support</li>
                <li>• Monthly portfolio optimization</li>
                <li>• Advanced risk analytics</li>
                <li>• Exclusive market insights</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Choose Yearly
              </Button>
            </CardContent>
          </Card>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          {/* Quarterly Plan */}
          <Card className="glass-card hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <CardTitle className="text-2xl text-white">Quarterly</CardTitle>
              </div>
              <p className="text-gray-400">₹833/month</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹2500</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• AI-powered stock recommendations</li>
                <li>• Real-time market analysis</li>
                <li>• Quarterly portfolio review</li>
                <li>• Email support</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                Choose Quarterly
              </Button>
            </CardContent>
          </Card>
          
          
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsSection;
