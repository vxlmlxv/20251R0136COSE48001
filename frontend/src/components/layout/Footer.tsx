
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="preffy-logo text-xl">Preffy</h3>
            <p className="mt-2 text-sm text-gray-500">
              Helping you present with confidence
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/features" className="text-base text-gray-500 hover:text-mint">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-gray-500 hover:text-mint">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-mint">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-mint">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-mint">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-mint">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Preffy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
