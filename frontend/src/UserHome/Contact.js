import React from 'react';
import Navbar from './Navbar';
import Footerpage from './Footerpage';

export default function Contact() {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          backgroundImage: "url('https://via.placeholder.com/1920x1080')", // Replace with your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          
        }}
      >
        <div
          style={{
            textAlign: "center",
            // backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backgroundImage:"linear-gradient(to right, #595cff, #c6f8ff)",
            padding: "50px",
            borderRadius: "10px",
            width:"100%",
           
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              color: "white",
              marginBottom: "20px",
              animation: "slideInDown 0.8s ease-out",
            }}
          >
            Contact Us
          </h1>
          <nav aria-label="breadcrumb">
            <ol
              style={{
                display: "flex",
                justifyContent: "center",
                listStyle: "none",
                padding: "0",
                margin: "0",
                color: "white",
              }}
            >
              <li style={{ marginRight: "10px" }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Home
                </a>
              </li>
              <li style={{ marginRight: "10px" }}>/</li>
              <li style={{ marginRight: "10px" }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Pages
                </a>
              </li>
              <li style={{ color: "#007bff" }}>Contact</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container-xxl py-6">
        <div className="container">
          <div className="row g-5">
            <div
              className="col-lg-6 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ minHeight: "450px" }}
            >
              <div className="position-relative h-100">
                <iframe
                  className="position-relative w-100 h-100"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1569803.051134759!2d75.784912!3d10.850516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85c1f1f1f1f1f%3A0x123456789abcdef!2sKerala%2C%20India!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                  frameBorder="0"
                  style={{ minHeight: "450px", border: "0" }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <h6 className="text-primary text-uppercase mb-2">Contact Us</h6>
              <h1 className="display-6 mb-4">
                If You Have Any Query, Please Contact Us
              </h1>
              <p className="mb-4 text-justify">
              If you have any questions about our child care services or would like more information about enrollment, programs, or pricing, please feel free to reach out using the contact form below. Whether you're looking for personalized care for your child, have suggestions, or simply want to learn more about what we offer, we're here to assist you. We value your privacy and aim to respond to all inquiries within 24 hours.
              </p>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        id="name"
                        placeholder="Your Name"
                      />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control border-0 bg-light"
                        id="email"
                        placeholder="Your Email"
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        id="subject"
                        placeholder="Subject"
                      />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control border-0 bg-light"
                        placeholder="Leave a message here"
                        id="message"
                        style={{ height: "150px" }}
                      ></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary py-3 px-5" type="submit">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div><br/>
      <Footerpage />
    </>
  );
}