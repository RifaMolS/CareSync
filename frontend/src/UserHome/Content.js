import React from 'react'
import Navbar from './Navbar'
import Footerpage from './Footerpage'
import { Link } from 'react-router-dom'

export default function Content() {
    return (
        <>
            <Navbar />
            <main className="main">


                <section id="hero-slider" style={{ paddingTop: '80px', margin: 0, width: '100vw', position: 'relative', overflow: 'hidden' }}>
                    <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner" style={{ width: '100%' }}>
                            <div className="carousel-item active" style={{ backgroundColor: '#0b1c3c', width: '100%' }}>
                                <div style={{
                                    height: '85vh',
                                    width: '100%',
                                    position: 'relative',
                                    backgroundImage: 'url("/assets/img/pediatric-hero.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center 40%',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundColor: '#0b1c3c'   // keeps background clean
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(rgba(11, 28, 60, 0.4), rgba(11, 28, 60, 0.6))', zIndex: 1
                                    }}></div>

                                    <div className="carousel-caption d-none d-md-block text-start" style={{
                                        zIndex: 2, top: '50%', transform: 'translateY(-50%)', bottom: 'auto', left: '10%', right: '10%', textAlign: 'left'
                                    }}>
                                        <h1 className="display-4 fw-bold animated fadeInDown" style={{ fontFamily: '"Outfit", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#fff' }}>
                                            Compassionate Care for <span style={{ color: '#0dcaf0' }}>Your Children</span>
                                        </h1>
                                        <p className="lead fs-4 animated fadeInUp" style={{ maxWidth: '800px', margin: '20px 0', color: '#f8f9fa', fontWeight: '300' }}>
                                            "The way we care for our child is a reflection of the way we care for our future."
                                        </p>
                                        <div className="animated fadeInUp">
                                            <Link to="/parentregister" className="btn btn-primary btn-lg rounded-pill px-5 py-3 me-3" style={{ backgroundColor: '#0dcaf0', borderColor: '#0dcaf0', color: '#fff', fontWeight: '600' }}>Get Started</Link>
                                            <Link to="/about" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3" style={{ fontWeight: '600' }}>Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item" style={{ backgroundColor: '#0b1c3c', width: '100%' }}>
                                <div style={{
                                    height: '85vh',
                                    width: '100%',
                                    position: 'relative',
                                    backgroundImage: 'url("/assets/img/family-hero.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center 25%',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundColor: '#0b1c3c'   // keeps background clean
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(rgba(11, 28, 60, 0.4), rgba(11, 28, 60, 0.6))', zIndex: 1
                                    }}></div>
                                    <div className="carousel-caption d-none d-md-block text-center" style={{
                                        zIndex: 2, top: '50%', transform: 'translateY(-50%)', bottom: 'auto'
                                    }}>
                                        <h1 className="display-4 fw-bold animated fadeInDown" style={{ fontFamily: '"Outfit", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#fff' }}>
                                            Supporting Every <span style={{ color: '#0dcaf0' }}>Family Milestone</span>
                                        </h1>
                                        <p className="lead fs-4 animated fadeInUp" style={{ maxWidth: '800px', margin: '20px auto', color: '#f8f9fa', fontWeight: '300' }}>
                                            Empowering individuals and families with compassion, empathy, and professional guidance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item" style={{ backgroundColor: '#0b1c3c', width: '100%' }}>
                                <div style={{
                                    height: '85vh',
                                    width: '100%',
                                    position: 'relative',
                                    backgroundImage: 'url("/assets/img/adult-hero.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundColor: '#0b1c3c'   // keeps background clean
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(rgba(11, 28, 60, 0.4), rgba(11, 28, 60, 0.6))', zIndex: 1
                                    }}></div>
                                    <div className="carousel-caption d-none d-md-block text-end" style={{
                                        zIndex: 2, top: '50%', transform: 'translateY(-50%)', bottom: 'auto', right: '10%', left: '10%'
                                    }}>
                                        <h1 className="display-4 fw-bold animated fadeInDown" style={{ fontFamily: '"Outfit", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#fff' }}>
                                            Dignity and Care in <span style={{ color: '#0dcaf0' }}>Adulthood</span>
                                        </h1>
                                        <p className="lead fs-4 animated fadeInUp" style={{ maxWidth: '800px', margin: '20px 0 20px auto', color: '#f8f9fa', fontWeight: '300' }}>
                                            Dedicated support for milestones from childhood to adulthood with unwavering commitment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </section>


                {/* <section id="about" className="about section">

                    <div className="container" data-aos="fade-up" data-aos-delay="100">
                        <div className="row align-items-xl-center gy-5">

                            <div className="col-xl-5 content">
                                <h3>About Us</h3>
                                <h1>CareSync:"Where every  individual thrives".</h1>
                                <p>We envision a world where every child and adult receives the care and support they need to reach their full potential.We strive to create a community that values compassion,empathy,and understanding where individuals can grow and flourish. </p>
                                <a href="#" className="read-more"><span>Our Values</span><i className="bi bi-arrow-right"></i></a>
                            </div>

                            <div className="col-xl-7">
                                <div className="row gy-4 icon-boxes">

                                    <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                                        <div className="icon-box">
                                            <i className="bi bi-buildings"></i>
                                            <h3>HealthCare</h3>
                                            <p>Physical Health
                                                - Medical Care: We provide access to medical care, including routine check-ups, vaccinations, and treatment for illnesses and injuries.
                                                - Nutrition: We offer healthy meal options and snacks, and provide education on nutrition and healthy eating habits.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
                                        <div className="icon-box">
                                            <i className="bi bi-clipboard-pulse"></i>
                                            <h3>Education</h3>
                                            <p>Early Childhood Education
                                                - Preschool Programs: We offer preschool programs that promote early childhood development.
                                                Adult Education
                                                - Literacy Programs: We offer literacy programs for adults, including basic literacy skills, GED preparation, and English language learning.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6" data-aos="fade-up" data-aos-delay="400">
                                        <div className="icon-box">
                                            <i className="bi bi-command"></i>
                                            <h3>Milestones</h3>
                                            <p>

                                                Child Development Milestones
                                                We track cognitive development milestones,including language development and problem-solving.
                                                Adult Development Milestones
                                                We celebrate career advancement milestones, including job promotions and new job opportunities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6" data-aos="fade-up" data-aos-delay="500">
                                        <div className="icon-box">
                                            <i className="bi bi-graph-up-arrow"></i>
                                            <h3>Growth</h3>
                                            <p>Nutritional Growth

                                                Child Nutrition Programs
                                                - Healthy Snacks: We provide healthy snack options, including fruits, vegetables and whole grains
                                                Adult Nutrition Programs
                                                - Weight Management: We offer weight management programs, including nutrition counseling and meal planning
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </section> */}
                <section id="about" className="about section" style={{

                    backgroundColor: "#f9fafb",
                    padding: "60px 0", // Top & bottom padding only
                }}>
                    <div
                        className="container"
                        style={{
                            maxWidth: "2400px",
                            marginLeft: "-150px",
                            padding: "0 20px",
                            display: "flex",
                            gap: "40px",

                        }}
                    >
                        {/* Left Side: About Us */}
                        <div
                            className="col-xl-5 content"
                            data-aos="fade-up" data-aos-delay="100"
                            style={{
                                flex: "1",
                                minWidth: "300px",
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: "18px",
                                    color: "#10b981",
                                    fontWeight: "600",
                                    marginBottom: "12px",
                                }}
                            >
                                About Us
                            </h3>
                            <h1
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "700",
                                    color: "#1E1E7E",
                                    marginBottom: "20px",
                                }} className='ms-4'
                            >
                                CareSync: "Where every individual thrives"
                            </h1>
                            <p
                                style={{
                                    fontSize: "16px",
                                    color: "#4B5563",
                                    lineHeight: "1.7",
                                    marginBottom: "24px",
                                }} className='ms-4'
                            >
                                We envision a world where every child and adult receives the care and support they need to reach their full
                                potential. We strive to create a community that values compassion, empathy, and understanding where
                                individuals can grow and flourish.
                            </p>
                            <a
                                href="#about"
                                style={{
                                    display: "inline-block",
                                    padding: "12px 20px",
                                    backgroundColor: "#10b981",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }} className='ms-4'
                            >
                                Our Values →
                            </a>
                        </div>

                        {/* Right Side: Cards */}
                        <div
                            className="col-xl-7"
                            style={{
                                flex: "1",
                                minWidth: "300px",
                            }}
                        >
                            <div
                                className="row gy-4 icon-boxes"

                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)", // 2 columns
                                    gap: "24px", // space between cards
                                }}
                            >
                                {/* Card 1 */}
                                <div data-aos="fade-up" data-aos-delay="200"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                    }}
                                >
                                    <i
                                        className="bi bi-buildings"
                                        style={{
                                            fontSize: "36px",
                                            color: "#059669",
                                            marginBottom: "16px",
                                        }}
                                    ></i>
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1E1E7E",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        HealthCare
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#6B7280",
                                            lineHeight: "1.7",
                                        }}
                                    >
                                        We provide access to medical care, healthy meals, and education on nutrition and healthy habits.
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div data-aos="fade-up" data-aos-delay="300"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                    }}
                                >
                                    <i
                                        className="bi bi-clipboard-pulse"
                                        style={{
                                            fontSize: "36px",
                                            color: "#059669",
                                            marginBottom: "16px",
                                        }}
                                    ></i>
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1E1E7E",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        Education
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#6B7280",
                                            lineHeight: "1.7",
                                        }}
                                    >
                                        From preschool to adult literacy programs, we support lifelong learning and development.
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div data-aos="fade-up" data-aos-delay="400"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                    }}
                                >
                                    <i
                                        className="bi bi-command"
                                        style={{
                                            fontSize: "36px",
                                            color: "#059669",
                                            marginBottom: "16px",
                                        }}
                                    ></i>
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1E1E7E",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        Milestones
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#6B7280",
                                            lineHeight: "1.7",
                                        }}
                                    >
                                        We track and celebrate growth milestones for both children and adults throughout their journey.
                                    </p>
                                </div>

                                {/* Card 4 */}
                                <div data-aos="fade-up" data-aos-delay="500"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                    }}
                                >
                                    <i
                                        className="bi bi-graph-up-arrow"
                                        style={{
                                            fontSize: "36px",
                                            color: "#059669",
                                            marginBottom: "16px",
                                        }}
                                    ></i>
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1E1E7E",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        Growth
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#6B7280",
                                            lineHeight: "1.7",
                                        }}
                                    >
                                        From nutritional care to personalized plans, we help individuals achieve sustainable growth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>




                <section id="features" className="features section">

                    <div className="container">

                        <div className="row gy-4">

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="100">
                                <div className="features-item">
                                    <i className="bi bi-eye" style={{ color: "#ffbb2c" }}></i>
                                    <h3><Link to="#" className="stretched-link">Medical Care</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="200">
                                <div className="features-item">
                                    <i className="bi bi-infinity" style={{ color: "#5578ff" }}></i>
                                    <h3><Link to="#" className="stretched-link">Fitness</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="300">
                                <div className="features-item">
                                    <i className="bi bi-mortarboard" style={{ color: "#e80368" }}></i>
                                    <h3><Link to="#" className="stretched-link">Education</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="400">
                                <div className="features-item">
                                    <i className="bi bi-nut" style={{ color: "#e361ff" }}></i>
                                    <h3><Link to="#" className="stretched-link">Counselling</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="500">
                                <div className="features-item">
                                    <i className="bi bi-shuffle" style={{ color: "#47aeff" }}></i>
                                    <h3><Link to="#" className="stretched-link">Compassion</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="600">
                                <div className="features-item">
                                    <i className="bi bi-star" style={{ color: "#ffa76e" }}></i>
                                    <h3><Link to="#" className="stretched-link">Milestones</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="700">
                                <div className="features-item">
                                    <i className="bi bi-x-diamond" style={{ color: "#11dbcf" }}></i>
                                    <h3><Link to="#" className="stretched-link">Mentorship</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="800">
                                <div className="features-item">
                                    <i className="bi bi-camera-video" style={{ color: "#4233ff" }}></i>
                                    <h3><Link to="#" className="stretched-link">Social Events</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="900">
                                <div className="features-item">
                                    <i className="bi bi-command" style={{ color: "#b2904f" }}></i>
                                    <h3><Link to="#" className="stretched-link">Enhances Creativity</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="1000">
                                <div className="features-item">
                                    <i className="bi bi-dribbble" style={{ color: "#b20969" }}></i>
                                    <h3><Link to="#" className="stretched-link">Sports and Games</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="1100">
                                <div className="features-item">
                                    <i className="bi bi-activity" style={{ color: "#ff5828" }}></i>
                                    <h3><Link to="#" className="stretched-link">Nutrition and Growth</Link></h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay="1200">
                                <div className="features-item">
                                    <i className="bi bi-brightness-high" style={{ color: "#29cc61" }}></i>
                                    <h3><Link to="#" className="stretched-link">Leadership Oppurtunities</Link></h3>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>


                <section id="stats" className="stats section light-background">

                    <div className="container" data-aos="fade-up" data-aos-delay="100">

                        <div className="row gy-4">

                            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                                <i className="bi bi-emoji-smile"></i>
                                <div className="stats-item">
                                    <span data-purecounter-start="0" data-purecounter-end="232" data-purecounter-duration="1" className="purecounter"></span>
                                    <p>Compassion</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                                <i className="bi bi-journal-richtext"></i>
                                <div className="stats-item">
                                    <span data-purecounter-start="0" data-purecounter-end="521" data-purecounter-duration="1" className="purecounter"></span>
                                    <p>Daily Activities</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                                <i className="bi bi-headset"></i>
                                <div className="stats-item">
                                    <span data-purecounter-start="0" data-purecounter-end="1463" data-purecounter-duration="1" className="purecounter"></span>
                                    <p>Hours Of Support</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                                <i className="bi bi-people"></i>
                                <div className="stats-item">
                                    <span data-purecounter-start="0" data-purecounter-end="15" data-purecounter-duration="1" className="purecounter"></span>
                                    <p>Staff Members</p>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>


                <section id="details" className="details section">


                    <div className="container section-title" data-aos="fade-up">
                        <h2>Details</h2>
                        <div><span>Check Our</span> <span className="description-title">Details</span></div>
                    </div>

                    <div className="container">

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="100">
                                <img src="assets/img/testimonials/Slide1.jpg" className="img-fluid" alt="" />
                            </div>
                            <div className="col-md-7" data-aos="fade-up" data-aos-delay="100">
                                <h3>CareSync:Nurturing the Next Generation</h3>
                                <p className="fst-italic">
                                    CareSync focuses on providing comprehensive care and support to children and adult who are aged upto 20 years which encompasses various aspects of their development.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check"></i><span> Physical Development:Providing nutritious food,healthcare and oppurtunities for physical development.</span></li>
                                    <li><i className="bi bi-check"></i> <span>Emotional Development:Creating a nurturing environment that fosters emotional intelligence,self-awareness and social skills.</span></li>
                                    <li><i className="bi bi-check"></i> <span>Cognitive Development:Offering educational activities,games and experiences that stimulate learning and cognitive growth.</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
                                <img src="assets/img/testimonials/Slide6.jpg" className="img-fluid" alt="" />
                            </div>
                            <div className="col-md-7 order-2 order-md-1" data-aos="fade-up" data-aos-delay="200">
                                <h3>Extra-curricular Activities</h3>
                                <p className="fst-italic">
                                    Extra-curricular Activities are given to mould the talents and desires of our children and it can be modified through different aspects.
                                </p>
                                <p>
                                    Benefits of these are to develop new skills,Enhances creativity through arts,promotes Physical Health,Builds confidence,Fosters Socialization.
                                </p>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 d-flex align-items-center" data-aos="zoom-out">
                                <img src="assets/img/testimonials/Slide 3.jpg" className="img-fluid" alt="" />
                            </div>
                            <div className="col-md-7" data-aos="fade-up">
                                <h3>These includes Sports,Arts</h3>
                                <p>Clubs,Leadership Oppurtuinities,College and  Carrier Preparation,Personal Growth,Social Skills and much more.</p>
                                <ul>
                                    <li><i className="bi bi-check"></i> <span>Creative Pursuits:Painting,Writing or other creative activities to foster self-expression and relaxation.</span></li>
                                    <li><i className="bi bi-check"></i><span>Hobbies and Interests:Classes focused on specific hobbies or interests such as photography,music,dancing etc.</span></li>
                                    <li><i className="bi bi-check"></i> <span>Wellness and Fitness:Yoga,Meditation or other fitness classes to promote physical health and well-being.</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out">
                                <img src="assets/img/testimonials/Slide 4.jpg" className="img-fluid" alt="" />
                            </div>
                            <div className="col-md-7 order-2 order-md-1" data-aos="fade-up">
                                <h3>Education and Nutrition</h3>
                                <p className="fst-italic">
                                    Education
                                    CareSync's education services aim to unlock individual potential through comprehensive programs, including early childhood education, adult education, and education support. Our programs promote academic success, social-emotional learning, and essential life skills.
                                    Nutrition
                                    CareSync's nutrition services focus on promoting overall health and well-being through nutrition education, meal planning, and nutrition support. Our services include healthy eating habits, nutrition science, cooking classes, and wellness programs to support individuals in achieving optimal health.
                                </p>
                                <p>It includes:
                                    - Improved Academic Performance: Our education services can help individuals improve their academic performance and achieve their academic goals.
                                    - Better Health Outcomes: Our nutrition services can help individuals improve their overall health and well-being, including reducing the risk of nutrition-related health issues.
                                    - Increased Self-Esteem: Our education and nutrition services can help individuals develop a positive self-image and increase their self-esteem.</p>
                            </div>
                        </div>
                    </div>

                </section>


                <section id="gallery" className="gallery section">


                    <div className="container section-title" data-aos="fade-up">
                        <h2>Gallery</h2>
                        <div><span>Check Our</span> <span className="description-title">Gallery</span></div>
                    </div>

                    <div className="container" data-aos="fade-up" data-aos-delay="100">

                        <div className="row g-0">

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-1.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery1.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-2.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery2.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-3.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery3.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-4.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery4.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-5.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery5.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-6.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery6.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-7.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery7.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4">
                                <div className="gallery-item">
                                    <a href="assets/img/gallery/gallery-8.jpg" className="glightbox" data-gallery="images-gallery">
                                        <img src="assets/img/gallery/gallery8.jpg" alt="" className="img-fluid" />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                </section>


                <section id="testimonials" className="testimonials section dark-background">

                    <img src="assets/img/testimonials/testimonials.jpg" className="testimonials-bg" alt="" />

                    <div className="container" data-aos="fade-up" data-aos-delay="100">

                        <div className="swiper init-swiper">
                            <script type="application/json" className="swiper-config">
                                {/* {{
                                    "loop": true,
                                "speed": 600,
                                "autoplay": {
                                    "delay": 5000
          },
                                "slidesPerView": "auto",
                                "pagination": {
                                    "el": ".swiper-pagination",
                                "type": "bullets",
                                "clickable": true
          }
        }} */}
                            </script>
                            <div className="swiper-wrapper">

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <img src="assets/img/testimonials/testimonials-1.jpg" className="testimonial-img" alt="" />
                                        <h3>Walter White</h3>
                                        <h4>Ceo &amp; Founder</h4>
                                        <div className="stars">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>
                                            <i className="bi bi-quote quote-icon-left"></i>
                                            <span>CareSync:Nurturing Minds,Nourishing Bodies,Empowering Futures.
                                                We care for the whole person:"From Childhood to Adulthood"
                                            </span>
                                            <i className="bi bi-quote quote-icon-right"></i>
                                        </p>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <img src="assets/img/testimonials/testimonials-2.jpg" className="testimonial-img" alt="" />
                                        <h3>Sara Wilsson</h3>
                                        <h4>Designer</h4>
                                        <div className="stars">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>
                                            <i className="bi bi-quote quote-icon-left"></i>
                                            <span>Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.</span>
                                            <i className="bi bi-quote quote-icon-right"></i>
                                        </p>
                                    </div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <img src="assets/img/gallery/gallery9.jpg" className="testimonial-img" alt="" />
                                        <h3>Jena Karlis</h3>
                                        <h4>Store Owner</h4>
                                        <div className="stars">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>
                                            <i className="bi bi-quote quote-icon-left"></i>
                                            <span>Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.</span>
                                            <i className="bi bi-quote quote-icon-right"></i>
                                        </p>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <img src="assets/img/testimonials/testimonials-4.jpg" className="testimonial-img" alt="" />
                                        <h3>Matt Brandon</h3>
                                        <h4>Freelancer</h4>
                                        <div className="stars">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>
                                            <i className="bi bi-quote quote-icon-left"></i>
                                            <span>Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.</span>
                                            <i className="bi bi-quote quote-icon-right"></i>
                                        </p>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <img src="assets/img/testimonials/testimonials-5.jpg" className="testimonial-img" alt="" />
                                        <h3>John Larson</h3>
                                        <h4>Entrepreneur</h4>
                                        <div className="stars">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>
                                            <i className="bi bi-quote quote-icon-left"></i>
                                            <span>Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.</span>
                                            <i className="bi bi-quote quote-icon-right"></i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>

                    </div>

                </section>


                <section id="team" className="team section">


                    <div className="container section-title" data-aos="fade-up">
                        <h2>Team</h2>
                        <div><span>Check Our</span> <span className="description-title">Team</span></div>
                    </div>

                    <div className="container">

                        <div className="row gy-5">

                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="member">
                                    <div className="pic"><img src="assets/img/testimonials/testimonials-1.jpg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>Walter White</h4>
                                        <span>Chief Executive Officer</span>

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                                <div className="member">
                                    <div className="pic"><img src="assets/img/testimonials/testimonials-3.jpg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>Emily Jackson</h4>
                                        <span>CTO</span>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                                <div className="member">
                                    <div className="pic"><img src="assets/img/testimonials/testimonials-4.jpg" className="img-fluid" alt="" /></div>
                                    <div className="member-info">
                                        <h4>William Anderson</h4>
                                        <span>CMO</span>

                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>

                </section>



                <section id="contact" className="contact section">


                    <div className="container section-title" data-aos="fade-up">
                        <h2>Contact</h2>
                        <div><span>Check Our</span> <span className="description-title">Contact</span></div>
                    </div>

                    <div className="container" data-aos="fade" data-aos-delay="100">

                        <div className="row gy-4">

                            <div className="col-lg-4">
                                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                                    <i className="bi bi-geo-alt flex-shrink-0"></i>
                                    <div>
                                        <h3>Address</h3>
                                        <p>A108 Adam Street, New York, NY 535022</p>
                                    </div>
                                </div>
                                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                                    <i className="bi bi-telephone flex-shrink-0"></i>
                                    <div>
                                        <h3>Call Us</h3>
                                        <p>+1 5589 55488 55</p>
                                    </div>
                                </div>

                                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                                    <i className="bi bi-envelope flex-shrink-0"></i>
                                    <div>
                                        <h3>Email Us</h3>
                                        <p>info@example.com</p>
                                    </div>
                                </div>

                            </div>

                            <div className="col-lg-8">
                                <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                                    <div className="row gy-4">

                                        <div className="col-md-6">
                                            <input type="text" name="name" className="form-control" placeholder="Your Name" required="" />
                                        </div>

                                        <div className="col-md-6 ">
                                            <input type="email" className="form-control" name="email" placeholder="Your Email" required="" />
                                        </div>

                                        <div className="col-md-12">
                                            <input type="text" className="form-control" name="subject" placeholder="Subject" required="" />
                                        </div>

                                        <div className="col-md-12">
                                            <textarea className="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
                                        </div>

                                        <div className="col-md-12 text-center">
                                            <div className="loading">Loading</div>
                                            <div className="error-message"></div>
                                            <div className="sent-message">Your message has been sent. Thank you!</div>

                                            <button type="submit">Send Message</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>

                </section>

            </main>
            <Footerpage />
        </>
    )
}
