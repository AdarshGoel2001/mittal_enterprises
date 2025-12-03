"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { getCategories } from '@/lib/products';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const categories = getCategories();

    return (
        <aside className={styles.sidebar}>
            <div className="mb-8">
                <h3 className={styles.title}>Our Products</h3>
                <ul className={styles.list}>
                    {categories.map((category) => {
                        const isActive = pathname.includes(category.url);
                        return (
                            <li key={category.id} className={styles.item}>
                                <Link
                                    href={`/products/${category.url}`}
                                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                                >
                                    {category.name}
                                </Link>
                                {isActive && (
                                    <ul className={styles.subList}>
                                        {category.subcategories.map((sub) => (
                                            <li key={sub.id}>
                                                <Link
                                                    href={`/products/${category.url}/${sub.url}`}
                                                    className={styles.subLink}
                                                    style={{
                                                        color: pathname.includes(sub.url) ? 'var(--secondary)' : undefined,
                                                        fontWeight: pathname.includes(sub.url) ? 600 : 400
                                                    }}
                                                >
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className={styles.socialSection}>
                <h3 className={styles.title}>Follow Us</h3>
                <div className={styles.socialIcons}>
                    <a href="https://www.facebook.com/mittal.enter" target="_blank" className={styles.socialIcon}>
                        <Facebook size={24} />
                    </a>
                    <a href="https://twitter.com/mittalenterpris" target="_blank" className={styles.socialIcon}>
                        <Twitter size={24} />
                    </a>
                    <a href="#" className={styles.socialIcon}>
                        <Youtube size={24} />
                    </a>
                    <a href="http://www.linkedin.com/pub/mittal-enterprises/22/41/239" target="_blank" className={styles.socialIcon}>
                        <Linkedin size={24} />
                    </a>
                </div>
            </div>
        </aside>
    );
}
