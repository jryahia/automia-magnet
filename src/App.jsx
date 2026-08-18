import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowUpRight, Check, Clock, Shield, BadgeCheck, Gauge, Zap, Code2, MousePointer2 } from 'lucide-react'

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    function loop(t) { lenis.raf(t * 1000); requestAnimationFrame(loop) }
    requestAnimationFrame(loop)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop()
    return () => lenis.destroy()
  }, [])
}
function useCustomCursor() {
  const dot = useRef(null); const blob = useRef(null)
  useEffect(() => {
    let mx = innerWidth / 2, my = innerHeight / 2, bx = mx, by = my, raf
    const mv = (e) => { mx = e.clientX; my = e.clientY }
    const grow = (n) => blob.current && (blob.current.className = 'cblob ' + (n ? 'grow' : ''))
    addEventListener('mousemove', mv)
    document.querySelectorAll('a,button,.plan,.service-card').forEach(el => { el.addEventListener('mouseenter', () => grow(true)); el.addEventListener('mouseleave', () => grow(false)) })
    function loop() { bx += (mx - bx) * .16; by += (my - by) * .16; if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`; if (blob.current) blob.current.style.transform = `translate(${bx}px,${by}px)`; raf = requestAnimationFrame(loop) }
    loop()
    return () => { removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])
  return { dot, blob }
}
const SplitWords = ({ text, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 60%'] })
  const words = text.split(' '); const ys = words.map((w, i) => useTransform(scrollYProgress, [i / words.length, (i + 1.2) / words.length], ['115%', '0%'], { clamp: true }))
  return <h2 ref={ref} className={className} style={{ margin: 0 }}>{words.map((w, i) => <span key={i} className="wm" style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '.1em' }} aria-hidden="true"><motion.span style={{ y: ys[i], display: 'inline-block' }}>{w}</motion.span>{'\u00A0'}</span>)}</h2>
}
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 65%'] })
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]); const o = useTransform(scrollYProgress, [0, .35], [0, 1])
  return <motion.div ref={ref} style={{ y, opacity: o }}>{children}</motion.div>
}
const Magnetic = ({ children, strength = .35 }) => {
  const ref = useRef(null)
  return <motion.div ref={ref} onMouseMove={(e) => { const el = ref.current, r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)` }} onMouseLeave={() => { ref.current.style.transform = 'translate(0,0)' }} style={{ transition: 'transform .4s cubic-bezier(.22,1,.36,1)', display: 'inline-block' }}>{children}</motion.div>
}

const Header = () => (
  <header className="site-header"><div className="header-inner"><a href="#" className="logo">Magnet<span>.</span></a>
    <nav><a href="#services">Services</a><a href="#results">Results</a><a href="#pricing">Pricing</a><a href="#process">Process</a><Magnetic><motion.a href="#contact" whileHover={{ scale: 1.05 }} className="btn-cta">Start a project</motion.a></Magnetic></nav></div></header>
)
const Hero = () => {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']); const o = useTransform(scrollYProgress, [0, .5], [1, 0])
  return (
    <section ref={ref} className="hero"><motion.div className="hero-inner" style={{ y, opacity: o }}>
      <p className="kicker"><MousePointer2 size={12} /> Interfaces you can feel — move your mouse</p>
      <h1>
        <motion.span className="hw" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .3 }}>Built to be</motion.span>{' '}
        <motion.span className="hw accent" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .42 }}>touched.</motion.span>
      </h1>
      <motion.p className="hero-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>Every button leans toward your cursor and springs back. Custom cursors, magnetic elements and micro-motion that make a website feel alive — and make people stay.</motion.p>
      <motion.div className="hero-ctas" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}>
        <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.06 }} className="btn-primary">Get a free quote <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.a></Magnetic>
        <Magnetic><motion.a href="#services" whileHover={{ scale: 1.06 }} className="btn-ghost">See what we build</motion.a></Magnetic>
      </motion.div>
    </motion.div></section>
  )
}
const Stack = () => {
  const stack = ['framer-motion', 'React', 'GSAP', 'lenis', 'TypeScript', 'Vite', 'Figma', 'Node.js']
  const metrics = [{ icon: <Gauge size={18} />, n: '60fps', l: 'Silky motion' }, { icon: <Zap size={18} />, n: '0.8s', l: 'Avg load' }, { icon: <Code2 size={18} />, n: '100', l: 'Core Web Vitals' }, { icon: <BadgeCheck size={18} />, n: 'AA', l: 'Accessible' }]
  return <section className="stackband"><div className="wrap"><Reveal><p className="stack-label">Interaction-first, performance-driven</p></Reveal><Reveal delay={.08}><div className="stack-row">{stack.map(s => <span key={s}>{s}</span>)}</div></Reveal><div className="tech-grid">{metrics.map((m, i) => <Reveal key={i} delay={i * .06}><div className="tech-metric">{m.icon}<div><b>{m.n}</b><span>{m.l}</span></div></div></Reveal>)}</div></div></section>
}
const RESULTS = [{ n: '+48%', l: 'Time-on-page', tag: 'delight keeps them exploring' }, { n: '+27%', l: 'Conversion lift', tag: 'interactive calls-to-action' }, { n: '60+', l: 'Interfaces shipped', tag: 'motion-first builds' }, { n: '-31%', l: 'Bounce rate', tag: 'there\'s something to touch' }]
const Results = () => <section className="results" id="results"><div className="wrap"><Reveal><SplitWords text="Feelable design converts." className="sec-title" /></Reveal><p className="sec-sub">Motion isn't decoration — it's engagement. The numbers prove it.</p><div className="results-grid">{RESULTS.map((r, i) => <Reveal key={i} delay={i * .08}><div className="result-card"><div className="result-n">{r.n}</div><div className="result-l">{r.l}</div><div className="result-tag">{r.tag}</div></div></Reveal>)}</div></div></section>
const SERVICES = [{ icon: '01', title: 'Custom cursor systems', desc: 'Trailing cursors, context growth and labeled hovers across the whole site.', price: 'from €900', time: '1 wk' }, { icon: '02', title: 'Magnetic interfaces', desc: 'Buttons, cards and CTAs that react to your cursor.', price: 'from €2,400', time: '2-3 wks' }, { icon: '03', title: 'Micro-interaction audits', desc: 'We find and fix the motion that\'s hurting engagement.' , price: 'from €1,200', time: '1-2 wks' }, { icon: '04', title: 'Full motion websites', desc: 'Complete React sites with deliberate motion throughout.', price: 'from €4,900', time: '3-5 wks' }]
const Services = () => <section className="services" id="services"><div className="wrap"><Reveal><SplitWords text="What we build." className="sec-title" /></Reveal><div className="svc-grid">{SERVICES.map((s, i) => <Reveal key={i} delay={i * .08}><motion.div className="service-card" whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}><div className="num">{s.icon}</div><h3>{s.title}</h3><p>{s.desc}</p><div className="svc-meta"><span className="price">{s.price}</span><span className="time"><Clock size={13} /> {s.time}</span></div><a href="#contact" className="svc-link">Start this →</a></motion.div></Reveal>)}</div></div></section>
const PLANS = [{ name: 'Cursor', price: '€900', for: 'Custom cursor kit', feats: ['Custom cursor + blob', 'Magnetic buttons', 'Hover states audit', '1 week delivery'] }, { name: 'Motion', price: '€4,900', for: 'Full motion site', feats: ['Custom cursor system', 'Magnetic UI, springs', 'Micro-interactions across', 'Performance + a11y', '30 days support'] }, { name: 'Signature', price: '€8,900', for: 'Award-level motion', feats: ['Everything in Motion', 'Bespoke interaction design', 'A/B ready', '90 days support'] }]
const Pricing = () => { const [sel, setSel] = useState(1); return <section className="pricing" id="pricing"><div className="wrap"><Reveal><SplitWords text="Pricing that's magnetic too." className="sec-title" /></Reveal><div className="plan-grid">{PLANS.map((p, i) => <Reveal key={i} delay={i * .08}><motion.div className={`plan ${i === sel ? 'plan-feat' : ''}`} whileHover={{ y: -6 }} onClick={() => setSel(i)}>{i === sel && <span className="plan-pop">Most chosen</span>}<h3>{p.name}</h3><div className="plan-price">{p.price}</div><div className="plan-for">{p.for}</div><ul>{p.feats.map((f, k) => <li key={k}><Check size={15} /> {f}</li>)}</ul><motion.a href="#contact" className="plan-btn" whileHover={{ scale: 1.04 }}>Choose {p.name}</motion.a></motion.div></Reveal>)}</div><Reveal><div className="guarantee"><Shield size={18} /> Every build ships with a <b>written delivery date</b> and <b>30-day support</b>.</div></Reveal></div></section> }
const PROCESS = [{ n: '01', t: 'Listen', d: 'Audit your current motion and goals.', icon: '<svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5a6.5 6.5 0 1113 0c0 6-6 6-6 10.5"/><path d="M15 8.5a2.5 2.5 0 00-5 0v1a2 2 0 004 0"/></svg>' }, { n: '02', t: 'Design', d: 'Interaction prototypes you feel, not just see.', icon: '<svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"/><line x1="12" y1="6" x2="12" y2="10"/></svg>️' }, { n: '03', t: 'Build', d: 'Spring physics, magnetic elements, 60fps dev.', icon: '<svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>️' }, { n: '04', t: 'Measure', d: 'Ship, test, and tune the motion that works.', icon: '<svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' }]
const Process = () => <section className="process" id="process"><div className="wrap"><Reveal><SplitWords text="A process you can feel." className="sec-title" /></Reveal><div className="proc-grid">{PROCESS.map((p, i) => <Reveal key={i} delay={i * .08}><motion.div className="proc-step" whileHover={{ y: -6 }}><div className="proc-num">{p.n}<span>{p.icon}</span></div><h4>{p.t}</h4><p>{p.d}</p></motion.div></Reveal>)}</div></div></section>
const QUOTES = [{ q: "Magnet made our site feel alive. Bounce dropped 31% — people stay to play with the buttons.", n: 'Mara V.', r: 'CMO, Northline' }, { q: "The custom cursor was the first thing everyone mentioned. It's the details.", n: 'Leo T.', r: 'Founder, Kite Digital' }, { q: "A rare UX team that ships fast, production motion.", n: 'Priya S.', r: 'Director, Halcyon' }]
const Testimonials = () => <section className="quotes"><div className="wrap"><Reveal><SplitWords text="Clients who felt the difference." className="sec-title" /></Reveal><div className="quotes-grid">{QUOTES.map((q, i) => <Reveal key={i} delay={i * .08}><figure className="quote"><div className="stars"><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg></div><blockquote>{q.q}</blockquote><figcaption><b>{q.n}</b><span>{q.r}</span></figcaption></figure></Reveal>)}</div></div></section>
const CTA = () => { const [sent, setSent] = useState(false); return <section className="cta" id="contact"><div className="wrap cta-inner"><Reveal><SplitWords text="Feel the pull?" className="sec-title" /></Reveal><p className="sec-sub">Tell us about your site — we'll return a motion plan and a fixed quote within one business day.</p>{!sent ? <motion.form className="cta-form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={(e) => { e.preventDefault(); setSent(true) }}><div className="form-row"><input required placeholder="Your name" aria-label="Your name" /><input required type="email" placeholder="Work email" aria-label="Work email" /></div><textarea rows="3" placeholder="Tell us about your site & the motion you want" aria-label="Project details" /><Magnetic><motion.button whileHover={{ scale: 1.05 }} className="btn-primary" type="submit" style={{ border: 'none', cursor: 'pointer' }}>Send project brief <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.button></Magnetic><p className="form-note"><Shield size={13} /> Free quote · no obligation · reply within 1 business day</p></motion.form> : <motion.div className="cta-done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><BadgeCheck size={44} /><h3>Brief received <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></h3><p>We'll reply within one business day.</p></motion.div>}<div className="cta-contact"><span>Prefer email?</span> <a href="mailto:hello@magnet.design">hello@magnet.design</a></div></div></section> }
const Footer = () => <footer className="site-footer"><div className="wrap foot-inner"><span>© 2026 Magnet — tactile & magnetic design.</span><span><a href="#services">Services</a> · <a href="#pricing">Pricing</a> · <a href="mailto:hello@magnet.design">hello@magnet.design</a></span></div></footer>

export default function App() {
  useSmoothScroll()
  const { dot, blob } = useCustomCursor()
  return (<>
    <div ref={dot} className="cdot" /><div ref={blob} className="cblob" />
    <Header /><Hero /><Stack /><Results /><Services /><Pricing /><Process /><Testimonials /><CTA /><Footer />
  </>)
}
