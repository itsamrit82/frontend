import React from 'react';
import '../styles/AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About The Aellè</h1>
          <p className="hero-subtitle">Where uniqueness is stitched into every thread</p>
        </div>
        <div className="hero-image">
          <img src="https://i.pinimg.com/736x/95/7d/6b/957d6be6c3167a870d4379be2968be6c.jpg" alt="Fashion Design" />
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Story</h2>
            <p className="story-intro">
              There was a time when we walked store after store, browsed brand after brand — searching not just for fashion, but for something <em>different</em>.
            </p>
            
            <div className="story-highlight">
              <p>And that's where it began.</p>
            </div>

            <p>
              The Aellè was born from <strong>frustration and fire</strong> — the kind that builds when you know women deserve more than what's offered. We knew there was a gap — <em>a missing voice</em> in Indian fashion that celebrates <strong>uniqueness</strong> with grace.
            </p>

            <p>
              So, we took a bold step. With zero experience in fashion but hearts full of purpose, we started crafting designs that <strong>felt like statements</strong> — not just outfits.
            </p>
          </div>
          
          <div className="story-image">
            <img src="https://i.pinimg.com/736x/b7/b0/49/b7b0493fde26fcd69409d4f90f9190f9.jpg" alt="Our Journey" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">✨</div>
              <h3>Uniqueness</h3>
              <p>Every piece tells a story of individuality and quiet power</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🎨</div>
              <h3>Craftsmanship</h3>
              <p>Obsession, detail, and soul poured into every design</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💫</div>
              <h3>Empowerment</h3>
              <p>Your dress can be your voice — elegant, powerful, unapologetically you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-content">
          <div className="values-text">
            <h2>What We Believe</h2>
            <p>
              The Aellè is not just a clothing label — it is a movement. A space where <strong>modern western silhouettes meet soft Indian femininity</strong>.
            </p>
            <p>
              We started this journey for every woman who, like us, looked everywhere and didn't find <em>herself</em>. Now, she doesn't have to look anymore.
            </p>
            <div className="values-quote">
              <blockquote>
                  "Not everyone wants glitter. Not everyone wants drama. But every woman wants to feel like she's wearing something made just for her."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Welcome to The Aellè</h2>
          <p>Where uniqueness is stitched into every thread</p>
          <a href="/shop" className="cta-button">
            Explore Our Collection
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;