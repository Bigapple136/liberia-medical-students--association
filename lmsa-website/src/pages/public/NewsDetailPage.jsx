import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';

const newsData = {
  'lmsa-international-partnership': {
    title: 'LMSA Partners with International Medical Organizations',
    date: 'April 5, 2026',
    category: 'Partnership',
    content: 'New collaboration will provide additional resources and opportunities for LMSA members. This partnership includes access to international conferences, research opportunities, and educational resources.',
  },
  'symposium-registration-open': {
    title: 'Annual Symposium Registration Now Open',
    date: 'March 28, 2026',
    category: 'Events',
    content: 'Early bird registration available until May 31st. Don\'t miss out on the biggest medical student event of the year!',
  },
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const article = newsData[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/news" className="text-lmsa-600 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link to="/news" className="inline-flex items-center gap-2 text-lmsa-600 hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to News
        </Link>

        {/* Article */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <span className="bg-lmsa-100 text-lmsa-700 text-sm font-bold px-4 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-2 text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{article.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
