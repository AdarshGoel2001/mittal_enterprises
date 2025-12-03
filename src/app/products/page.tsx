import React from 'react';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/products";
import styles from "./products.module.css";

export default function ProductsIndexPage() {
    const categories = getCategories();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Our Products</h1>
                <div className={styles.description}>
                    <p>
                        Explore our comprehensive range of scientific instruments and laboratory equipment.
                        We specialize in Physics, Chemistry, Material Science, and Nanotechnology solutions.
                    </p>
                </div>
            </div>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products/${category.url}`}
                        className={styles.card}
                    >
                        <div className={styles.imageContainer}>
                            {/* Placeholder for now */}
                            <div className="text-4xl">📚</div>
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>
                                {category.name}
                            </h3>
                            <div
                                className={styles.cardDesc}
                                dangerouslySetInnerHTML={{ __html: category.description }}
                            />
                            <span className={styles.cardLink}>
                                View Categories <ArrowRight size={16} className="ml-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
