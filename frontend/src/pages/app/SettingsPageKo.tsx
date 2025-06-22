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

const SettingsPageKo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  // Force Korean language for this component
  if (i18n.language !== 'ko') {
    i18n.changeLanguage('ko');
  }
  
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
          price: '₩39,000',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">활성</Badge>
        };
      case 'enterprise':
        return {
          name: t('pricing.enterprise.name'),
          price: '₩129,000',
          billingCycle: 'monthly',
          nextBilling: '2025-06-20',
          badge: <Badge className="bg-mint text-white">활성</Badge>
        };
      default:
        return {
          name: t('pricing.free.name'),
          price: '₩0',
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
                    <SelectValue placeholder="언어를 선택하세요" />
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
                    <h3 className="text-xl font-semibold">{planDetails.name} 플랜</h3>
                    <div className="ml-3">{planDetails.badge}</div>
                  </div>
                  <p className="text-gray-500 mt-1">
                    {planDetails.price}/{planDetails.billingCycle === 'forever' ? '영구무료' : '월'}
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
                      <p>{new Date(planDetails.nextBilling).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          구독 관리
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            언제든지 플랜을 변경하거나 취소할 수 있습니다. 취소하시면 현재 결제 주기가 끝날 때까지 모든 기능을 계속 사용하실 수 있습니다.
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="-mx-2 -my-1.5 flex">
                            <Button variant="outline" size="sm" className="mr-2">
                              플랜 변경
                            </Button>
                            <Button variant="outline" size="sm">
                              구독 취소
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPageKo;
