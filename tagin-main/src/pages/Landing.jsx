import React from 'react'
import { Link } from 'react-router-dom'
import RotatingTextWithBorder from '../components/RotatingTextWithBorder'

export default function Landing() {
  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64 }}>
          <div className="logo">
            TAG<span style={{ color: 'var(--accent)' }}>.</span>IN
          </div>
          <div className="spacer" />
          <Link to="/login" className="btn">Login</Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="pill">TAG-IN NFC Anti-Counterfeit</div>
          
          <h1 className=''>
            Authenticate any{' '}
            <RotatingTextWithBorder
              texts={["Sneakers", "Handbag", "Watch"]}
              rotationInterval={2500}
            />{' '}
            with just a Tap.
          </h1>
          <p>
            Embed an NFC chip, link it to tamper-proof blockchain records, and give buyers instant trust from their phone—no app required.
          </p>
          
          <div className="actions">
            <Link to="/login" className="btn">Get Started</Link>
            <a href="#how" className="btn btn-outline">How it works</a>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* How It Works Section */}
      <section id="how" style={{ padding: '40px 0' }}>
        <div className="container grid grid-3">
          {[
            { title: 'Tiny NFC in every genuine unit', desc: 'Embed a tiny RFID/NFC chip at manufacturing so each item gets a unique hardware identity.' },
            { title: 'Secured on blockchain', desc: 'Bind that chip`s UID to an immutable on-chain record—creating an unchangeable digital ID.' },
            { title: 'Tap to verify', desc: 'Consumers simply tap with an NFC-enabled phone—no app needed—to get instant, on-chain proof.' },
            { title: 'Component-level checks', desc: 'Support part-by-part verification: verify internal components inside complex devices.' },
            { title: 'NFT ownership', desc: 'Each product can carry an NFT certificate enabling verified resale and transfers.' },
            { title: 'Revoke fakes in real time', desc: 'Manufacturers can revoke a counterfeit tag immediately and warn future buyers.' },
          ].map((b, i) => (
            <div key={i} className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{b.title}</div>
              <div className="muted">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
