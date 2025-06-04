
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Globe, Moon, PaintBucket, Sun, Zap, Settings, Crown } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en-US');
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSavePreferences = () => {
    setIsSaving(true);
    
    // Simulate API call to save preferences
    setTimeout(() => {
      toast({
        title: 'Preferences updated',
        description: 'Your preferences have been saved successfully.',
        variant: 'default',
      });
      setIsSaving(false);
    }, 1000);
  };

  // Helper function to get plan details
  const getPlanDetails = () => {
    switch (user?.plan) {
      case 'pro':
        return {
          name: 'Pro',
          price: '$29',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">Active</Badge>
        };
      case 'enterprise':
        return {
          name: 'Enterprise',
          price: '$99',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">Active</Badge>
        };
      default:
        return {
          name: 'Free',
          price: '$0',
          billingCycle: 'forever',
          nextBilling: 'Never',
          badge: <Badge variant="outline" className="bg-gray-100">Free</Badge>
        };
    }
  };
  
  const planDetails = getPlanDetails();
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="preferences">
        <TabsList className="mb-6">
          <TabsTrigger value="preferences" className="px-4">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="px-4">
            <Crown className="h-4 w-4" />
            <span className="sr-only">Subscription</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PaintBucket className="h-5 w-5 mr-2 text-mint" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how Preffy looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label>Animations</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable animations</p>
                    <p className="text-sm text-gray-500">
                      Control UI animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={isAnimationsEnabled}
                    onCheckedChange={setIsAnimationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-mint" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and region settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Video Playback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-mint" />
                Video Playback
              </CardTitle>
              <CardDescription>
                Configure how videos play in the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autoplay videos</p>
                  <p className="text-sm text-gray-500">
                    Automatically play videos when the page loads
                  </p>
                </div>
                <Switch
                  checked={isAutoplayEnabled}
                  onCheckedChange={setIsAutoplayEnabled}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSavePreferences} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-mint" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold">{planDetails.name} Plan</h3>
                    <div className="ml-3">{planDetails.badge}</div>
                  </div>
                  <p className="text-gray-500 mt-1">
                    {planDetails.price}/{planDetails.billingCycle === 'forever' ? planDetails.billingCycle : 'month'}
                  </p>
                </div>
                {user?.plan !== 'enterprise' && (
                  <Button>
                    {user?.plan === 'free' ? 'Upgrade' : 'Change Plan'}
                  </Button>
                )}
              </div>
              
              {user?.plan !== 'free' && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">BILLING CYCLE</h4>
                      <p>Monthly</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">NEXT BILLING DATE</h4>
                      <p>{new Date(planDetails.nextBilling).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex">
                    <Button variant="outline" className="mr-2">Update Payment</Button>
                    <Button variant="outline" className="text-red-600">Cancel Subscription</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Plan Comparison */}
          {user?.plan === 'free' && (
            <Card>
              <CardHeader>
                <CardTitle>Compare Plans</CardTitle>
                <CardDescription>
                  See what you get with each plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                    <div className="font-medium">Feature</div>
                    <div className="font-medium text-center">Free</div>
                    <div className="font-medium text-center">Pro</div>
                    <div className="font-medium text-center">Enterprise</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-2 border-b">
                    <div>Projects</div>
                    <div className="text-center">2/month</div>
                    <div className="text-center">Unlimited</div>
                    <div className="text-center">Unlimited</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-2 border-b">
                    <div>Video Length</div>
                    <div className="text-center">5 min</div>
                    <div className="text-center">30 min</div>
                    <div className="text-center">60 min</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-2 border-b">
                    <div>Body Language Analysis</div>
                    <div className="text-center">Basic</div>
                    <div className="text-center">Advanced</div>
                    <div className="text-center">Advanced</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-2 border-b">
                    <div>Facial Expression Analysis</div>
                    <div className="text-center">—</div>
                    <div className="text-center">✓</div>
                    <div className="text-center">✓</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-2">
                    <div>Storage History</div>
                    <div className="text-center">30 days</div>
                    <div className="text-center">1 year</div>
                    <div className="text-center">Unlimited</div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button>Upgrade Now</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
