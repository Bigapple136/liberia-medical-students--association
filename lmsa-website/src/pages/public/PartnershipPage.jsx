import { Link } from 'react-router-dom';
import { Heart, Building2, Globe, Award, Users, TrendingUp, CheckCircle, ArrowRight, Mail, Phone, Star, Crown, Shield, Target } from 'lucide-react';

// Partner organizations
const partners = [
  { name: 'Liberia Medical Association', type: 'Institutional', logo: '🏥', description: 'National medical association partnership' },
  { name: 'Ministry of Health', type: 'Government', logo: '🏛️', description: 'Government health sector collaboration' },
  { name: 'AMAMU Medical College', type: 'Academic', logo: '🎓', description: 'Academic institution partnership' },
  { name: 'Red Cross Liberia', type: 'NGO', logo: '❤️', description: 'Humanitarian organization partnership' },
  { name: 'WHO Liberia Office', type: 'International', logo: '🌍', description: 'World Health Organization collaboration' },
  { name: 'Liberia College of Physicians', type: 'Professional', logo: '⚕️', description: 'Professional body partnership' },
];

// Partnership tiers
const tiers = [
  {
    name: 'Silver Partner',
    price: '$500',
    period: 'per year',
    icon: Shield,
    color: 'gray',
    bgGradient: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    textColor: 'text-gray-600',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    features: [
      'Logo on LMSA website',
      'Mention in newsletter',
      'Access to LMSA events',
      'Annual impact report',
      'Social media recognition',
    ],
  },
  {
    name: 'Gold Partner',
    price: '$1,500',
    period: 'per year',
    icon: Star,
    color: 'amber',
    bgGradient: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-600',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    popular: true,
    features: [
      'All Silver benefits',
      'Featured on partner page',
      'Speaking opportunity at events',
      'Direct student engagement',
      'Quarterly collaboration reports',
      'Priority event sponsorship',
    ],
  },
  {
    name: 'Platinum Partner',
    price: '$3,000',
    period: 'per year',
    icon: Crown,
    color: 'purple',
    bgGradient: 'from-purple-50 to-lmsa-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-600',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    features: [
      'All Gold benefits',
      'Exclusive naming rights',
      'Dedicated partnership manager',
      'Custom collaboration projects',
      'Board meeting invitation',
      'First access to opportunities',
      'Annual partnership review',
    ],
  },
];

// Partner types
const partnerTypes = [
  {
    title: 'Sponsor Organizations',
    description: 'Financial and in-kind support for LMSA programs, events, and student initiatives.',
    icon: Heart,
    color: 'lmsa',
    examples: 'Corporate sponsors, foundations, donors',
  },
  {
    title: 'Institutional Partners',
    description: 'Long-term collaboration with healthcare institutions, universities, and government bodies.',
    icon: Building2,
    color: 'teal',
    examples: 'Hospitals, medical schools, Ministry of Health',
  },
  {
    title: 'International Partners',
    description: 'Global partnerships with international medical organizations and student associations.',
    icon: Globe,
    color: 'orange',
    examples: 'IFMSA, AMSA, international medical schools',
  },
  {
    title: 'Alumni Network',
    description: 'Engaging LMSA graduates as mentors, speakers, and career development partners.',
    icon: Award,
    color: 'amber',
    examples: 'LMSA alumni worldwide, mentorship network',
  },
];

// Benefits of partnering
const benefits = [
  {
    title: 'Reach Future Physicians',
    description: 'Connect with Liberia\'s next generation of medical professionals and healthcare leaders.',
    icon: Users,
    color: 'lmsa',
  },
  {
    title: 'Support Healthcare Education',
    description: 'Directly impact the quality of medical education and healthcare delivery in Liberia.',
    icon: Target,
    color: 'teal',
  },
  {
    title: 'Brand Visibility',
    description: 'Gain exposure across LMSA\'s digital platforms, events, and community outreach programs.',
    icon: TrendingUp,
    color: 'purple',
  },
];

