import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="flex items-center">
      <Globe className="h-4 w-4 mr-2 text-gray-500" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32 border-0 shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
