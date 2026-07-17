import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style 3.css';

export default function Contact() {
  return (
    <div className="contact-page-wrapper">
      <Header />

      <main className="main-layout">
        <div className="left-column">
          <section className="contact-form">
            <h2>Send Us a Message</h2>

            <form action="https://api.web3forms.com/submit" method="POST">
              <input 
                type="hidden" 
                name="access_key" 
                value={localStorage.getItem('web3FormsKey') || "b4263795-34f5-4b04-8878-fdcd197270c0"} 
              />
              <input type="hidden" name="from_name" value="Pindawala Putt Website" />

              <label htmlFor="name">Full Name:</label>
              <input type="text" id="name" name="Sender Name" required />

              <label htmlFor="email">Email Address:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="subject">Subject / Purpose:</label>
              <select id="subject" name="subject" required defaultValue="">
                <option value="" disabled>-- Select an option --</option>
                <option value="Music Collaboration">Music Collaboration</option>
                <option value="Business & Booking">Business & Booking</option>
                <option value="Song Request">Song Request</option>
                <option value="Press & Media">Press & Media</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="message">Message:</label>
              <textarea id="message" name="Message Content" rows="5" required></textarea>

              <input type="hidden" name="redirect" value="https://yourwebsite.com/Contact us.html" />

              <button type="submit">Send Message</button>
            </form>
          </section>
        </div>

        <div className="right-column">
          <div className="video-container">
            <video autoPlay loop muted playsInline className="aesthetic-video">
              <source 
                src="https://bofdvterflbvozuxkfws.supabase.co/storage/v1/object/public/portfolio-media/Contact-Us-Video/Contact-Us-Video.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </main>

      <Footer tickerText="Message proposal portal active • Proposals submitted route directly to Pindawala Putt..." />
    </div>
  );
}