// Color mapping
const colorMap = {
  lmsa: { bg: 'bg-lmsa-100', text: 'text-lmsa-600', bg50: 'bg-lmsa-50' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', bg50: 'bg-teal-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', bg50: 'bg-purple-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', bg50: 'bg-orange-50' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', bg50: 'bg-amber-50' },
};

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-lmsa-600 via-teal-600 to-lmsa-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">Partnership Opportunities</h1>
              <p className="text-lg text-lmsa-100 mt-1">Collaborate with Liberia&apos;s Future Medical Leaders</p>
            </div>
          </div>
          <p className="text-lmsa-50 max-w-2xl leading-relaxed">
            Partner with LMSA to support medical education, advance healthcare in Liberia, and connect with the next generation of healthcare leaders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Partner Types */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Types of Partnerships</h2>
          <p className="text-gray-600 mb-8">We offer flexible partnership models to suit your organization&apos;s goals and capacity.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              const colors = colorMap[type.color];
              return (
                <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                  <p className="text-xs text-gray-500 font-medium">Examples: {type.examples}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Partners */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Current Partners</h2>
              <p className="text-gray-600 mt-1">Organizations collaborating with LMSA to advance medical education.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{partner.logo}</div>
                <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{partner.description}</p>
                <span className="text-xs font-medium text-lmsa-600 bg-lmsa-50 px-3 py-1 rounded-full">
                  {partner.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits of Partnering */}
        <div className="bg-gradient-to-r from-lmsa-50 to-teal-50 rounded-2xl border-2 border-lmsa-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Partner with LMSA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const colors = colorMap[benefit.color];
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partnership Tiers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Partnership Tiers</h2>
            <p className="text-gray-600">Choose the level of engagement that works for your organization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div key={index} className={`relative bg-gradient-to-br ${tier.bgGradient} rounded-2xl border-2 ${tier.borderColor} p-6 ${tier.popular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`w-14 h-14 ${tier.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={28} className={tier.iconColor} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 text-sm ml-1">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={16} className={`${tier.textColor} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full ${tier.buttonColor} text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}>
                    Get Started
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* In-Kind Support */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">In-Kind Support</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Beyond financial contributions, we welcome in-kind support that directly benefits our members and programs. Your organization can provide:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Educational Resources', desc: 'Textbooks, medical journals, online subscriptions', icon: '📚' },
              { title: 'Technology', desc: 'Laptops, software licenses, internet access', icon: '💻' },
              { title: 'Venue & Logistics', desc: 'Event spaces, transportation, catering', icon: '🏢' },
              { title: 'Expertise', desc: 'Guest lectures, mentorship, training workshops', icon: '🎯' },
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-lmsa-700 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-6">Partnership Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '6+', label: 'Active Partners' },
              { value: '500+', label: 'Students Impacted' },
              { value: '$15K+', label: 'Annual Support Value' },
              { value: '12', label: 'Collaborative Programs' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a Partnership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Interested in partnering with LMSA? Reach out to discuss how we can work together to advance medical education and healthcare in Liberia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a href="mailto:partnerships@lmsa.org.lr" className="flex items-center gap-4 p-6 bg-lmsa-50 rounded-xl border border-lmsa-200 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-lmsa-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-lmsa-200 transition-colors">
                <Mail size={24} className="text-lmsa-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Us</p>
                <p className="font-bold text-gray-900">partnerships@lmsa.org.lr</p>
              </div>
            </a>
            <a href="tel:+231770000000" className="flex items-center gap-4 p-6 bg-teal-50 rounded-xl border border-teal-200 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                <Phone size={24} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Call Us</p>
                <p className="font-bold text-gray-900">+231 77 000 0000</p>
              </div>
            </a>
          </div>
          <div className="text-center mt-6">
            <Link to="/contact" className="inline-flex items-center gap-2 text-lmsa-600 font-medium hover:underline">
              Or use our contact form
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
