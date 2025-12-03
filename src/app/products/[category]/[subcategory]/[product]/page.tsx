import React from 'react';
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import styles from "../../../products.module.css";
import EnquiryForm from "@/components/EnquiryForm";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface PageProps {
    params: Promise<{
        category: string;
        subcategory: string;
        product: string;
    }>;
}

export default async function ProductPage({ params }: PageProps) {
    const resolvedParams = await params;
    const product = getProductBySlug(resolvedParams.category, resolvedParams.subcategory, resolvedParams.product);

    if (!product) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <div className="mb-6">
                <Link href={`/products/${resolvedParams.category}/${resolvedParams.subcategory}`} className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to {resolvedParams.subcategory.replace(/-/g, ' ')}
                </Link>
            </div>

            <div className={styles.productDetailContainer}>
                <div className={styles.productGrid}>
                    {/* Image Section */}
                    <div className={styles.productImage}>
                        {/* Placeholder for now */}
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔬</div>
                            <span className="text-muted-foreground">Image coming soon</span>
                        </div>
                        {/* <Image src={`/images/${product.image}`} ... /> */}
                    </div>

                    {/* Details Section */}
                    <div className={styles.productInfo}>
                        <h1 className={styles.productTitle}>{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <span className={styles.itemCode}>Code: {product.itemCode}</span>
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                <CheckCircle size={16} className="mr-1" /> In Stock
                            </span>
                        </div>

                        <div className={styles.productDesc}>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />

                            {product.fullDescription && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2 mt-6">Specifications</h3>
                                    <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
                                </>
                            )}
                        </div>

                        <div className="mt-8">
                            <a href="#enquiry-form" className={styles.quoteBtn}>
                                Request Quote
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-xl font-bold text-blue-900 mb-4">Why Choose This Product?</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-blue-600 shrink-0 mt-1" size={18} />
                                <span className="text-blue-800">High precision manufacturing for accurate results</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-blue-600 shrink-0 mt-1" size={18} />
                                <span className="text-blue-800">Durable construction suitable for educational and industrial use</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-blue-600 shrink-0 mt-1" size={18} />
                                <span className="text-blue-800">Backed by Mittal Enterprises' quality assurance</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-1">
                    {/* This space intentionally left blank or for other widgets */}
                </div>
            </div>

            <div className="mt-16">
                <EnquiryForm productName={product.name} />
            </div>
        </div>
    );
}
