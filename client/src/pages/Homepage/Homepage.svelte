<script>
    import ProductCard from "./ProductCard.svelte";
    import Filterbar from "./Filterbar.svelte";
    import {fetchProductsExternal, Filter, FilteredProductList, SearchQuery} from '../../stores/FilterStore';
    import {User} from "../../stores/UserStore.js";
    import AddProductCard from "./AddProductCard.svelte";

    let products = [];
    let filter;
    let searchQuery = "";

    $: SearchQuery.subscribe(value => searchQuery = value);
    $: FilteredProductList.subscribe(value => products = value);
    $: Filter.subscribe(value => filter = value);

    const removeSearch = async () => {
        SearchQuery.set('');
        await fetchProductsExternal();
    }

</script>

<main>
    <section class="filterbar-wrapper">
        <Filterbar
                on:filterChange={(event) => Filter.updateFilter(event.detail.filter)}
                on:clearFilters={() => Filter.clearFilters()}
                filter={filter}
        />
    </section>

    {#if searchQuery.length > 0}
        <p class="search-text">Search results for "{searchQuery}"</p>
        <button class="remove-search-button" on:click={removeSearch}>Remove search</button>
    {/if}

    <section class="products-container">
        {#if products.length > 0}
            <div class="product-grid">
                {#if $User.role === "admin"}
                    <AddProductCard/>
                {/if}
                {#each products as product}
                    <ProductCard product="{product}"/>
                {/each}
            </div>
        {:else}
            <p class="loading-text">No products found</p>
        {/if}
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
    }

    .filterbar-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .products-container {
        display: flex;
        justify-content: center;
        width: auto;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 3rem;
        width: auto;
        max-width: 1200px;
        margin: 0 auto;
    }

    .loading-text {
        text-align: center;
        font-size: 1.5rem;
        margin-top: 2rem;
    }

    .search-text {
        text-align: center;
    }

    .remove-search-button {
        align-self: center;
        padding-right: 1rem;
        padding-left: 1rem;
    }
</style>
