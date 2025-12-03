import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from './page.module.css';
import { Award, Beaker, Users, Globe } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className={styles.container}>
            <PageHeader
                title="Company Profile"
                subtitle="Leading Manufacturer of Scientific & Educational Equipment Since 1976"
                backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80"
            />

            <div className={styles.section}>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h2>Our Legacy</h2>
                        <p>
                            <strong>Mittal Enterprises</strong> was established in 1976 with the motto of providing quality products for Educational Institutions & Research Laboratories. Over the decades, we have successfully achieved a distinct position in the industry, owing to our commitment to quality, competent management, and total customer satisfaction.
                        </p>
                        <p>
                            We take pride in our extensive experience and deep understanding of the scientific community's needs, allowing us to deliver precision instruments that meet international standards.
                        </p>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>45+</span>
                            <span className={styles.statLabel}>Years Experience</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>1000+</span>
                            <span className={styles.statLabel}>Products</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>50+</span>
                            <span className={styles.statLabel}>Countries Served</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>100%</span>
                            <span className={styles.statLabel}>Quality Assured</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.sectionAlt}>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h2>Infrastructure & Innovation</h2>
                        <p>
                            Mittal Enterprises boasts fully equipped infrastructure facilities. We have our own R&D facilities to develop new instruments and have recently added a new range of products in nanotechnology.
                        </p>
                        <p>
                            Our team consists of skilled professionals with in-depth expertise in various scientific fields including Physics, Chemistry, Polymer Science, and Material Science. This multidisciplinary approach enables us to stay at the forefront of scientific innovation.
                        </p>
                    </div>
                    <div className={styles.imageWrapper}>
                        {/* Placeholder for infrastructure image if needed, or just text/icon layout */}
                        <div className={styles.features}>
                            <div className={styles.featureCard}>
                                <Beaker size={32} className="text-secondary mb-4" />
                                <h3 className={styles.featureTitle}>R&D Facility</h3>
                                <p className={styles.featureText}>Dedicated research wing for product innovation and improvement.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <Users size={32} className="text-secondary mb-4" />
                                <h3 className={styles.featureTitle}>Expert Team</h3>
                                <p className={styles.featureText}>Qualified scientists and engineers ensuring product precision.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.content}>
                    <h2>Quality & Recognition</h2>
                    <p>
                        We have the distinction of manufacturing specialized Ultrasonic Instruments like Ultrasonic Interferometers. Our Chemistry and Physics equipment and Scientific Instruments are covered with Trademarks, Design Registrations, and Copyrights, reflecting our commitment to original and high-quality design.
                    </p>

                    <div className={styles.features}>
                        <div className={styles.featureCard}>
                            <Award size={32} className="text-accent mb-4" />
                            <h3 className={styles.featureTitle}>Certified Quality</h3>
                            <p className={styles.featureText}>Adhering to strict quality control measures at every stage of production.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Globe size={32} className="text-accent mb-4" />
                            <h3 className={styles.featureTitle}>Global Standards</h3>
                            <p className={styles.featureText}>Products designed to meet the rigorous demands of international laboratories.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Beaker size={32} className="text-accent mb-4" />
                            <h3 className={styles.featureTitle}>Wide Range</h3>
                            <p className={styles.featureText}>Comprehensive solutions for Physics, Chemistry, and Biology labs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
