
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingPage = () => {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cloud">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you.
          </p>
        </div>
      </section>

      {/* Pricing plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-500">/month</span></p>
                <p className="text-gray-600">Perfect for occasional presenters</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>2 projects per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 5-minute videos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic body language analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic script feedback</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-6 w-6 text-gray-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Facial expression analysis</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-6 w-6 text-gray-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Historical data & trends</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-6 w-6 text-gray-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro plan */}
            <div className="bg-white rounded-xl border-2 border-mint shadow-md overflow-hidden relative transform scale-105">
              <div className="absolute top-0 right-0 bg-mint text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-4">$29<span className="text-base font-normal text-gray-500">/month</span></p>
                <p className="text-gray-600">For professionals who present regularly</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 30-minute videos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced body language analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced script feedback</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Facial expression analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Historical data & trends</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority email support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-4">$99<span className="text-base font-normal text-gray-500">/month</span></p>
                <p className="text-gray-600">For teams and organizations</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 60-minute videos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Team management & sharing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>API access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Phone & email support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cloud">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left bg-gray-50 rounded-tl-xl">Features</th>
                  <th className="py-4 px-6 text-center bg-gray-50">Free</th>
                  <th className="py-4 px-6 text-center bg-gray-50">Pro</th>
                  <th className="py-4 px-6 text-center bg-gray-50 rounded-tr-xl">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-6 font-medium">Projects</td>
                  <td className="py-4 px-6 text-center">2 per month</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Video Length</td>
                  <td className="py-4 px-6 text-center">5 minutes</td>
                  <td className="py-4 px-6 text-center">30 minutes</td>
                  <td className="py-4 px-6 text-center">60 minutes</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Body Language Analysis</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Facial Expression Analysis</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">✓</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Script Feedback</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Historical Data & Trends</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">✓</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Team Management</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Custom Branding</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">API Access</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium rounded-bl-xl">Support</td>
                  <td className="py-4 px-6 text-center">Community</td>
                  <td className="py-4 px-6 text-center">Priority Email</td>
                  <td className="py-4 px-6 text-center rounded-br-xl">Dedicated Account Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the 14-day free trial work?</AccordionTrigger>
              <AccordionContent>
                When you sign up, you'll get full access to all Pro features for 14 days. No credit card required. At the end of your trial, you can choose to upgrade to a paid plan or continue with the free plan.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your plan will take effect at the beginning of your next billing cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is my data secure and private?</AccordionTrigger>
              <AccordionContent>
                Yes, we take data security and privacy very seriously. All your data is encrypted both in transit and at rest. We do not share your data with third parties without your consent, and you retain ownership of all your content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
              <AccordionContent>
                Our AI models have been trained on thousands of presentations and have a high accuracy rate. However, like all AI, it may not be 100% perfect. We continuously improve our models based on feedback and new data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Do you offer discounts for nonprofits or educational institutions?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer special pricing for nonprofits, educational institutions, and students. Contact our sales team for more information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mint text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to become a better presenter?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Try Preffy free for 14 days. No credit card required.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-mint hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
