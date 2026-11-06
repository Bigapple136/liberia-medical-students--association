import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';

/* Impeccable + gpt-taste + design-taste-frontend:
   Red Hat-style geometric display / text pairing, bold colour chapters,
   gapless bento, AIDA structure, GSAP-ready scroll reveals, no cheap meta-labels,
   2-line hero max, full-bleed fields with hard edges, real imagery credited.
   All content preserved and expanded from original CareerCenterPage. */

const pathways = [
  { title: 'Primary care & internal medicine', desc: 'The broadest foundation—chronic disease, infectious disease, the whole patient.', colour: '#97aaf6', ink: '#000' },
  { title: 'Surgery & procedural specialties', desc: 'For those drawn to anatomy in the hands: precise, high-stakes, immediate.', colour: '#bbf697', ink: '#000' },
  { title: 'Pediatrics & maternal health', desc: 'Care shaped by Liberia’s youngest patients and their mothers.', colour: '#fed878', ink: '#000' },
  { title: 'Public health & health systems', desc: 'Medicine at the scale of communities, policy, and prevention.', colour: '#6ef8fb', ink: '#000' },
  { title: 'Global pathways & residency', desc: 'Training abroad without losing sight of practice at home.', colour: '#d0106f', ink: '#fff' },
  { title: 'Research & academic medicine', desc: 'Questions, teaching, and the evidence that changes guidelines.', colour: '#cfcfcf', ink: '#000' },
];

const offerings = [
  { title: 'Career advising', desc: 'One-on-one conversations with advisors who turn uncertainty into a workable plan.' },
  { title: 'Specialty exploration', desc: 'Structured exposure to clinical fields—what each specialty practices daily.' },
  { title: 'Applications & CV support', desc: 'Feedback on CVs, personal statements, and materials before your first deadline.' },
  { title: 'Opportunities & postings', desc: 'Internships, scholarships, and openings shared through LMSA news.' },
];

const questions = [
  { q: 'I have no idea which specialty fits me. Where do I start?', a: 'Start with a career advising conversation. Advisors help you connect what you enjoy in preclinical and clinical work with the specialties that reward those same strengths.' },
  { q: 'What options exist for training outside Liberia?', a: 'The center maintains information on international residencies and scholarships, and connects students with alumni who have completed training abroad. Global pathways and practice at home are not competing choices.' },
  { q: 'When should I start thinking about my career?', a: 'Where you are right now. Careers are assembled through rotations, research, volunteering, and the people you meet—the earlier the pieces start, the more options you keep.' },
  { q: 'Can alumni in practice help with applications?', a: 'Yes. The alumni network includes physicians in practice and training who offer honest feedback on applications, interviews, and the decisions that come with them.' },
];

