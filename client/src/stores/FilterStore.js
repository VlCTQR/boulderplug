import { writable } from "svelte/store";
import {fetchDefault} from "../serverRequest.js";

const initialFilter = {
    brands: [],
    level: "",
    closing: "",
    toepatch: null,
    colors: [],
};

export const SearchQuery = writable("");

let searchQueryValue;
SearchQuery.subscribe(value => searchQueryValue = value);

export const FilteredProductList = writable([]);

const fetchProducts = async (filter) => {

    let query = new URLSearchParams();

    if (searchQueryValue.length > 0) {
        query.append('search', searchQueryValue);
    }

    if (filter.brands.length) {
        query.append('brands', filter.brands.join(','));
    }
    if (filter.level) {
        query.append('levels', filter.level);
    }
    if (filter.closing) {
        query.append('closing', filter.closing);
    }
    if (filter.toepatch !== null && filter.toepatch !== undefined) {
        query.append('toepatch', filter.toepatch);
    }
    if (filter.colors.length) {
        query.append('colors', filter.colors.join(','));
    }


    try {
        const {response, data} = await fetchDefault(`products?${query.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        FilteredProductList.set(data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

await fetchProducts(initialFilter);

export const Filter = (() => {
    const { subscribe, set, update } = writable(initialFilter);

    return {
        subscribe,
        updateFilter: (singleFilterArr) => {
            update(currentFilter => {
                Object.keys(singleFilterArr).forEach(key => {
                    if (Array.isArray(singleFilterArr[key])) {
                        currentFilter[key] = [...singleFilterArr[key]];
                    } else {
                        currentFilter[key] = singleFilterArr[key];
                    }
                });


                fetchProducts(currentFilter);

                return currentFilter;
            });
        },
        clearFilters: () => {
            set({
                brands: [],
                level: "",
                closing: "",
                toepatch: false,
                colors: [],
            });

            fetchProducts({
                brands: [],
                level: "",
                closing: "",
                toepatch: false,
                colors: [],
            });
        }
    };
})();

const fetchProductsExternal = async () => {
    await fetchProducts(initialFilter);
}

export {fetchProductsExternal};
