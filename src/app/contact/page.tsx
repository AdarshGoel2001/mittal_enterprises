import React from 'react';
import PageHeader from '@/components/PageHeader';
import EnquiryForm from '@/components/EnquiryForm';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <PageHeader
                title="Contact Us"
                subtitle="Get in touch with our team for enquiries and support"
                backgroundImage="https://images.unsplash.com/photo-1423666639041-f142fcb93370?auto=format&fit=crop&q=80"
            />

            <div className={styles.grid}>
                <div className={styles.infoCard}>
                    <h2 className={styles.infoTitle}>Contact Information</h2>

                    <div className={styles.contactList}>
                        <div className={styles.contactItem}>
                            <div className={styles.iconBox}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className={styles.contactLabel}>Head Office</h3>
                                <p className={styles.contactValue}>
                                    2151/T-7C, New Patel Nagar,<br />
                                    New Delhi - 110008,<br />
                                    India
                                </p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconBox}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className={styles.contactLabel}>Phone</h3>
                                <p className={styles.contactValue}>
                                    +91-11-9810681132<br />
                                    +91-9868532156<br />
                                    011-25702784
                                </p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconBox}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className={styles.contactLabel}>Email</h3>
                                <p className={styles.contactValue}>
                                    <a href="mailto:info@mittalenterprises.com" className={styles.link}>
                                        info@mittalenterprises.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.iconBox}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className={styles.contactLabel}>Business Hours</h3>
                                <p className={styles.contactValue}>
                                    Mon - Sat: 9:30 AM - 6:30 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <EnquiryForm />
            </div>

            <div className={styles.mapSection}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.766367353456!2d77.1587!3d28.6366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02b855555555%3A0x5555555555555555!2sNew%20Patel%20Nagar%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    className={styles.mapFrame}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Mittal Enterprises Location"
                ></iframe>
            </div>
        </div>
    );
}
