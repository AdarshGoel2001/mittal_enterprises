"use client";

import React from 'react';
import styles from './EnquiryForm.module.css';

interface EnquiryFormProps {
    productName?: string;
}

export default function EnquiryForm({ productName }: EnquiryFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your enquiry. We will get back to you soon.");
    };

    return (
        <div className={styles.formContainer} id="enquiry-form">
            <h3 className={styles.title}>Send Enquiry</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
                {productName && (
                    <div className={styles.group}>
                        <label className={styles.label}>Product</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={productName}
                            readOnly
                        />
                    </div>
                )}

                <div className={styles.group}>
                    <label className={styles.label}>Your Name *</label>
                    <input type="text" className={styles.input} required placeholder="John Doe" />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Email Address *</label>
                    <input type="email" className={styles.input} required placeholder="john@example.com" />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Phone Number *</label>
                    <input type="tel" className={styles.input} required placeholder="+91 98765 43210" />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Country *</label>
                    <input type="text" className={styles.input} required placeholder="India" />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Requirements *</label>
                    <textarea
                        className={styles.textarea}
                        rows={4}
                        required
                        placeholder="Please describe your requirements..."
                    ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Submit Enquiry
                </button>
            </form>
        </div>
    );
}