export default function CareerCenterPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    // gpt-taste + impeccable: simple scroll-triggered class reveal (no broken GSAP build)
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-x-hidden w-full max-w-full" style={{ fontFamily: "'Red Hat Text', system-ui, sans-serif" }}>
      {/* ---------- NAV (minimal, no glass, no pill) ---------- */}
      <nav className="sticky top-0 z-50 bg-[#f7f7f5]/95 backdrop-blur-none" aria-label="Career center">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <Link to="/" className="text-[15px] font-[900] tracking-[-0.03em] uppercase text-[#000] leading-none">LMSA</Link>
          <div className="flex items-center gap-6 text-[13px] font-medium tracking-[-0.01em] text-[#000]/80">
            <Link to="/academics/career-center" className="underline underline-offset-4 decoration-2">Career Center</Link>
            <Link to="/contact" className="hidden sm:inline-block">Contact</Link>
            <Link to="/contact" className="rounded-none bg-[#000] text-[#fff] px-4 py-2 text-[13px] font-[900] tracking-[-0.02em] uppercase hover:opacity-90 transition">Talk to the team</Link>
          </div>
        </div>
      </nav>

      {/* ---------- HERO: Attention (AIDA) ---------- */}
        {/* Paper field carries the setup line; the magenta bar carries the punch line,
            anchored to the text in normal flow so it can never drift off the seam */}
      <header ref={heroRef} className="relative flex min-h-[74svh] flex-col items-start justify-end overflow-hidden bg-[#f7f7f5] md:min-h-[80svh]">
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-[14svh] pb-16 md:px-10 md:pt-[18svh] md:pb-24">
          {/* Headline (2 lines max, 9.5vw, red-forge-black) */}
          <h1 className="relative text-[clamp(2.5rem,9.5vw,11rem)] font-[900] leading-[0.86] tracking-[-0.05em] text-[#000] uppercase">
            <span className="block">You are</span>
            <span className="block -mx-6 md:-mx-10 bg-[#d0106f] px-6 pb-[0.08em] md:px-10 text-[#fff]">not alone.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[20px] md:text-[24px] leading-[1.35] text-[#000] font-medium tracking-[-0.02em]">
            The LMSA Career Center connects coursework with the doctor you want to become—through advising, specialty exploration, and a community that has walked these roads.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link to="/contact" className="rounded-none bg-[#000] text-[#fff] px-8 py-4 text-[15px] font-[900] tracking-[-0.02em] uppercase hover:bg-[#d0106f] transition">Start a conversation</Link>
            <Link to="#pathways" className="inline-flex items-center gap-2 text-[15px] font-[900] tracking-[-0.02em] uppercase text-[#000] underline underline-offset-4 decoration-2 hover:text-[#d0106f]">Explore pathways <ArrowRight size={18} /></Link>
          </div>
        </div>

        {/* Small image chip over text (design-taste direction) */}
        <img
          src={stockPhotos.hero.mentorship.src}
          alt={stockPhotos.hero.mentorship.alt}
          className="absolute right-[6vw] top-[16svh] z-20 hidden h-auto w-[22vw] rotate-[2deg] object-cover md:block"
          loading="eager"
        />
      </header>

      {/* ---------- INTRO: Edge-to-edge heavy paragraph (design-taste intro) ---------- */}
      <section className="relative bg-[#d0106f] text-[#fff] overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="max-w-[26ch] text-[clamp(1.75rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] uppercase text-[#fff]">
            Choosing a specialty is consequential.
          </h2>
          <p className="mt-8 max-w-[30ch] text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[#fff]">
            Few make it well in isolation—the center exists to change that.
          </p>
          <div className="mt-14 flex flex-wrap items-center gap-6 text-[15px] font-medium tracking-[-0.01em] text-[#fff]">
            <span>Advising since 2024</span>
            <span>•</span>
            <span>Alumni network across 12 countries</span>
            <span>•</span>
            <span>Free to every LMSA student</span>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES — Stacking colour sheets (gapless bento) ---------- */}
      <section className="relative bg-[#f7f7f5]" aria-label="What the center offers">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <div className="reveal-on-scroll">
            <h2 className="max-w-[26ch] text-[clamp(2rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] text-[#000] uppercase">Practical support for hard choices.</h2>
          </div>

          {/* Sticky stacking sheets — gapless grid, no empty cells */}
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4" role="list">
            {offerings.map(({ title, desc }, index) => (
              <article key={title} className="reveal-on-scroll" role="listitem" style={{ transitionDelay: `${index * 70}ms` }}>
                <h3 className="max-w-[14ch] text-[24px] md:text-[28px] font-[900] tracking-[-0.03em] leading-[1.05] text-[#000]">{title}</h3>
                <p className="mt-3 max-w-[34ch] text-[17px] leading-[1.65] text-[#333]">{desc}</p>
              </article>
            ))}
          </div>

          <figure className="reveal-on-scroll mt-20">
            <img
              src={stockPhotos.sections.lead.src}
              alt={stockPhotos.sections.lead.alt}
              className="max-h-[520px] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] text-[#333]">{stockPhotos.sections.lead.credit}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- SHOWCASE — Square plate / pathways as colour chapters ---------- */}
      <section id="pathways" className="relative" aria-label="Career pathways">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="reveal-on-scroll max-w-[26ch] text-[clamp(2rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] text-[#000] uppercase">Paths students are exploring now.</h2>
          <p className="reveal-on-scroll mt-6 max-w-xl text-[18px] md:text-[20px] leading-[1.5] text-[#333] font-medium tracking-[-0.01em]">Each path has someone behind it in the alumni network—physicians and trainees willing to talk about the road they walked.</p>

          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-2 lg:grid-cols-4" role="list">
            {pathways.map(({ title, desc, colour, ink }, index) => {
              const wide = index === 0 || index === pathways.length - 1;
              return (
                <a
                  key={title}
                  href="#contact"
                  className={`reveal-on-scroll group relative block pb-10 text-[#000] transition-transform duration-500 hover:-translate-y-1 md:min-h-[320px] md:overflow-hidden md:bg-[var(--path-colour)] md:p-12 md:text-[var(--path-ink)] ${wide ? 'md:col-span-2' : ''}`}
                  style={{ '--path-colour': colour, '--path-ink': ink }}
                  role="listitem"
                >
                  <span className="mb-4 block h-2 w-12 md:hidden" style={{ background: colour }} aria-hidden="true" />
                  <h3 className={`font-[900] tracking-[-0.03em] leading-[1.15] ${wide ? 'text-[26px] md:text-[28px]' : 'text-[22px] md:text-[24px]'}`}>{title}</h3>
                  <p className="mt-4 max-w-[38ch] text-[15px] md:text-[17px] leading-[1.55] opacity-90">{desc}</p>
                  <span className="mt-8 inline-block text-[13px] font-[900] tracking-[-0.02em] uppercase underline underline-offset-4 decoration-2">Learn more <ArrowRight size={14} className="inline-block ml-1" /></span>
                </a>
              );
            })}
          </div>

          <figure className="reveal-on-scroll mt-20">
            <img
              src={stockPhotos.stories.symposium.src}
              alt={stockPhotos.stories.symposium.alt}
              className="max-h-[460px] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] text-[#333]">{stockPhotos.stories.symposium.credit}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- HOW IT WORKS — Tiles that grow (gapless) ---------- */}
      <section className="bg-[#ebebe8]" aria-label="How advising works">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="reveal-on-scroll max-w-[26ch] text-[clamp(2rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] text-[#000] uppercase">How it works.</h2>
          <div className="mt-16 grid grid-flow-dense gap-4 sm:grid-cols-3">
            {[
              { n: '01', h: 'Reach out', b: 'One message to the career team opens advising, alumni connections, and current postings.' },
              { n: '02', h: 'Explore', b: ' structured exposure to specialties, paired with conversations from people who have made similar decisions.' },
              { n: '03', h: 'Decide', b: 'A plan that connects your coursework with the practice you want—whether at home, abroad, or both.' },
            ].map((s) => (
              <div key={s.n} className="reveal-on-scroll pb-8 transition-transform duration-500 hover:-translate-y-2 md:bg-[#fff] md:p-12">
                <h3 className="text-[24px] md:text-[28px] font-[900] tracking-[-0.03em] leading-[1.1] text-[#000]">{s.h}</h3>
                <p className="mt-4 text-[17px] leading-[1.65] text-[#333]">{s.b}</p>
              </div>
            ))}
          </div>

          <figure className="reveal-on-scroll mt-20">
            <img
              src={stockPhotos.sections.connect.src}
              alt={stockPhotos.sections.connect.alt}
              className="max-h-[460px] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] text-[#333]">{stockPhotos.sections.connect.credit}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- FAQ — Accordion of filled tiles (no meta labels, no 01/02) ---------- */}
      <section className="bg-[#f7f7f5]" aria-label="Questions students ask">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <h2 className="reveal-on-scroll max-w-[26ch] text-[clamp(2rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] text-[#000] uppercase">Questions students ask.</h2>
          <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
            <div className="reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
              <p className="text-[18px] leading-[1.6] text-[#333] font-medium tracking-[-0.01em]">If yours is not here, ask it directly—the career team answers every message.</p>
            </div>
            <div>
              {questions.map(({ q, a }, index) => (
                <details key={index} className="group reveal-on-scroll mb-3 md:bg-[#fff]" name="career-faq">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-0 py-5 text-left text-[17px] font-[900] leading-[1.25] tracking-[-0.02em] text-[#000] transition hover:bg-[#ebebe8] md:px-6 md:py-6 md:text-[20px]">
                    {q}
                    <span className="shrink-0 w-6 h-6 relative" aria-hidden="true"><span className="absolute top-1/2 left-0 w-full h-[3px] bg-[#d0106f] -translate-y-1/2" /><span className="absolute top-0 left-1/2 w-[3px] h-full bg-[#d0106f] -translate-x-1/2 group-open:rotate-90 transition-transform duration-300 origin-center" /></span>
                  </summary>
                  <div className="max-w-[62ch] px-0 pb-6 text-[17px] leading-[1.65] text-[#333] md:px-6">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA / ACTION (AIDA closure) ---------- */}
      <section id="contact" className="bg-[#000] text-[#fff]" aria-label="Next step">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-28 md:py-36">
          <div className="max-w-4xl">
            <h2 className="reveal-on-scroll max-w-[26ch] text-[clamp(2rem,6vw,7rem)] font-[900] leading-[0.92] tracking-[-0.05em] text-[#fff] uppercase">Ready when you are.</h2>
            <p className="reveal-on-scroll mt-6 text-[20px] md:text-[24px] leading-[1.35] text-[#fff]/90 font-medium tracking-[-0.02em]">One message to the career team opens advising, alumni connections, and the current stream of opportunities.</p>
            <div className="reveal-on-scroll mt-10 flex flex-wrap items-center gap-4">
              <Link to="/contact" className="rounded-none bg-[#fff] text-[#000] px-8 py-4 text-[15px] font-[900] tracking-[-0.02em] uppercase hover:bg-[#d0106f] hover:text-[#fff] transition">Talk to the career team</Link>
              <a href="mailto:careers@lmsa.org" className="inline-flex items-center gap-2 text-[15px] font-[900] tracking-[-0.02em] uppercase text-[#fff] underline underline-offset-4 decoration-2 hover:text-[#d0106f]">careers@lmsa.org <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER (statement close, not sitemap) ---------- */}
      <footer className="bg-[#ebebe8]" aria-label="Footer">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <Link to="/" className="text-[28px] font-[900] tracking-[-0.05em] text-[#000] leading-none">LMSA</Link>
              <p className="mt-4 max-w-sm text-[15px] leading-[1.65] text-[#333]">Liberia Medical Students’ Association — advancing medical education and connection across generations of physicians.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-[13px] font-medium tracking-[-0.01em] text-[#000]/70">
              <Link to="/contact" className="hover:text-[#d0106f]">Career team</Link>
              <Link to="/about" className="hover:text-[#d0106f]">About</Link>
              <a href="#" className="hover:text-[#d0106f]">Privacy</a>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8 text-[13px] text-[#000]/60">
            <span>© 2026 LMSA</span>
            <span>Photo credits: Unsplash — Mike McInnerney, Crew, You X Ventures, Online Marketing</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
