import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Heart, FileText, Users, Utensils, Scale,
  Trophy, DollarSign, Globe, UserPlus, Megaphone, HeartHandshake,
  Calendar, Download, Mail, Bell, Share2,
  Clock, MapPin, Loader,
  Check, AlertCircle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { committeeService } from '@services/committee.service';

// ─── Static data for all 12 committees (fallback / seed) ─────────────────────
// Extracted to a shared module so the public committees index uses the
// same constitutional registry (single source of truth).
import { ALL_COMMITTEES_DATA } from '@utils/committeesData';
export { ALL_COMMITTEES_DATA };

const ICON_MAP = {
  BookOpen, Heart, FileText, Users, Utensils, Scale,
  Trophy, DollarSign, Globe, UserPlus, Megaphone, HeartHandshake,
};

// ─── Dynamic Committee Page ───────────────────────────────────────────────────
export default function CommitteePageTemplate() {
  const { slug } = useParams();
  const [committee, setCommittee] = useState(null);
  const [members, setMembers]     = useState([]);
  const [events, setEvents]       = useState([]);
  const [docs, setDocs]           = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSending, setSending]  = useState(false);
  const [newsletterEmail, setNlEmail] = useState('');
  const [nlSent, setNlSent]          = useState(false);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadAll() {
    setLoading(true);
    try {
      // Try API first, fall back to static data
      let data;
      try {
        data = await committeeService.getBySlug(slug);
      } catch {
        // Use static fallback data while DB is being set up. An unknown
        // slug must yield null so the Not Found state renders — spreading
        // undefined would fabricate a blank but "truthy" committee.
        const fallback = ALL_COMMITTEES_DATA[slug];
        data = fallback ? { ...fallback, slug, id: slug, status: 'active' } : null;
      }
      setCommittee(data);
      if (!data) return;

      // Load related data in parallel
      const [m, ev, d, ann, ach] = await Promise.allSettled([
        committeeService.getMembers(data.id),
        committeeService.getEvents(data.id),
        committeeService.getDocuments(data.id),
        committeeService.getAnnouncements(data.id),
        committeeService.getAchievements(data.id),
      ]);
      setMembers(m.status === 'fulfilled' ? m.value : []);
      setEvents(ev.status === 'fulfilled' ? ev.value : []);
      setDocs(d.status === 'fulfilled' ? d.value : []);
      setAnnouncements(ann.status === 'fulfilled' ? ann.value : []);
      setAchievements(ach.status === 'fulfilled' ? ach.value : []);
    } catch (e) {
      toast.error('Committee not found');
    } finally {
      setLoading(false);
    }
  }

  async function sendContact(e) {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      await committeeService.submitContactForm(committee.id, contactForm);
      toast.success('Message sent! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function subscribeNewsletter(e) {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await committeeService.subscribeNewsletter(committee.id, newsletterEmail);
      setNlSent(true);
      toast.success('Subscribed to committee updates!');
    } catch {
      toast.error('Subscription failed');
    }
  }

  function shareEvent(ev) {
    const url = `${window.location.origin}/events/${ev.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Event link copied!');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-lmsa-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading committee...</p>
        </div>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Committee Not Found</p>
          <Link to="/leadership/committees" className="text-lmsa-600 hover:underline">
            View all committees →
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[committee.icon] || BookOpen;
  const chair = members.find(m => m.position === 'Chair');
  const viceChair = members.find(m => m.position === 'Vice Chair');
  const regularMembers = members.filter(m => m.position !== 'Chair' && m.position !== 'Vice Chair');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'completed');
  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const otherAnnouncements = announcements.filter(a => !a.pinned);

  const TABS = [
    { id: 'about', label: 'About' },
    { id: 'members', label: `Members (${members.length})` },
    { id: 'events', label: `Events (${events.length})` },
    { id: 'resources', label: `Resources (${docs.length})` },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 border-b border-lmsa-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-lmsa-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Icon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lmsa-600 font-semibold text-sm mb-1">LMSA Standing Committee</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{committee.name}</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">{committee.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to="/get-involved/committees"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-lmsa-600 text-white rounded-lg text-sm font-medium hover:bg-lmsa-700 transition-colors"
                >
                  <UserPlus size={15} /> Join This Committee
                </Link>
                {committee.email && (
                  <a
                    href={`mailto:${committee.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-white text-lmsa-600 border border-lmsa-200 rounded-lg text-sm font-medium hover:bg-lmsa-50 transition-colors"
                  >
                    <Mail size={15} /> Contact Us
                  </a>
                )}
              </div>
            </div>
            {/* Quick Stats */}
            <div className="hidden lg:flex gap-4">
              {[
                { label: 'Members', value: members.length, icon: Users },
                { label: 'Events', value: events.length, icon: Calendar },
                { label: 'Docs', value: docs.length, icon: FileText },
              ].map((s, i) => {
                const SI = s.icon;
                return (
                  <div key={i} className="bg-white rounded-xl p-4 text-center min-w-[80px] shadow-sm">
                    <SI size={18} className="text-lmsa-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Pinned Announcements Banner ────────────────────────────────── */}
      {pinnedAnnouncements.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            {pinnedAnnouncements.map(a => (
              <div key={a.id} className="flex items-start gap-2">
                <Bell size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>{a.title}:</strong> {a.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-lmsa-600 text-lmsa-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main Column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── ABOUT TAB ─────────────────────────────────────────── */}
            {activeTab === 'about' && (
              <>
                {/* Mandate */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Committee Mandate</h2>
                  <ul className="space-y-3">
                    {(committee.mandate || ALL_COMMITTEES_DATA[slug]?.mandate || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-lmsa-100 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-lmsa-600 rounded-full" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Key Activities */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Activities</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(committee.key_activities || ALL_COMMITTEES_DATA[slug]?.key_activities || []).map((act, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 bg-lmsa-50 rounded-xl border border-lmsa-100">
                        <Check size={15} className="text-lmsa-600 shrink-0" />
                        <span className="text-sm font-medium text-gray-800">{act}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Achievements */}
                {achievements.length > 0 && (
                  <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements & Milestones</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {achievements.map((a, i) => (
                        <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                          <div className="text-2xl mb-2">{a.badge_emoji || '🏆'}</div>
                          <h3 className="font-semibold text-gray-900 text-sm">{a.title}</h3>
                          {a.description && <p className="text-xs text-gray-500 mt-1">{a.description}</p>}
                          {a.date && <p className="text-xs text-amber-600 mt-2 font-medium">{new Date(a.date).toLocaleDateString('default',{year:'numeric',month:'long'})}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Upcoming Events Preview */}
                {upcomingEvents.length > 0 && (
                  <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                      <button onClick={() => setActiveTab('events')} className="text-sm text-lmsa-600 hover:underline">View all →</button>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.slice(0, 3).map((ev, i) => (
                        <EventCard key={i} event={ev} onShare={() => shareEvent(ev)} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Other Announcements */}
                {otherAnnouncements.length > 0 && (
                  <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Announcements</h2>
                    <div className="space-y-3">
                      {otherAnnouncements.map((a, i) => (
                        <AnnouncementCard key={i} announcement={a} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ── MEMBERS TAB ───────────────────────────────────────── */}
            {activeTab === 'members' && (
              <>
                {members.length === 0 ? (
                  <EmptySection icon={Users} message="Member directory coming soon" />
                ) : (
                  <>
                    {/* Leadership */}
                    {(chair || viceChair) && (
                      <section className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Committee Leadership</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[chair, viceChair].filter(Boolean).map((m, i) => (
                            <MemberProfileCard key={i} member={m} featured />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* All Members */}
                    {regularMembers.length > 0 && (
                      <section className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Members ({regularMembers.length})</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {regularMembers.map((m, i) => (
                            <MemberProfileCard key={i} member={m} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── EVENTS TAB ────────────────────────────────────────── */}
            {activeTab === 'events' && (
              <>
                {events.length === 0 ? (
                  <EmptySection icon={Calendar} message="No events scheduled yet. Check back soon!" />
                ) : (
                  <>
                    {/* Upcoming */}
                    {upcomingEvents.length > 0 && (
                      <section className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                          {upcomingEvents.map((ev, i) => (
                            <EventCard key={i} event={ev} detailed onShare={() => shareEvent(ev)} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                      <section className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Past Events</h2>
                        <div className="space-y-3">
                          {pastEvents.map((ev, i) => (
                            <EventCard key={i} event={ev} past onShare={() => shareEvent(ev)} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── RESOURCES TAB ─────────────────────────────────────── */}
            {activeTab === 'resources' && (
              <>
                {docs.length === 0 ? (
                  <EmptySection icon={FileText} message="No documents uploaded yet." />
                ) : (
                  <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">Documents & Resources</h2>
                      <p className="text-sm text-gray-500 mt-1">Official documents from the {committee.name}</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {docs.map((doc, i) => (
                        <DocumentRow key={i} doc={doc} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ── CONTACT TAB ───────────────────────────────────────── */}
            {activeTab === 'contact' && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Contact {committee.name}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Have a question or want to get involved? Send us a message and we&apos;ll get back to you.
                </p>
                <form onSubmit={sendContact} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                      <input
                        className="input"
                        placeholder="Full name"
                        value={contactForm.name}
                        onChange={e => setContactForm(f => ({...f, name: e.target.value}))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <input
                        className="input"
                        type="email"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={e => setContactForm(f => ({...f, email: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select
                      className="input"
                      value={contactForm.subject}
                      onChange={e => setContactForm(f => ({...f, subject: e.target.value}))}
                    >
                      <option value="">General Inquiry</option>
                      <option value="join">I want to join this committee</option>
                      <option value="event">Question about an event</option>
                      <option value="resource">Request a resource</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      className="input resize-none"
                      rows={5}
                      placeholder="Write your message here..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({...f, message: e.target.value}))}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactSending}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {contactSending ? (
                      <><Loader size={15} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Mail size={15} /> Send Message</>
                    )}
                  </button>
                </form>

                {committee.email && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-lmsa-600" />
                    You can also reach us directly at{' '}
                    <a href={`mailto:${committee.email}`} className="text-lmsa-600 hover:underline">
                      {committee.email}
                    </a>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Committee Chair Card */}
            {chair ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4">Committee Chair</h3>
                <div className="flex items-center gap-3 mb-4">
                  {chair.profile_photo_url ? (
                    <img src={chair.profile_photo_url} alt={chair.full_name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-lmsa-100 flex items-center justify-center text-lmsa-700 font-bold text-lg">
                      {chair.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{chair.full_name}</p>
                    <p className="text-sm text-gray-500">Year {chair.year_level} • Chair</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="w-full px-4 py-2 bg-lmsa-600 text-white rounded-xl text-sm font-medium hover:bg-lmsa-700 transition-colors"
                >
                  Contact Chair
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Committee Chair</h3>
                <p className="text-sm text-gray-400">Chair information will be listed here once assigned.</p>
              </div>
            )}

            {/* Join CTA */}
            <div className="bg-lmsa-600 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-1">Join This Committee</h3>
              <p className="text-sm text-lmsa-100 mb-4">Get involved and make an impact in this area of student life.</p>
              <Link
                to="/get-involved/committees"
                className="block w-full px-4 py-2 bg-white text-lmsa-600 text-center rounded-xl text-sm font-semibold hover:bg-lmsa-50 transition-colors"
              >
                Express Interest
              </Link>
            </div>

            {/* Meeting Schedule (if available) */}
            {committee.meeting_schedule && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-lmsa-600" /> Meeting Schedule
                </h3>
                <p className="text-sm text-gray-600">{committee.meeting_schedule}</p>
              </div>
            )}

            {/* Documents Quick Access */}
            {docs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Quick Downloads</h3>
                <div className="space-y-2">
                  {docs.slice(0, 4).map((doc, i) => (
                    <a
                      key={i}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-lmsa-600 hover:text-lmsa-700 hover:underline"
                    >
                      <Download size={13} />
                      {doc.title}
                    </a>
                  ))}
                  {docs.length > 4 && (
                    <button onClick={() => setActiveTab('resources')} className="text-xs text-gray-400 hover:text-gray-600">
                      +{docs.length - 4} more documents
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Bell size={16} className="text-lmsa-600" /> Stay Updated
              </h3>
              <p className="text-sm text-gray-500 mb-3">Get notified about this committee&apos;s events and news.</p>
              {nlSent ? (
                <div className="flex items-center gap-2 text-lmsa-600 text-sm">
                  <Check size={16} /> Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={subscribeNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="input flex-1 text-sm"
                    value={newsletterEmail}
                    onChange={e => setNlEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="px-3 py-2 bg-lmsa-600 text-white rounded-lg text-sm font-medium hover:bg-lmsa-700">
                    <Bell size={14} />
                  </button>
                </form>
              )}
            </div>

            {/* Back to Committees */}
            <Link
              to="/leadership/committees"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← All Committees
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function MemberProfileCard({ member, featured }) {
  return (
    <div className={`p-4 rounded-xl border ${featured ? 'border-lmsa-200 bg-lmsa-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-3 mb-2">
        {member.profile_photo_url ? (
          <img src={member.profile_photo_url} alt={member.full_name} className={`rounded-full object-cover ${featured ? 'w-14 h-14' : 'w-10 h-10'}`} />
        ) : (
          <div className={`rounded-full flex items-center justify-center font-bold ${featured ? 'w-14 h-14 text-lg bg-lmsa-200 text-lmsa-800' : 'w-10 h-10 text-sm bg-gray-100 text-gray-600'}`}>
            {member.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
        )}
        <div>
          <p className={`font-semibold ${featured ? 'text-lmsa-900' : 'text-gray-900'} text-sm`}>{member.full_name}</p>
          <p className={`text-xs ${featured ? 'text-lmsa-600 font-medium' : 'text-gray-500'}`}>{member.position}</p>
        </div>
      </div>
      {member.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>}
      <p className="text-xs text-gray-400 mt-1">Year {member.year_level}</p>
    </div>
  );
}

function EventCard({ event, detailed, past, onShare }) {
  const start = new Date(event.start_datetime);
  return (
    <div className={`p-4 rounded-xl border transition-colors ${past ? 'border-gray-100 bg-gray-50 opacity-75' : 'border-gray-200 bg-white hover:border-lmsa-200'}`}>
      <div className="flex gap-4">
        <div className={`text-center rounded-xl px-3 py-2 min-w-[52px] shrink-0 ${past ? 'bg-gray-200' : 'bg-lmsa-50'}`}>
          <p className={`text-xs font-semibold ${past ? 'text-gray-500' : 'text-lmsa-600'}`}>
            {start.toLocaleString('default',{month:'short'})}
          </p>
          <p className={`text-xl font-bold ${past ? 'text-gray-500' : 'text-lmsa-700'}`}>{start.getDate()}</p>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
          {detailed && event.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {event.location && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={11} /> {event.location}
              </span>
            )}
            {event.registration_required && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Registration required</span>
            )}
            {event.fee > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">${event.fee}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {!past && event.registration_required && (
            <Link to={`/events/${event.slug}`} className="text-xs px-3 py-1.5 bg-lmsa-600 text-white rounded-lg hover:bg-lmsa-700 whitespace-nowrap">
              Register
            </Link>
          )}
          <button onClick={onShare} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ doc }) {
  const catEmoji = { charter:'📜', bylaws:'⚖️', report:'📊', minutes:'📝', newsletter:'📰', study_material:'📚', other:'📄' };
  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
      <span className="text-xl shrink-0">{catEmoji[doc.category] || '📄'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {doc.category?.replace('_',' ')} •{' '}
          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}
          {doc.file_size ? ` • ${Math.round(doc.file_size/1024)}KB` : ''}
        </p>
      </div>
      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-lmsa-50 text-lmsa-600 rounded-lg hover:bg-lmsa-100 font-medium shrink-0"
      >
        <Download size={12} /> Download
      </a>
    </div>
  );
}

function AnnouncementCard({ announcement }) {
  const STYLES = {
    info:    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-800', icon: <Info size={16} className="text-blue-500 shrink-0 mt-0.5" /> },
    success: { bg: 'bg-lmsa-50', border: 'border-lmsa-100', text: 'text-lmsa-800', icon: <Check size={16} className="text-lmsa-500 shrink-0 mt-0.5" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', icon: <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> },
    urgent:  { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-800', icon: <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> },
  };
  const style = STYLES[announcement.type] || STYLES.info;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${style.bg} ${style.border}`}>
      {style.icon}
      <div>
        <p className={`text-sm font-semibold ${style.text}`}>{announcement.title}</p>
        <p className={`text-sm mt-0.5 ${style.text} opacity-80`}>{announcement.message}</p>
      </div>
    </div>
  );
}

function EmptySection({ icon: Icon, message }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <Icon size={40} className="mx-auto mb-3 text-gray-200" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

// ─── Updated CommitteesPage (overview) with membership CTA + stats ────────────
export function CommitteesOverviewPage() {
  const [search, setSearch] = useState('');
  const filtered = Object.entries(ALL_COMMITTEES_DATA)
    .filter(([, c]) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16 border-b border-lmsa-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Standing Committees</h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-6">
            Our 12 standing committees drive LMSA&apos;s mission, each focused on a specific area of student life, academics, and community.
          </p>
          <input
            className="input max-w-md bg-white"
            placeholder="Search committees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(([slug, c]) => {
            const Icon = ICON_MAP[c.icon] || BookOpen;
            return (
              <Link
                key={slug}
                to={`/leadership/committees/${slug}`}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-lmsa-300 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-lmsa-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-lmsa-600 transition-colors">
                    <Icon size={22} className="text-lmsa-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-lmsa-600 transition-colors">{c.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{c.description || c.mandate?.[0]}</p>
                    <p className="text-xs text-lmsa-600 font-medium mt-3">Learn more →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-lmsa-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Join a Committee?</h2>
          <p className="text-lmsa-100 mb-8 max-w-2xl mx-auto">
            Get involved in LMSA&apos;s work by joining one of our committees. Develop leadership skills and make a real difference.
          </p>
          <Link to="/get-involved/committees" className="inline-block px-8 py-3 bg-white text-lmsa-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
            Join a Committee
          </Link>
        </div>
      </div>
    </div>
  );
}
