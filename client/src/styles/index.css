import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PersonIcon } from '../components/Icons';
import useForm from '../hooks/useForm';
import api from '../api';

export default function HomePage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    api.getTeam().then(setTeamMembers).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <TeamSection members={teamMembers} />
      <PartnershipsSection />
      <VolunteersSection />
      <ContactSection />
      <Footer />
    </>
  );
}

/* ── HERO ── */
function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <div className="hero-eyebrow">Education · Technology · Empowerment</div>
        <h1 className="hero-title">
          Empowering<br />
          <em>girls &amp; women</em>
          to learn &amp; grow
        </h1>
        <p className="hero-desc">
          HerAccess empowers girls and women in restricted regions through education
          and technology. We provide AI-driven tools, online courses, and mentorship
          programs to give every girl the opportunity to learn and grow.
        </p>
        <a href="#team" className="hero-cta">
          Discover our mission <span className="hero-cta-arrow">→</span>
        </a>
      </div>
      <div className="hero-right">
        <div className="hero-stat-grid">
          <div className="hero-stat"><div className="hero-stat-num">AI</div><div className="hero-stat-label">Driven learning<br />tools</div></div>
          <div className="hero-stat"><div className="hero-stat-num">∞</div><div className="hero-stat-label">Online courses<br />&amp; resources</div></div>
          <div className="hero-stat"><div className="hero-stat-num">1:1</div><div className="hero-stat-label">Mentorship<br />programs</div></div>
          <div className="hero-stat"><div className="hero-stat-num">🌍</div><div className="hero-stat-label">Restricted<br />regions focus</div></div>
        </div>
      </div>
    </section>
  );
}

