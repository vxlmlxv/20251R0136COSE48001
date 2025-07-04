
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useLanguage } from '@/hooks/use-language';
import { CreditCard, Globe, Moon, PaintBucket, Sun, Zap, Settings, Crown } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  const [theme, setTheme] = useState('light');
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSavePreferences = () => {
    setIsSaving(true);
    
    // Simulate API call to save preferences
    setTimeout(() => {
      toast({
        title: t('settings.preferences_updated'),
        description: t('settings.preferences_saved'),
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
          name: t('pricing.pro.name'),
          price: '$29',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">Active</Badge>
        };
      case 'enterprise':
        return {
          name: t('pricing.enterprise.name'),
          price: '$99',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">Active</Badge>
        };
      default:
        return {
          name: t('pricing.free.name'),
          price: '$0',
          billingCycle: 'forever',
          nextBilling: 'Never',
          badge: <Badge variant="outline" className="bg-gray-100">{t('pricing.free.name')}</Badge>
        };
    }
  };
  
  const planDetails = getPlanDetails();
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>
      
      <Tabs defaultValue="preferences">
        <TabsList className="mb-6">
          <TabsTrigger value="preferences" className="px-4">
            <Settings className="h-4 w-4" />
            <span className="sr-only">{t('settings.preferences')}</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="px-4">
            <Crown className="h-4 w-4" />
            <span className="sr-only">{t('settings.subscription')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PaintBucket className="h-5 w-5 mr-2 text-mint" />
                {t('settings.appearance.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{t('settings.appearance.theme')}</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      {t('settings.appearance.light')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      {t('settings.appearance.dark')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">{t('settings.appearance.system')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label>{t('settings.appearance.animations')}</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.appearance.enable_animations')}</p>
                    <p className="text-sm text-gray-500">
                      {t('settings.appearance.animations_description')}
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
                {t('settings.language.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.language.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t('settings.language.language_label')}</Label>
                <Select value={language} onValueChange={(value) => {
                  setLanguage(value);
                  // Show immediate feedback
                  toast({
                    title: value === 'ko' ? '언어가 변경되었습니다' : 'Language changed',
                    description: value === 'ko' ? '한국어로 변경되었습니다.' : 'Changed to English.',
                    variant: 'default',
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
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
                {t('settings.video.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.video.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.video.autoplay')}</p>
                  <p className="text-sm text-gray-500">
                    {t('settings.video.autoplay_description')}
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
            <Button variant="outline">{t('settings.cancel')}</Button>
            <Button onClick={handleSavePreferences} disabled={isSaving}>
              {isSaving ? t('settings.saving') : t('settings.save_changes')}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-mint" />
                {t('settings.plan.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.plan.description')}
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
                    {user?.plan === 'free' ? t('settings.plan.upgrade') : t('settings.plan.change_plan')}
                  </Button>
                )}
              </div>
              
              {user?.plan !== 'free' && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('settings.plan.billing_cycle')}</h4>
                      <p>{t('settings.plan.monthly')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('settings.plan.next_billing')}</h4>
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
