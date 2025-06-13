
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cloud">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the ways Preffy helps you improve your presentations
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="lg:flex items-center mb-24">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold mb-6">Body Language Analysis</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our AI analyzes your gestures, posture, and movement throughout your presentation, providing detailed feedback on how to improve:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hand gestures and movement patterns</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Posture and stance evaluation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Stage presence and spatial awareness</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Distracting movements and fidgeting</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button>Try It Free</Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-md aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Person using gestures while presenting" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="lg:flex flex-row-reverse items-center mb-24">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-12">
              <h2 className="text-3xl font-bold mb-6">Facial Expression Feedback</h2>
              <p className="text-lg text-gray-600 mb-6">
                Connect with your audience through effective facial expressions. Our AI analyzes:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smile consistency and authenticity</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Eye contact patterns and engagement</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Emotional congruence with content</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Microexpressions that may undermine your message</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button>Try It Free</Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-md aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Person with expressive face while presenting" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="lg:flex items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold mb-6">Script Improvement</h2>
              <p className="text-lg text-gray-600 mb-6">
                Enhance the clarity and impact of your message with smart script analysis:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Filler word detection and reduction</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pacing and speech rate optimization</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Message structure and clarity suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Vocabulary enhancements for impact</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button>Try It Free</Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-md aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Person reviewing presentation script" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 
      {/* Feature comparison *\/}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cloud">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free plan *\/}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro plan *\/}
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative border-2 border-mint transform scale-105">
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
                </ul>
                <div className="mt-8">
                  <Link to="/signup" className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise plan *\/}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>API access</span>
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
*/}

      {/* CTA */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mint text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start improving your presentation skills today</h2>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-mint hover:bg-gray-100">
              Start Preffy For Free
            </Button>
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default Features;
