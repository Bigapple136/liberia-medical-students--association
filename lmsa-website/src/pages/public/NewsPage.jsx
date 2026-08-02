import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const news = [
  {
    id: 1,
    title: 'LMSA Partners with International Medical Organizations',
    date: 'April 5, 2026',
    category: 'Partnership',
    excerpt: 'New collaboration will provide additional resources and opportunities for LMSA members.',
    slug: 'lmsa-international-partnership',
  },
  {
    id: 2,
    title: 'Annual Symposium Registration Now Open',
    date: 'March 28, 2026',
    category: 'Events',
    excerpt: 'Early bird registration available until May 31st. Don\'t miss out!',
    slug: 'symposium-registration-open',
  },
  {
    id: 3,
    title: 'New Mentorship Program Records',
    date: 'March 15, 2026',
    category: 'Programs',
    excerpt: 'Over 500 students matched in the largest mentorship cohort to date.',
    slug: 'mentorship-records',
  },
  {
    id: 4,
    title: 'LMSA Launches Digital Resource Library',
    date: 'March 1, 2026',
    category: 'Technology',
    excerpt: 'Access hundreds of study materials online, exclusively for members.',
    slug: 'digital-library-launch',
  },
  {
    id: 5,
    title: 'Student Research Published in Medical Journal',
    date: 'February 20, 2026',
    category: 'Research',
    excerpt: 'Groundbreaking work on infectious diseases by LMSA members gains recognition.',
    slug: 'student-research-published',
  },
  {
    id: 6,
    title: 'Community Health Outreach Success',
    date: 'February 10, 2026',
    category: 'Community',
    excerpt: 'Over 300 patients served in latest health screening event.',
    slug: 'outreach-success',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">News</h1>
          <p className="text-lg text-gray-600">Latest Updates and Announcements</p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Newspaper size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <span className="bg-lmsa-100 text-lmsa-700 text-xs font-bold px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-2 text-lmsa-600 font-medium text-sm">
                  <span>Read More</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
