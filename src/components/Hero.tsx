"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.bgImage}>
                <Image
                    src="/images/banner1.jpg"
                    alt="Laboratory"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            <div className={styles.overlay}></div>

            <div className={`container ${styles.content}`}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.badge}>
                        Established 1976
                    </span>
                    <h1 className={styles.title}>
                        Pioneering <span className={styles.highlight}>Scientific Excellence</span>
                    </h1>
                    <p className={styles.description}>
                        Premium quality instruments for Educational Institutions & Research Laboratories. Trusted by experts worldwide.
                    </p>
                    <div className={styles.actions}>
                        <a href="/products" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>Explore Products</a>
                        <a href="/contact" className={`btn ${styles.btnOutline}`} style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>Contact Us</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
