import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style.css';

export default function Home() {
  return (
    <section className="hero-wrapper">
      <Header />

      {/* STABILIZED 3D TEXT-SANDWICH CONTAINER */}
      <main className="canvas-container">
        <h1 className="front">Pindawala Putt</h1>

        <img
          src="/Resource/Thumbnail/Memories bg removed.png"
          alt="Pindawala Putt"
          className="subject-cutout"
        />

        <h1 className="back">Pindawala Putt</h1>
      </main>

      <Footer />
    </section>
  );
}