/* ── TEAM ── */
function TeamSection({ members }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [wrapClass, setWrapClass] = useState('');

  const placeholders = [
    { member_name: 'Volunteer Name', member_role: 'Founder · Educator' },
    { member_name: 'Volunteer Name', member_role: 'AI Developer' },
    { member_name: 'Volunteer Name', member_role: 'SMM Manager' },
    { member_name: 'Volunteer Name', member_role: 'Project Manager' },
  ];

  const list = members.length > 0 ? members : placeholders;

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;

    setCanScrollLeft(left);
    setCanScrollRight(right);

    // Update fade classes
    if (!left && !right) setWrapClass('scrolled-start scrolled-end');
    else if (!left) setWrapClass('scrolled-start');
    else if (!right) setWrapClass('scrolled-end');
    else setWrapClass('scrolled-mid');
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();

    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);

    // Re-check after images load
    const observer = new MutationObserver(updateArrows);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
      observer.disconnect();
    };
  }, [updateArrows, list.length]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    // Get actual card width from first child
    const firstCard = el.querySelector('.team-card');
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(el).gap) || 28;
    const cardWidth = firstCard.offsetWidth + gap;
    const visible = Math.floor(el.clientWidth / cardWidth);
    // Scroll by ~2 cards, or at least 1, but not more than visible count
    const scrollCards = Math.max(1, Math.min(visible, Math.floor(visible * 0.6) + 1));
    const scrollAmount = scrollCards * cardWidth;

    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="team">
      <div className="team-header">
        <div className="section-tag">Our People</div>
        <h2 className="section-title">Meet the <em>team</em></h2>
        <p className="section-body">
          Our team is a passionate group of young leaders, educators, and creators
          committed to empowering girls through education and technology.
        </p>
      </div>

      <div className={`team-scroll-wrap ${wrapClass}`}>
        {canScrollLeft && (
          <button
            className="team-arrow team-arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div className="team-grid" ref={scrollRef}>
          {list.map((m, i) => (
            <div className="team-card" key={m.id || i}>
              <div className="team-card-photo">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.member_name} loading="lazy" />
                ) : (
                  <div className="team-photo-placeholder"><PersonIcon /></div>
                )}
              </div>
              <div className="team-card-info">
                <div className="team-card-name">{m.member_name}</div>
                <div className="team-card-role">{m.member_role}</div>
                {m.member_bio && <div className="team-card-bio">{m.member_bio}</div>}
                {!m.member_bio && !m.id && (
                  <div className="team-card-bio">Short bio about this team member's role and passion for the mission.</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            className="team-arrow team-arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}

/* ── PARTNERSHIPS ── */
function PartnershipsSection() {
  const form = useForm({ full_name: '', email: '', organization: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.setSubmitting(true);
    form.setError('');
    form.setSuccess('');
    try {
      const res = await api.submitPartnership(form.values);
      if (res.error) throw new Error(res.error);
      form.setSuccess('Partnership request submitted successfully!');
      form.reset();
    } catch (err) {
      form.setError(err.message || 'Something went wrong.');
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <section id="partnerships">
      <div className="section-tag">Collaborate</div>
      <h2 className="section-title">Partner<br /><em>with us</em></h2>
      <div className="partnerships-layout">
        <div className="partnerships-text">
          <p className="section-body" style={{ color: 'rgba(244,209,255,0.7)' }}>
            If you're interested in partnering with us, please contact us through the form.
            Together we can expand access to education for girls and women across restricted regions.
          </p>
          <div className="partner-highlight">
            {[
              { icon: '🤝', title: 'NGOs & Nonprofits', desc: 'Joint programs and outreach collaborations.' },
              { icon: '🏛️', title: 'Institutions', desc: 'Academic and research partnerships.' },
              { icon: '💼', title: 'Sponsors', desc: 'Fund scholarships and tech access.' },
              { icon: '🚀', title: 'Tech Partners', desc: 'Build AI tools and platforms together.' },
            ].map(h => (
              <div className="p-highlight-item" key={h.title}>
                <div className="p-highlight-icon">{h.icon}</div>
                <div className="p-highlight-title">{h.title}</div>
                <div className="p-highlight-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="partnership-form" onSubmit={handleSubmit}>
          {form.success && <div className="form-banner form-banner--success">{form.success}</div>}
          {form.error && <div className="form-banner form-banner--error">{form.error}</div>}
          <div className="p-field">
            <label>Full Name</label>
            <input name="full_name" type="text" placeholder="Your name" value={form.values.full_name} onChange={form.handleChange} required />
          </div>
          <div className="p-field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.values.email} onChange={form.handleChange} required />
          </div>
          <div className="p-field">
            <label>Organization</label>
            <input name="organization" type="text" placeholder="Organization name" value={form.values.organization} onChange={form.handleChange} required />
          </div>
          <div className="p-field">
            <label>Message</label>
            <textarea name="message" rows="5" placeholder="Tell us about your partnership idea..." value={form.values.message} onChange={form.handleChange} />
          </div>
          <button className="btn-submit" type="submit" disabled={form.submitting}>
            {form.submitting ? 'Sending...' : 'Send Partnership Request'}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ── VOLUNTEERS ── */
function VolunteersSection() {
  const form = useForm({ full_name: '', email: '', role: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.setSubmitting(true);
    form.setError('');
    form.setSuccess('');
    try {
      const res = await api.submitVolunteer(form.values);
      if (res.error) throw new Error(res.error);
      form.setSuccess('Volunteer application submitted successfully!');
      form.reset();
    } catch (err) {
      form.setError(err.message || 'Something went wrong.');
    } finally {
      form.setSubmitting(false);
    }
  };

  const roles = [
    { num: '01', name: 'Teachers' },
    { num: '02', name: 'SMM Managers' },
    { num: '03', name: 'Event Managers' },
    { num: '04', name: 'Technical Leaders / Developers' },
  ];

  return (
    <section id="volunteers">
      <div className="volunteers-layout">
        <div>
          <div className="section-tag">Get Involved</div>
          <h2 className="section-title">Join our <em>team</em></h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-mid)', fontWeight: 300, maxWidth: 400 }}>
            Be part of a project that changes lives and gives girls the chance to grow and succeed.
          </p>
          <div className="role-list">
            {roles.map(r => (
              <div className="role-item" key={r.num}>
                <span className="role-number">{r.num}</span>
                <span className="role-name">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="volunteers-cta" style={{ paddingTop: 80 }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 300,
            color: 'var(--deep-purple)', lineHeight: 1.1, marginBottom: 24
          }}>
            Make a real<br /><em style={{ fontStyle: 'italic', color: 'var(--text-mid)' }}>difference</em>
          </h3>
          <p>
            We're actively looking for passionate volunteers to help us expand HerAccess
            across Central Asia and beyond. No matter your skill set — if you care about
            equal education, there's a place for you here.
          </p>
          <form className="volunteer-form" onSubmit={handleSubmit}>
            {form.success && <div className="form-banner form-banner--success">{form.success}</div>}
            {form.error && <div className="form-banner form-banner--error">{form.error}</div>}
            <div className="v-field">
              <label>Full Name</label>
              <input name="full_name" type="text" placeholder="Your full name" value={form.values.full_name} onChange={form.handleChange} required />
            </div>
            <div className="v-field">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="your@email.com" value={form.values.email} onChange={form.handleChange} required />
            </div>
            <div className="v-field">
              <label>Role you're applying for</label>
              <select name="role" value={form.values.role} onChange={form.handleChange} required>
                <option value="">Select a role…</option>
                <option value="Teacher">Teacher</option>
                <option value="SMM Manager">SMM Manager</option>
                <option value="Event Manager">Event Manager</option>
                <option value="Technical Leader / Developer">Technical Leader / Developer</option>
              </select>
            </div>
            <div className="v-field">
              <label>Why do you want to join? <span style={{ opacity: 0.5, fontStyle: 'italic' }}>(optional)</span></label>
              <textarea name="message" rows="4" placeholder="Tell us a bit about yourself…" value={form.values.message} onChange={form.handleChange} />
            </div>
            <button className="btn-join" type="submit" disabled={form.submitting}>
              {form.submitting ? 'Sending...' : 'Apply as Volunteer'} <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function ContactSection() {
  const form = useForm({ full_name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.setSubmitting(true);
    form.setError('');
    form.setSuccess('');
    try {
      const res = await api.submitContact(form.values);
      if (res.error) throw new Error(res.error);
      form.setSuccess('Contact message sent successfully!');
      form.reset();
    } catch (err) {
      form.setError(err.message || 'Something went wrong.');
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <section id="contact">
      <div className="section-tag">Reach Out</div>
      <h2 className="section-title">Contact <em>us</em></h2>
      <p className="section-body">Have a question or want to join our mission? Fill out the form below and we'll get back to you as soon as possible.</p>
      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          {form.success && <div className="form-banner form-banner--success">{form.success}</div>}
          {form.error && <div className="form-banner form-banner--error">{form.error}</div>}
          <div className="c-field">
            <label>Full Name</label>
            <input name="full_name" type="text" placeholder="Your full name" value={form.values.full_name} onChange={form.handleChange} required />
          </div>
          <div className="c-field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.values.email} onChange={form.handleChange} required />
          </div>
          <div className="c-field">
            <label>Subject</label>
            <input name="subject" type="text" placeholder="What's this about?" value={form.values.subject} onChange={form.handleChange} required />
          </div>
          <div className="c-field">
            <label>Your Message</label>
            <textarea name="message" rows="6" placeholder="Write your message here..." value={form.values.message} onChange={form.handleChange} required />
          </div>
          <button className="btn-send" type="submit" disabled={form.submitting}>
            {form.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        <div className="contact-info">
          <div className="contact-info-title">Contact Information</div>
          <div className="contact-info-item">
            <div className="contact-info-icon">📧</div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">
                <a href="mailto:heraccess6@gmail.com">heraccess6@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-info-icon">📞</div>
            <div>
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">+7 (7xx) xxx-xx-xx</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
