import React from 'react';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getSubcategoryBySlug } from "@/lib/products";
import styles from "../../products.module.css";

interface PageProps {
    params: Promise<{
        category: string;
        subcategory: string;
    }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const subcategory = getSubcategoryBySlug(resolvedParams.category, resolvedParams.subcategory);

    if (!subcategory) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <div className="mb-8">
                <Link href={`/products/${resolvedParams.category}`} className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to {resolvedParams.category.replace(/-/g, ' ')}
                </Link>
            </div>

            <div className={styles.header}>
                <h1 className={styles.title}>{subcategory.name}</h1>
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: subcategory.description }}
                />
            </div>

            <div className={styles.grid}>
                {subcategory.products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${resolvedParams.category}/${resolvedParams.subcategory}/${product.url}`}
                        className={styles.card}
                    >
                        <div className={styles.imageContainer}>
                            {/* Placeholder for now */}
                            <div className="text-4xl">🔬</div>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>
                                {product.name}
                            </h3>
                            <p className={styles.itemCode}>Code: {product.itemCode}</p>
                            <span className={styles.cardLink}>
                                View Details <ArrowRight size={14} className="ml-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {subcategory.products.length === 0 && (
                <p className={styles.emptyState}>No products found in this category.</p>
            )}
        </div>
    );
}
