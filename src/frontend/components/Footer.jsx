import { Link } from "react-router-dom";
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__branding">
                <h3 className="footer__brand-title">SAVE PHILIPPINES</h3>
                <p className="footer__slogan">
                    <span className="footer__slogan-text">The future grows with </span>
                    <span className="footer__slogan-highlight">you</span>
                    <span className="footer__slogan-text">th.</span>
                </p>

                <Link to="/register" className="footer__cta-button">
                    <span className="footer__cta-text">Volunteer Now</span>
                    <ArrowCircleIcon className="footer__cta-icon" />
                </Link>
            </div>

            <div className="footer__links-section">
                <div className="footer__column">
                    <h4 className="footer__column-title">PAGE</h4>
                    <a href="/#Home" className="footer__link">Home</a>
                    <a href="/#About" className="footer__link">About</a>
                    <a href="/#Process" className="footer__link">Process</a>
                    <a href="/#Questions" className="footer__link">FAQ</a>
                    <a href="/#Discover" className="footer__link">Discover</a>
                </div>
                <div className="footer__column">
                    <h4 className="footer__column-title">CONNECT</h4>
                    <Link to="/register" className="footer__link">Register</Link>
                    <Link to="/register" className="footer__link">Email</Link>
                </div>
            </div>

            <div className="footer__tagline-group">
                <p className="footer__mission-text">
                    SUPPORTING AGRICULTURE VIA VOLUNTEER ENGAGEMENT
                </p>
            </div>

            <p className="footer__copyright">© 2026 • SAVE PH</p>
        </footer>
    );
}