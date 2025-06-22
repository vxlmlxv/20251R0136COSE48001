
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/title.png" 
                alt="Preffy" 
                className="h-8 w-auto"
              />
            </Link>
            {/* <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/features" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-mint">
                Features
              </Link>
            </div> */}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/app/dashboard">
                  <Button variant="outline">{t('navigation.dashboard')}</Button>
                </Link>
                <Button onClick={logout} variant="ghost">{t('navigation.logout')}</Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">{t('navigation.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button>{t('navigation.signup')}</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mint"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/features"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.features')}
            </Link>
            {user ? (
              <>
                <Link
                  to="/app/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                >
                  {t('navigation.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
