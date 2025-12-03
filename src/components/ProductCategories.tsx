"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./ProductCategories.module.css";
import productsData from "../data/products.json";

// Map category IDs or names to the existing high-quality images
const categoryImages: { [key: number]: string } = {
    3226: "/images/Nano-Science-Instruments.jpg",
    3227: "/images/Ultrasonics-Laboratory-Instruments.jpg",
    3228: "/images/Physics-Laboratory-Instruments.jpg",
    3229: "/images/Chemistry-Laboratory-Instruments.jpg",
    3230: "/images/Material-Sc.-Laboratory-Instruments.jpg",
};

// Fallback image
const defaultImage = "/images/banner.jpg";

export default function ProductCategories() {
    // Filter only root categories (those that are likely main categories)
    // The migration script identified root categories, so we can just use the top-level array.
    const categories = productsData.map(cat => ({
        id: cat.id,
        title: cat.name,
        // Use mapped image or fallback
        image: categoryImages[cat.id] || defaultImage,
        link: `/products/${cat.url}`,
        // Strip HTML tags from description for the card preview
        desc: cat.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + "..."
    }));

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.subtitle}>Our Portfolio</span>
                    <h2 className={styles.title}>Scientific Solutions</h2>
                    <p className={styles.description}>Discover our wide range of high-precision scientific instruments designed for modern laboratories and educational institutions.</p>
                </div>

                <div className="grid grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={styles.card}
                        >
                            <div className={styles.imageContainer}>
                                <div className={styles.overlay}></div>
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{cat.title}</h3>
                                <p className={styles.cardDesc}>{cat.desc}</p>
                                <Link href={cat.link} className={styles.cardLink}>
                                    View Products <ArrowRight size={16} className={styles.arrow} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
