import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z" />
      </svg>
    ),
    title: "Pets first",
    body: "Every feature we build starts with one question — is this better for the animal? Responsible adoption is non-negotiable.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Transparency",
    body: "Vaccination records, seller ratings, and real negotiation history — buyers see everything before they commit.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community",
    body: "We're building a network of responsible breeders, rescue shelters, and caring adopters all across India.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Safety",
    body: "Verified listings, secure messaging, and fraud-free negotiation protect both sides of every adoption.",
  },
];

const TEAM = [
  { name: "Surya Kumar", role: "Founder & CEO", initials: "SK" },
  { name: "Priya Nair", role: "Head of Product", initials: "PN" },
  { name: "Arjun Mehta", role: "Lead Engineer", initials: "AM" },
  { name: "Divya Rao", role: "Community Manager", initials: "DR" },
];

export default function About() {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container about-hero-inner">
          <p className="about-eyebrow">Our story</p>
          <h1>Built by pet lovers,<br />for pet lovers.</h1>
          <p className="about-lead">
            Paws Next Door started with a simple frustration — finding a healthy,
            responsibly-bred pet in India was harder than it should be. We built
            the platform we wished existed.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="container about-section">
        <div className="about-mission-card">
          <div className="about-mission-label">Our mission</div>
          <p className="about-mission-text">
            To make pet adoption in India transparent, safe, and joyful — connecting
            every animal with the right home through technology and trust.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="container about-section">
        <h2 className="about-section-title">What we stand for</h2>
        <div className="about-values-grid">
          {VALUES.map((v) => (
            <div key={v.title} className="about-value-card">
              <div className="about-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="container about-section">
        <h2 className="about-section-title">The team</h2>
        <div className="about-team-grid">
          {TEAM.map((m) => (
            <div key={m.name} className="about-team-card">
              <div className="about-avatar">{m.initials}</div>
              <div className="about-member-name">{m.name}</div>
              <div className="about-member-role">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container about-cta">
        <h2>Ready to find your companion?</h2>
        <p>Browse hundreds of verified pets listed by trusted sellers near you.</p>
        <div className="about-cta-actions">
          <Link to="/browse" className="btn btn-primary">Browse pets</Link>
          <Link to="/contact" className="btn btn-ghost">Get in touch</Link>
        </div>
      </section>

    </div>
  );
}
