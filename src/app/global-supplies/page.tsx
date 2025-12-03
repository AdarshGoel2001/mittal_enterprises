import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Globe, Truck, ShieldCheck, Handshake } from 'lucide-react';

export default function GlobalSuppliesPage() {
    return (
        <div className={styles.container}>
            <PageHeader
                title="Global Supplies"
                subtitle="Exporting Excellence to Educational & Research Institutions Worldwide"
                backgroundImage="https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80"
            />

            <div className={styles.introSection}>
                <p className={styles.introText}>
                    Mittal Enterprises India is a premier Global Lab Equipments Manufacturer and Distributor. We supply high-quality Physics, Chemistry, and Biology equipment to dealers, schools, and universities across the globe. Our commitment to quality and timely delivery has made us a trusted partner in the international scientific community.
                </p>
            </div>

            <div className={styles.mapSection}>
                <div className={styles.mapContainer}>
                    <Globe size={64} className="text-secondary mb-4" />
                    <h2 className="text-3xl font-bold mb-8">Our Global Footprint</h2>

                    <div className={styles.regionsGrid}>
                        <div className={styles.regionCard}>
                            <h3 className={styles.regionTitle}>Asia Pacific</h3>
                            <ul className={styles.regionList}>
                                <li>India</li>
                                <li>Singapore</li>
                                <li>Malaysia</li>
                                <li>Australia</li>
                            </ul>
                        </div>
                        <div className={styles.regionCard}>
                            <h3 className={styles.regionTitle}>Middle East & Africa</h3>
                            <ul className={styles.regionList}>
                                <li>UAE</li>
                                <li>Saudi Arabia</li>
                                <li>South Africa</li>
                                <li>Kenya</li>
                            </ul>
                        </div>
                        <div className={styles.regionCard}>
                            <h3 className={styles.regionTitle}>Europe & Americas</h3>
                            <ul className={styles.regionList}>
                                <li>United Kingdom</li>
                                <li>Germany</li>
                                <li>USA</li>
                                <li>Canada</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.distributorSection}>
                <div className={styles.distributorContent}>
                    <div>
                        <h2 className="text-3xl font-bold text-primary mb-6">Why Partner With Us?</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Truck className="text-secondary shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Reliable Logistics</h3>
                                    <p className="text-muted-foreground">Efficient shipping and handling to ensure products reach you safely and on time.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="text-secondary shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">International Standards</h3>
                                    <p className="text-muted-foreground">All products are manufactured to meet global quality and safety standards.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Handshake className="text-secondary shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Distributor Support</h3>
                                    <p className="text-muted-foreground">We provide comprehensive marketing materials and technical support to our partners.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.ctaBox}>
                        <h3 className={styles.ctaTitle}>Become a Distributor</h3>
                        <p className={styles.ctaText}>
                            Are you interested in distributing our high-quality scientific instruments in your region? Join our global network today.
                        </p>
                        <Link href="/contact" className={styles.ctaButton}>
                            Contact Us Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
