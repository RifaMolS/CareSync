import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footerpage from './Footerpage';

export default function About() {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('section');
      elements.forEach((element) => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          element.style.opacity = "1";
        }
      });
    };

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transition = "opacity 1s ease-out";
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div >
      {/* <header
        style={{
          backgroundColor: "#1e88e5",
          color: "white",
          padding: "20px 0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            CareSync
          </div>
          <nav style={{ display: "flex", gap: "20px" }}>
            <a
              href="#"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px",
                transition: "all 0.3s ease",
              }}
            >
              Home
            </a>
            <a
              href="#"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "5px",
                transition: "all 0.3s ease",
              }}
            >
              About
            </a>
            <a
              href="#"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px",
                transition: "all 0.3s ease",
              }}
            >
              Services
            </a>
            <a
              href="#"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px",
                transition: "all 0.3s ease",
              }}
            >
              Contact
            </a>
          </nav>
        </div>
      </header> */}
      <Navbar />
      <section
        style={{
          background: "linear-gradient(135deg, #4fc3f7 0%, #1e88e5 100%)",
          padding: "150px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div data-aos="fade-up" data-aos-delay="100">
          <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
            About Our-Care-Center
          </h1>
          <p
            style={{
              fontSize: "18px",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Providing exceptional care for both children and adults since 2005,
            with a commitment to safety, development, and compassion.
          </p>
        </div>
      </section>

      <section
        style={{
          padding: "60px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div data-aos="fade-up" data-aos-delay="200" style={{ flex: "1", minWidth: "300px" }}>
          <img
            src="assets/img/gallery/about.png"
            alt="Caring staff with clients"
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2
            style={{
              color: "#1e88e5",
              fontSize: "32px",
              marginBottom: "20px",
            }}
          >
            Our Mission
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            At CareSync, our mission is to create a nurturing environment
            where both children and adults can thrive. We believe in providing
            personalized care that respects the dignity and uniqueness of each
            individual.
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
            Our team of dedicated professionals works tirelessly to ensure the
            highest standards of care, focusing on physical health, emotional
            well-being, and social development.
          </p>
        </div>
      </section>

      <section
        style={{
          padding: "60px 0",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1e88e5",
            fontSize: "32px",
            marginBottom: "40px",
          }}
        >
          Our Core Values
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          <div data-aos="fade-up" data-aos-delay="300"
            style={{
              backgroundColor: "#f0f8ff",
              borderRadius: "10px",
              padding: "30px",
              flex: "1",
              minWidth: "250px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "#1e88e5", marginBottom: "15px" }}>
              Compassion
            </h3>
            <p>
              We approach every individual with kindness, empathy, and respect,
              creating a supportive atmosphere for all.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="400"
            style={{
              backgroundColor: "#f0f8ff",
              borderRadius: "10px",
              padding: "30px",
              flex: "1",
              minWidth: "250px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "#1e88e5", marginBottom: "15px" }}>
              Excellence
            </h3>
            <p>
              We strive for the highest standards in caregiving, constantly
              improving our methods and approaches.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="500"
            style={{
              backgroundColor: "#f0f8ff",
              borderRadius: "10px",
              padding: "30px",
              flex: "1",
              minWidth: "250px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "#1e88e5", marginBottom: "15px" }}>
              Integrity
            </h3>
            <p>
              We operate with transparency and honesty, building trust with
              families and clients through reliable service.
            </p>
          </div>
        </div>
      </section>
      <Footerpage />
    </div>

  );
}