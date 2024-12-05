import { writable } from "svelte/store";

export const ProductList = writable([]);

const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        ProductList.set(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

await fetchProducts();

export {fetchProducts};
