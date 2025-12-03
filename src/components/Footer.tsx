import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div>
                    <h3 className={styles.title}>Mittal Enterprises</h3>
                    <p className={styles.description}>
                        Established in 1976, we are a leading manufacturer and exporter of scientific instruments for education and research.
                    </p>
                </div>

                <div>
                    <h3 className={styles.subtitle}>Quick Links</h3>
                    <ul className={styles.list}>
                        <li><Link href="/" className={styles.link}>Home</Link></li>
                        <li><Link href="/profile" className={styles.link}>Profile</Link></li>
                        <li><Link href="/products" className={styles.link}>Our Products</Link></li>
                        <li><Link href="/global-supplies" className={styles.link}>Global Supplies</Link></li>
                        <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className={styles.subtitle}>Categories</h3>
                    <ul className={styles.list}>
                        <li><Link href="/products/nano-science" className={styles.link}>Nano Science</Link></li>
                        <li><Link href="/products/ultrasonics" className={styles.link}>Ultrasonics</Link></li>
                        <li><Link href="/products/physics" className={styles.link}>Physics Lab</Link></li>
                        <li><Link href="/products/chemistry" className={styles.link}>Chemistry Lab</Link></li>
                        <li><Link href="/products/material-science" className={styles.link}>Material Science</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className={styles.subtitle}>Contact Info</h3>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <MapPin className={styles.icon} size={18} />
                            <p>2151/T-7C, New Patel Nagar, Delhi, 110008 India</p>
                        </div>
                        <div className={styles.contactItem}>
                            <Phone className={styles.icon} size={18} />
                            <p>+91-9810681132, 9868532156</p>
                        </div>
                        <div className={styles.contactItem}>
                            <Mail className={styles.icon} size={18} />
                            <a href="mailto:info@mittalenterprises.com" className={styles.link}>info@mittalenterprises.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`container ${styles.bottom}`}>
                <p>&copy; {new Date().getFullYear()} Mittal Enterprises. All Rights Reserved.</p>
                <div className={styles.legal}>
                    <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                    <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
