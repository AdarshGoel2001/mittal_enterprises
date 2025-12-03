import React from 'react';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "@/lib/products";
import styles from "../products.module.css";

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const category = getCategoryBySlug(resolvedParams.category);

    if (!category) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <div className="mb-8">
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className={styles.header}>
                <h1 className={styles.title}>{category.name}</h1>
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: category.description }}
                />
            </div>

            <div className={styles.grid}>
                {category.subcategories.map((sub) => (
                    <Link
                        key={sub.id}
                        href={`/products/${category.url}/${sub.url}`}
                        className={styles.card}
                    >
                        <div className={styles.imageContainer}>
                            {/* Placeholder for now as we might not have specific subcat images */}
                            <div className="text-4xl">📁</div>
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>
                                {sub.name}
                            </h3>
                            <div
                                className={styles.cardDesc}
                                dangerouslySetInnerHTML={{ __html: sub.description }}
                            />
                            <span className={styles.cardLink}>
                                View Products <ArrowRight size={16} className="ml-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
