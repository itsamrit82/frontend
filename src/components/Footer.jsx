import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-column brand">
          <h3 className="footer-brand-name">The Aellè</h3>
          <p>
            The Aellè blends western edge with Indian softness — for the woman
            who owns her elegance unapologetically.
          </p>
        </div>

        <div className="footer-column links">
          <h4>Company</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column contact">
          <h4>Get in Touch</h4>
          <p>
            <span>📞</span>
            <a href="tel:+917015450568">+91 70154 50568</a>
          </p>
          <p>
            <span>📧</span>
            <a href="mailto:theaelle.shop@gmail.com">theaelle.shop@gmail.com</a>
          </p>
          <p>
            <span>📸</span>
            <a href="https://instagram.com/theaelleofficial" target="_blank" rel="noopener noreferrer">
              @theaelleofficial
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 <strong className="footer-brand-name2">The Aellè</strong> — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;