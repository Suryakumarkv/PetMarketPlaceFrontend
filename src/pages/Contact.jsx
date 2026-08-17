import React, { useState } from "react";
import "./Contact.css";

const FAQS = [
  {
    q: "How do I list my pet for adoption?",
    a: "Register as a Seller, go to your Seller Dashboard, and click 'Add listing'. Fill in photos, breed, age, price, and location.",
  },
  {
    q: "Is Paws Next Door free to use?",
    a: "Yes — browsing and listing pets is completely free. We never charge buyers or sellers a commission.",
  },
  {
    q: "How are sellers verified?",
    a: "Sellers are rated by buyers after each adoption. Profiles with verified vaccination records and positive reviews are highlighted.",
  },
  {
    q: "What if I have a dispute with a seller?",
    a: "Contact us at support@pawsnextdoor.in with your order details and we'll help mediate within 48 hours.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    // In production this would POST to an API; for now we simulate success
    setSent(true);
  }

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <div className="contact-page container">

      {/* ── Header ── */}
      <div className="contact-hero">
        <p className="contact-eyebrow">Contact us</p>
        <h1>We'd love to hear from you.</h1>
        <p className="contact-lead">
          Questions, feedback, or partnership enquiries — drop us a message and
          we'll get back to you within one business day.
        </p>
      </div>

      <div className="contact-body">

        {/* ── Form ── */}
        <div className="contact-form-col">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Message sent!</h3>
              <p>Thanks for reaching out. We'll reply to <strong>{form.email}</strong> soon.</p>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: "var(--space-4)" }} onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                Send another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Your name</label>
                  <input required placeholder="Arjun Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input type="email" required placeholder="arjun@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Subject</label>
                <input required placeholder="e.g. Listing issue, partnership…" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea required rows={5} placeholder="Tell us what's on your mind…" value={form.message} onChange={(e) => set("message", e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit">Send message</button>
            </form>
          )}
        </div>

        {/* ── Info sidebar ── */}
        <aside className="contact-info-col">
          <div className="contact-info-card">
            <h3>Get in touch</h3>
            <ul className="contact-info-list">
              <li>
                <span className="contact-info-icon">✉</span>
                <div>
                  <div className="contact-info-label">Email</div>
                  <a href="mailto:support@pawsnextdoor.in">support@pawsnextdoor.in</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon">📞</span>
                <div>
                  <div className="contact-info-label">Phone</div>
                  <a href="tel:+918000000000">+91 80000 00000</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon">📍</span>
                <div>
                  <div className="contact-info-label">Office</div>
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </li>
              <li>
                <span className="contact-info-icon">🕘</span>
                <div>
                  <div className="contact-info-label">Hours</div>
                  <span>Mon – Fri, 9 am – 6 pm IST</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── FAQ ── */}
      <section className="contact-faq">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <svg className="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
