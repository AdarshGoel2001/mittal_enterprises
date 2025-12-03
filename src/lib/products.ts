import productsData from '../data/products.json';

export type Product = {
    id: number;
    name: string;
    image: string;
    description: string;
    fullDescription: string;
    itemCode: string;
    url: string;
};

export type Subcategory = {
    id: number;
    name: string;
    description: string;
    image: string;
    parent_id: number;
    url: string;
    products: Product[];
};

export type Category = {
    id: number;
    name: string;
    description: string;
    image: string;
    parent_id: number;
    url: string;
    subcategories: Subcategory[];
};

export function getCategories(): Category[] {
    return productsData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
    return (productsData as Category[]).find(cat => cat.url === slug);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
    const category = getCategoryBySlug(categorySlug);
    if (!category) return undefined;
    return category.subcategories.find(sub => sub.url === subcategorySlug);
}

export function getProductBySlug(categorySlug: string, subcategorySlug: string, productSlug: string): Product | undefined {
    const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
    if (!subcategory) return undefined;
    return subcategory.products.find(prod => prod.url === productSlug);
}
