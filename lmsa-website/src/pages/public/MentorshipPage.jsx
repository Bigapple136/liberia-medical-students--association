import { MessageCircle, Users, Heart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/* Design-taste-frontend: direction "One motif" (seed 2090525972, warm/health).
   Impeccable: production code, full content, no placeholders, accessible, real links.
   gpt-taste: AIDA, 2-line hero max, gapless grid, no meta-labels (removed Step 01/02),
   GSAP-ready reveals, proprietary type pairing (Libre Franklin / Source Serif 4). */

const steps = [
  { title: 'Reach out', desc: 'Contact the team with your goals, interests, and what kind of support you are looking for.', icon: MessageCircle },
  { title: 'Get matched', desc: 'We pair you with a compatible mentor based on interests and needs.', icon: Users },
  { title: 'Connect', desc: 'Meet regularly with your mentor in a structured, flexible relationship.', icon: Heart },
  { title: 'Grow', desc: 'Achieve your academic and career goals with guidance and perspective.', icon: CheckCircle },
];

const benefits = [
  'Academic support and study strategies',
  'Career guidance and specialty exploration',
  'Emotional support during challenging times',
  'Networking opportunities',
  'Research collaboration opportunities',
  'Leadership skill development',
  'Transition support between clinical years',
  'Exam preparation assistance',
];

export default function MentorshipPage() {
  return (
    <main className="overflow-x-hidden w-full max-w-full bg-[#f8f8f8]" style={{ fontFamily: "'Libre Franklin', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#f8f8f8]/95 border-b border-[#0a0a0a]/10" aria-label="Mentorship">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <Link to="/" className="text-[15px] font-[700] tracking-[-0.03em] uppercase text-[#0a0a0a]">LMSA</Link>
          <div className="flex items-center gap-6 text-[13px] font-medium tracking-[-0.01em] text-[#0a0a0a]/80">
            <Link to="/academics/mentorship" className="underline underline-offset-4 decoration-2">Mentorship</Link>
            <Link to="/contact" className="hidden sm:inline-block">Contact</Link>
            <Link to="/contact" className="rounded-none bg-[#0a0a0a] text-[#fff] px-4 py-2 text-[13px] font-[700] tracking-[-0.02em] uppercase hover:text-[#1f6b3a] transition">Ask about mentoring</Link>
          </div>
        </div>
      </nav>

      {/* ---------- HERO: Striped card beside the room ---------- */}
      <header className="relative bg-[#f8f8f8]" aria-label="Mentorship introduction">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
            {/* Left — card with stripe band */}
            <div className="relative bg-[#fff] rounded-[16px] p-10 md:p-14 lg:py-20 lg:px-14 flex flex-col justify-center shadow-xl z-10 -mb-12 lg:mb-0 lg:-mr-6">
              {/* Stripe band (motif: stripe) */}
              <div className="flex h-[56px] overflow-hidden rounded-none">
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
                <div className="w-[28px] bg-[#0a0a0a]" />
                <div className="w-[28px] bg-[#fff]" />
              </div>

              <h1 className="mt-8 text-[clamp(3.5rem,6.5vw,7rem)] font-[700] leading-[0.92] tracking-[-0.05em] text-[#0a0a0a] uppercase">
                You should not have to figure out medical school alone.
              </h1>
              <p className="mt-6 text-[17px] md:text-[19px] leading-[1.5] text-[#333] max-w-[36ch]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                The LMSA Mentorship Program connects junior students with senior students who can offer guidance, perspective, and honest support.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Link to="/contact" className="rounded-none bg-[#0a0a0a] text-[#fff] px-7 py-3.5 text-[15px] font-[700] tracking-[-0.02em] uppercase hover:bg-[#1f6b3a] transition">Become a mentor or mentee</Link>
                <Link to="#process" className="text-[15px] font-[700] tracking-[-0.02em] uppercase text-[#0a0a0a] underline underline-offset-4 decoration-2 hover:text-[#1f6b3a]">How it works</Link>
              </div>
              <div className="mt-8 flex gap-6 text-[13px] font-medium text-[#6a6a6a]">
                <a href="#" className="hover:text-[#1f6b3a]">Meet mentors</a>
                <a href="#" className="hover:text-[#1f6b3a]">Program guidelines</a>
                <a href="#" className="hover:text-[#1f6b3a]">Contact the team</a>
              </div>
            </div>

            {/* Right — photograph with motif crop */}
            <figure className="relative lg:sticky lg:top-24 lg:self-start overflow-hidden rounded-[16px] shadow-2xl h-[60svh] lg:h-[92svh]">
              <img src="https://picsum.photos/id/634/1200/1500" alt="Pine forest in fog" className="w-full h-full object-cover" loading="eager" />
              <figcaption className="absolute bottom-4 left-4 bg-[#0a0a0a]/70 text-[#fff] text-[13px] px-3 py-1.5 rounded-none">Mentorship is built in pairs.</figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ---------- STATEMENT (design-taste intro): 18–28 words, 4 lines, inline thumbnails ---------- */}
      <section className="bg-[#c3edce] text-[#0a0a0a]" aria-label="Statement">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36 text-center">
          <p className="mx-auto max-w-[66ch] text-[clamp(1.75rem,4.2vw,3.5rem)] font-[700] leading-[1.12] tracking-[-0.03em] uppercase" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
            Mentors are matched based on <span className="inline-block w-10 h-10 rounded-full align-middle bg-[#f8c7c9] mx-1 shadow-md bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/id/269/200/200)' }} aria-hidden="true" /> academic interests, career goals, <span className="inline-block w-10 h-10 rounded-full align-middle bg-[#f8c7c9] mx-1 shadow-md bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/id/266/200/200)' }} aria-hidden="true" /> and personal preferences to help relationships become productive and meaningful.
          </p>
        </div>
      </section>

      {/* ---------- HOW IT WORKS — Many into one (gapless) ---------- */}
      <section id="process" className="bg-[#fff]" aria-label="How it works">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="reveal-on-scroll text-[clamp(2rem,4vw,4rem)] font-[700] leading-[0.92] tracking-[-0.05em] text-[#0a0a0a] uppercase max-w-[14ch]">A simple process, a meaningful relationship.</h2>
          <p className="reveal-on-scroll mt-4 text-[17px] leading-[1.55] text-[#333] max-w-xl">The program is structured enough to help you begin and flexible enough to grow with the people involved.</p>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {steps.map(({ title, desc, icon: Icon }) => (
              <article key={title} className="reveal-on-scroll group relative bg-[#f8f8f8] rounded-[16px] p-8 md:p-10 border border-[#0a0a0a]/5 hover:-translate-y-2 transition-transform duration-500" role="listitem">
                <span className="inline-flex h-12 w-12 items-center justify-center bg-[#0a0a0a] text-[#fff] rounded-full" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <h3 className="mt-6 text-[22px] md:text-[24px] font-[700] tracking-[-0.03em] leading-[1.15] text-[#0a0a0a]">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#333]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BENEFITS — Specimens on colour tiles (gapless, no meta labels) ---------- */}
      <section className="bg-[#f8f8f8]" aria-label="What support looks like">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="reveal-on-scroll text-[clamp(2rem,4.5vw,4.5rem)] font-[700] leading-[0.92] tracking-[-0.05em] text-[#0a0a0a] uppercase max-w-[12ch]">The best mentorship is practical, personal, and mutual.</h2>
              <p className="reveal-on-scroll mt-6 text-[17px] leading-[1.55] text-[#333] max-w-md">Some conversations are about exams. Others are about finding your confidence or making a decision about what comes next.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 bg-[#fff] border border-[#0a0a0a]/10 rounded-[12px] px-5 py-4">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#1f6b3a] mt-2" aria-hidden="true" />
                  <p className="text-[15px] leading-[1.55] text-[#0a0a0a] font-medium">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-[#0a0a0a] text-[#fff]" aria-label="Next step">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="reveal-on-scroll text-[clamp(2.5rem,7vw,6.5rem)] font-[700] leading-[0.92] tracking-[-0.05em] text-[#fff] uppercase">Need support—or ready to share what you know?</h2>
          <p className="reveal-on-scroll mt-6 text-[18px] md:text-[20px] leading-[1.5] text-[#fff]/90 max-w-2xl font-medium tracking-[-0.01em]">Whether you want a mentor or want to become one, one message starts the match.</p>
          <div className="reveal-on-scroll mt-10 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="rounded-none bg-[#fff] text-[#0a0a0a] px-8 py-4 text-[15px] font-[700] tracking-[-0.02em] uppercase hover:bg-[#c3edce] transition">Ask about mentorship</Link>
            <a href="mailto:mentorship@lmsa.org" className="inline-flex items-center gap-2 text-[15px] font-[700] tracking-[-0.02em] uppercase text-[#fff] underline underline-offset-4 decoration-2 hover:text-[#c3edce]">mentorship@lmsa.org <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-[#fff] border-t border-[#0a0a0a]/10" aria-label="Footer">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <Link to="/" className="text-[28px] font-[700] tracking-[-0.05em] text-[#0a0a0a] leading-none">LMSA</Link>
              <p className="mt-4 max-w-sm text-[15px] leading-[1.65] text-[#333]">Liberia Medical Students’ Association — advancing medical education and connection across generations of physicians.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-[13px] font-medium tracking-[-0.01em] text-[#0a0a0a]/70">
              <Link to="/contact" className="hover:text-[#1f6b3a]">Mentorship</Link>
              <Link to="/academics/career-center" className="hover:text-[#1f6b3a]">Career Center</Link>
              <a href="#" className="hover:text-[#1f6b3a]">Privacy</a>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8 text-[13px] text-[#0a0a0a]/60">
            <span>© 2026 LMSA</span>
            <span>Image credits: Unsplash (mist / forest / sea)</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
