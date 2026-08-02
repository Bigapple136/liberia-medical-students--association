import { DollarSign, CreditCard, Info } from 'lucide-react';

export default function DuesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dues & Payments</h1>
              <p className="text-lg text-gray-600 mt-1">Fee Structure and Payment Options</p>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Membership Dues</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-700 font-bold">Membership Type</th>
                  <th className="text-center py-4 px-4 text-gray-700 font-bold">Annual Fee</th>
                  <th className="text-center py-4 px-4 text-gray-700 font-bold">Payment Frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 bg-lmsa-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Full Member</td>
                  <td className="py-4 px-4 text-center text-lmsa-600 font-bold text-xl">$25</td>
                  <td className="py-4 px-4 text-center text-gray-700">Yearly</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 font-medium text-gray-900">Associate Member</td>
                  <td className="py-4 px-4 text-center text-lmsa-600 font-bold text-xl">$15</td>
                  <td className="py-4 px-4 text-center text-gray-700">Yearly</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Honorary Member</td>
                  <td className="py-4 px-4 text-center text-gray-600">By invitation</td>
                  <td className="py-4 px-4 text-center text-gray-700">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={24} className="text-lmsa-600" />
                <h3 className="text-lg font-bold text-gray-900">Online Payment</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Mobile money (MTN, Orange)</li>
                <li>• Bank transfer</li>
                <li>• Payment portal (coming soon)</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign size={24} className="text-lmsa-600" />
                <h3 className="text-lg font-bold text-gray-900">In-Person Payment</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Cash to class representative</li>
                <li>• Direct to LMSA office</li>
                <li>• At LMSA events</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8">
          <div className="flex items-start gap-3 mb-4">
            <Info size={24} className="text-lmsa-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Important Information</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Payment Deadline:</strong> Dues must be paid by October 31st each year</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Grace Period:</strong> 30-day grace period after deadline</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Financial Hardship:</strong> Payment plans and waivers available upon request</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Receipt:</strong> Always request and keep your payment receipt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
