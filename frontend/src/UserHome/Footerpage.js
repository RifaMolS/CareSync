import React from 'react'
import { Link } from 'react-router-dom'

export default function Footerpage() {
    return (
        <>
            <footer id="footer" class="footer dark-background">

                <div class="container footer-top">
                    <div class="row gy-4">
                        <div class="col-lg-4 col-md-6 footer-about">
                            <a href="" class="logo d-flex align-items-center"><Link to="/">
                                <span class="sitename">CareSync</span></Link>
                            </a>
                            <div class="footer-contact pt-3">
                                <p>A108 Adam Street</p>
                                <p>New York, NY 535022</p>
                                <p class="mt-3"><strong>Phone:</strong> <span>9947813144</span></p>
                                <p><strong>Email:</strong> <span>info@example.com</span></p>
                            </div>
                            <div class="social-links d-flex mt-4">
                                <Link to="/"><i class="bi bi-twitter-x"></i></Link>
                                <Link to="/"><i class="bi bi-facebook"></i></Link>
                                <Link to="/"><i class="bi bi-instagram"></i></Link>
                                <Link to="/"><i class="bi bi-linkedin"></i></Link>
                            </div>
                        </div>

                        <div class="col-lg-2 col-md-3 footer-links">
                            <h4>Useful Links</h4>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About us</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Terms of service</a></li>
                                <li><a href="#">Privacy policy</a></li>
                            </ul>
                        </div>

                        <div class="col-lg-2 col-md-3 footer-links">
                            <h4>Our Services</h4>
                            <ul>
                                <li><a href="#">Nutrition</a></li>
                                <li><a href="#">Extra-curricular Activities</a></li>
                                <li><a href="#">Education</a></li>
                                <li><a href="#">Health care</a></li>
                                <li><a href="#">Safety</a></li>
                            </ul>
                        </div>

                        <div class="col-lg-4 col-md-12 footer-newsletter">
                            <h4>Our Newsletter</h4>
                            <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                            <form action="forms/newsletter.php" method="post" class="php-email-form">
                                <div class="newsletter-form"><input type="email" name="email" /><input type="submit" value="Subscribe" /></div>
                                <div class="loading">Loading</div>
                                <div class="error-message"></div>
                                <div class="sent-message">Your subscription request has been sent. Thank you!</div>
                            </form>
                        </div>

                    </div>
                </div>

            </footer>
        </>
    )
}

