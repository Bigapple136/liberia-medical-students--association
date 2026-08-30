import { Award, Check, Info } from 'lucide-react';

const categories = [
  {
    name: 'Full Member',
    price: '$25/year',
    icon: Award,
    color: 'lmsa',
    features: [
      'All medical students currently enrolled',
      'Full voting rights',
      'Eligible to run for office',
      'Access to all resources',
      'Committee participation',
      'Event discounts',
    ],
    recommended: true,
  },
  {
    name: 'Associate Member',
    price: '$15/year',
    icon: Award,
    color: 'gray',
    features: [
      'Pre-medical and health sciences students',
      'Access to events and resources',
      'Committee participation',
      'No voting rights',
      'Cannot hold elected office',
      'Pathway to full membership',
    ],
    recommended: false,
  },
  {
    name: 'Honorary Member',
    price: 'By invitation',
    icon: Award,
    color: 'gray',
    features: [
      'Faculty and alumni supporters',
      'Recognized contributors',
      'Advisory role only',
      'No voting rights',
      'Cannot hold office',
      'Lifetime appointment',
    ],
    recommended: false,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Membership Types</h1>
          <p className="text-lg text-gray-600">Full, Associate, and Honorary Memberships</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info size={20} className="text-lmsa-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Understanding Membership</h2>
              <p className="text-gray-700 leading-relaxed">
                LMSA offers three categories of membership to accommodate different levels of involvement 
                and eligibility. Most medical students will qualify as Full Members with complete privileges 
                and responsibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isRecommended = category.recommended;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                  isRecommended ? 'border-lmsa-600 shadow-md' : 'border-gray-200'
                }`}
              >
                {isRecommended && (
                  <div className="bg-lmsa-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST COMMON
                  </div>
                )}
                <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-lmsa-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-2xl font-bold text-lmsa-600 mb-4">{category.price}</p>
                
                <ul className="space-y-3 mb-6">
                  {category.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-lmsa-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/membership"
                  className={`block text-center py-2 rounded-lg font-medium transition-colors ${
                    isRecommended
                      ? 'bg-lmsa-600 text-white hover:bg-lmsa-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Apply Now
                </a>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            Questions about membership? Contact us at <a href="mailto:membership@lmsa.org" className="text-lmsa-600 hover:underline">membership@lmsa.org</a>
          </p>
        </div>
      </div>
    </div>
  );
}
