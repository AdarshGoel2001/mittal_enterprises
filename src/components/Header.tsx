"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Facebook, Linkedin, Youtube, Twitter } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarContainer}`}>
                    <div className={styles.contactGroup}>
                        <div className={styles.contactItem}>
                            <Phone size={14} className="text-secondary" />
                            <span>+91-11-9810681132</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Mail size={14} className="text-secondary" />
                            <a href="mailto:info@mittalenterprises.com">info@mittalenterprises.com</a>
                        </div>
                    </div>
                    <div className={styles.socialGroup}>
                        <a href="https://www.facebook.com/mittal.enter" target="_blank"><Facebook size={16} /></a>
                        <a href="https://twitter.com/mittalenterpris" target="_blank"><Twitter size={16} /></a>
                        <a href="#"><Youtube size={16} /></a>
                        <a href="http://www.linkedin.com/pub/mittal-enterprises/22/41/239" target="_blank"><Linkedin size={16} /></a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className={`container ${styles.mainHeader}`}>
                <Link href="/">
                    <Image src="/images/logo.png" alt="Mittal Enterprises" width={200} height={60} style={{ height: '3rem', width: 'auto' }} priority />
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/profile" className={styles.navLink}>Profile</Link>
                    <div className={styles.dropdown}>
                        <button className={styles.dropdownBtn}>
                            Our Products
                        </button>
                        <div className={styles.dropdownMenu}>
                            <Link href="/products/nano-science-instruments" className={styles.dropdownItem}>Nano Science Instruments</Link>
                            <Link href="/products/ultrasonics-laboratory-instruments" className={styles.dropdownItem}>Ultrasonics Laboratory Instruments</Link>
                            <Link href="/products/physics-laboratory-instruments" className={styles.dropdownItem}>Physics Laboratory Instruments</Link>
                            <Link href="/products/chemistry-laboratory-instruments" className={styles.dropdownItem}>Chemistry Laboratory Instruments</Link>
                            <Link href="/products/material-science-laboratory-instruments" className={styles.dropdownItem}>Material Science Laboratory</Link>
                        </div>
                    </div>
                    <Link href="/global-supplies" className={styles.navLink}>Global Supplies</Link>
                    <Link href="/contact" className={styles.navLink}>Contact Us</Link>
                </nav>

                <Link href="/enquiry" className={`btn btn-primary ${styles.enquiryBtn}`}>
                    Enquiry
                </Link>

                {/* Mobile Menu Button */}
                <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)', marginBottom: '4px' }}></div>
                    <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)', marginBottom: '4px' }}></div>
                    <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)' }}></div>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className="flex flex-col gap-4">
                        <Link href="/" className={styles.mobileLink}>Home</Link>
                        <Link href="/profile" className={styles.mobileLink}>Profile</Link>
                        <Link href="/products" className={styles.mobileLink}>Our Products</Link>
                        <Link href="/global-supplies" className={styles.mobileLink}>Global Supplies</Link>
                        <Link href="/contact" className={styles.mobileLink}>Contact Us</Link>
                        <Link href="/enquiry" className="btn btn-primary w-full text-center">Enquiry</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
