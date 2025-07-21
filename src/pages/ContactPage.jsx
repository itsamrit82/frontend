import React from 'react';
import '../styles/ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          
          <div className="contact-item">
            <div className="contact-icon">👤</div>
            <div className="contact-details">
              <h3>Kiran Dhiman</h3>
              <p>Founder & Designer</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📱</div>
            <div className="contact-details">
              <h3>WhatsApp</h3>
              <a href="https://wa.me/+918284964245" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                +91 8284964245
              </a>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-details">
              <h3>Email</h3>
              <a href="mailto:theaelle.shop@gmail.com" className="email-link">
                theaelle.shop@gmail.com
              </a>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📸</div>
            <div className="contact-details">
              <h3>Instagram</h3>
              <a href="https://instagram.com/theaelleofficial" target="_blank" rel="noopener noreferrer" className="instagram-link">
                @theaelleofficial
              </a>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div className="contact-details">
              <h3>Address</h3>
              <p>CHANDIGARH, INDIA</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
