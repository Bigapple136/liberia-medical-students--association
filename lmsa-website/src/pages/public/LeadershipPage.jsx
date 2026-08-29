import { useState, useEffect } from 'react';
import { User, Loader, Crown } from 'lucide-react';
import Card from '@components/common/Card';
import { executiveService } from '@services/executive.service';

// ─── Static fallback (only used if API call fails or is empty) ────────────
const FALLBACK_EXECUTIVES = [
  { position_name: 'President', position_rank: 1, holder_name: 'Student Name', holder_photo_url: null, bio: 'Final year medical student passionate about student advocacy' },
  { position_name: 'Vice President', position_rank: 2, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student focused on academic excellence' },
  { position_name: 'General Secretary', position_rank: 3, holder_name: 'Student Name', holder_photo_url: null, bio: 'Third year student ensuring transparent communication' },
  { position_name: 'Financial Secretary', position_rank: 4, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student managing association finances' },
  { position_name: 'Public Relations Officer', position_rank: 5, holder_name: 'Student Name', holder_photo_url: null, bio: 'Second year student building our public presence' },
  { position_name: 'Academic Director', position_rank: 6, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fifth year student leading academic initiatives' },
];

export default function LeadershipPage() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadExecutives();
  }, []);

  async function loadExecutives() {
    setLoading(true);
    try {
      const data = await executiveService.getAll();
      if (data && data.length > 0) {
        setExecutives(data);
      } else {
        // No positions assigned yet — show fallback placeholders
        setExecutives(FALLBACK_EXECUTIVES);
      }
    } catch {
      setError(true);
      setExecutives(FALLBACK_EXECUTIVES);
    } finally {
      setLoading(false);
    }
  }

  // Determine the current academic year from the data, or default
  const currentYear = executives[0]?.academic_year || '2025-2026';

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">LMSA Leadership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Meet the dedicated leaders guiding our association towards excellence
          </p>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">Executive Committee</h2>
            <p className="text-gray-600">Academic Year {currentYear}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader className="animate-spin text-lmsa-600" size={28} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {executives.map((exec, index) => (
                <Card key={exec.id || index} className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-lmsa-50 flex items-center justify-center overflow-hidden">
                    {exec.holder_photo_url ? (
                      <img
                        src={exec.holder_photo_url}
                        alt={exec.holder_name || exec.position_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-lmsa-600" strokeWidth={1.5} />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {exec.holder_name || 'Position Available'}
                  </h3>
                  <p className="text-lmsa-600 font-medium mb-2 flex items-center justify-center gap-1.5">
                    {exec.position_rank <= 2 && <Crown size={14} className="text-amber-500" />}
                    {exec.position_name}
                  </p>
                  {exec.bio && (
                    <p className="text-sm text-gray-600 text-balance">{exec.bio}</p>
                  )}
                  {exec.holder_year_level && (
                    <p className="text-xs text-gray-400 mt-1">Year {exec.holder_year_level}</p>
                  )}
                  {error && (
                    <p className="text-xs text-amber-500 mt-2">Using placeholder data</p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Organizational Structure */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center uppercase tracking-tight">Organizational Structure</h2>
            <Card>
              <div className="space-y-4">
                <div className="border-l-4 border-lmsa-600 pl-4">
                  <h3 className="font-bold text-lg">General Assembly</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Supreme decision-making body comprising all registered members
                  </p>
                </div>
                <div className="border-l-4 border-lmsa-400 pl-4 ml-8">
                  <h3 className="font-bold text-lg">Executive Committee</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Elected officers responsible for day-to-day operations
                  </p>
                </div>
                <div className="border-l-4 border-lmsa-200 pl-4 ml-16">
                  <h3 className="font-bold text-lg">Standing Committees</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Academic, Finance, Welfare, Events, and Public Relations
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Join Leadership */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Interested in Leadership?</h2>
            <p className="text-gray-600 mb-6 text-balance">
              Elections are held annually. Get involved and make a difference!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
