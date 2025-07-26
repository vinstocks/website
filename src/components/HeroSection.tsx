
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const HeroSection = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.fullName);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          navigate('/home');
        } else {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to verify your account.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 mt-8 md:mt-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-slide-in">
          <div className="space-y-4">
          <p className="text-orange-400 font-medium text-lg"></p>

<h1 className="text-5xl md:text-7xl font-bold leading-tight">

  Real <span className="gradient-text">Strategies</span>

</h1>

<h1 className="text-5xl md:text-7xl font-bold leading-tight">

  Real <span className="text-cyan-400">Stocks</span>

</h1>

<h1 className="text-5xl md:text-7xl font-bold leading-tight">

  Real <span className="text-cyan-400">Confidence</span>

</h1>

<p className="text-gray-400 text-lg max-w-md">

  We track only fundamentally strong stocks, focus on timing, and let performance speak for itself. Your trust is earned, not assumed.

</p>
          </div>
          
          <Button 
            size="lg" 
            onClick={handleRegisterClick}
            className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold"
          >
            Register Now
          </Button>
        </div>

        {/* Right Auth Form */}
        <div className="animate-fade-in">
          <Card className="neomorphic-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? "login" : "register"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                  <TabsTrigger 
                    value="login" 
                    onClick={() => setIsLogin(true)}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    onClick={() => setIsLogin(false)}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                      <Input 
                        id="login-email"
                        name="email"
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                      <Input 
                        id="login-password"
                        name="password"
                        type="password" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-gray-300">Full Name</Label>
                      <Input 
                        id="register-name"
                        name="fullName"
                        type="text" 
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                      <Input 
                        id="register-email"
                        name="email"
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                      <Input 
                        id="register-password"
                        name="password"
                        type="password" 
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </TabsContent>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
