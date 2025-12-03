import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      <section className={styles.aboutSection}>
        <div className={`container ${styles.aboutContainer}`}>
          <div className={styles.aboutContent}>
            <span className={styles.subtitle}>About Us</span>
            <h2 className={styles.title}>Welcome to Mittal Enterprises</h2>
            <p className={styles.text}>
              Mittal Enterprises was established in 1976 with the motto of providing quality products for Educational Institutions & Research Laboratories.
              The company has successfully achieved a distinct position owing to its quality products, competent management facilities, and total customer satisfaction.
            </p>
            <p className={styles.text}>
              We have distinction in manufacturing and exporting Lab Instruments, Ultrasonic Instruments like Ultrasonic Interferometer and other Laboratory equipments and Scientific Instruments covered with Trademark, Design Registration and Copy right.
            </p>
            <Link href="/profile" className="btn btn-primary">
              Read More About Us
            </Link>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>45+</h3>
              <p className={styles.statLabel}>Years of Experience</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>1000+</h3>
              <p className={styles.statLabel}>Happy Clients</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>500+</h3>
              <p className={styles.statLabel}>Products</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>24/7</h3>
              <p className={styles.statLabel}>Support</p>
            </div>
          </div>
        </div>
      </section>

      <ProductCategories />

      <section className={styles.whyUsSection}>
        <div className={styles.whyUsBg}></div>
        <div className={`container ${styles.whyUsContainer}`}>
          <div className={styles.whyUsGrid}>
            <div>
              <span className={styles.subtitle}>Why Choose Us</span>
              <h2 className={styles.whyUsTitle}>Excellence in Scientific Instrumentation</h2>
              <p className={styles.whyUsText}>
                Mittal Enterprises has distinction in manufacturing Nanofluid Interferometer, Ultrasonic Interferometers and other scientific equipments for Research and Laboratory experiments in Physics, Chemistry, Polymer Science and Material Science departments of Engineering colleges, Post Graduate colleges and Universities.
              </p>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <CheckCircle2 className="text-secondary" />
                  <span>ISO Certified Manufacturing Process</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 className="text-secondary" />
                  <span>Global Export Network</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 className="text-secondary" />
                  <span>Custom Research Solutions</span>
                </li>
              </ul>

              <Link href="/profile" className="btn btn-secondary">Discover Our Story</Link>
            </div>

            <div className={styles.updateCard}>
              <div className={styles.updateHeader}>
                <h3 className="text-xl font-bold text-white">Latest Update</h3>
                <span className={styles.updateLabel}>New Research</span>
              </div>
              <h4 className={styles.updateTitle}>
                Molecular Interactions in Substituted Pyrimidines–Acetonitrile Solutions
              </h4>
              <p className={styles.updateText}>
                A. B. Naika, M. L. Narwadeb, P. S. Bodakheb, and G. G. Muleyc a Physical Chemistry Laboratory, Department of Chemical Technology, SGB Amravati University.
                Research paper published in Russian Journal of Physical Chemistry.
              </p>
              <a href="#" className="text-secondary hover:text-white transition-colors inline-flex items-center gap-2 text-sm font-medium">
                Read Full Paper <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <h2 className={styles.title}>Ready to Upgrade Your Laboratory?</h2>
          <p className={styles.description} style={{ marginBottom: '2rem' }}>
            Contact us today for a quote or to discuss your specific requirements. Our team of experts is ready to assist you.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>Get in Touch</Link>
            <Link href="/products" className={`btn ${styles.btnOutline}`} style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>Browse Catalog</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
