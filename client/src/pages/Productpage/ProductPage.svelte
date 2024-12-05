<script>
    import ImagesComponent from "./ImagesComponent.svelte";
    import ProductInfoComponent from "./ProductInfoComponent.svelte";
    import { ProductList } from '../../stores/ProductListStore';

    export let productId;

    let product = null;
    let loading = true;

    $: ProductList.subscribe(products => {
        product = products.find(p => p.id === Number(productId));
        loading = false;
    });

    $: if (!product && !loading) {
        console.error(`Product with ID ${productId} not found`);
    }

</script>


<main>
    {#if loading}
        <p>Loading product...</p>
    {:else if product}
        <div class="product-layout">
            {#if product.images}
                <div class="images-container">
                    <ImagesComponent images={product.images} />
                </div>
            {:else}
                <p>No images available.</p>
            {/if}
            <div class="info-container">
                <ProductInfoComponent product={product}></ProductInfoComponent>
            </div>
        </div>
    {:else}
        <p>Product not found</p>
    {/if}
</main>

<style>
    main {
        padding: 3rem;
    }

    .product-layout {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
    }

    .images-container,
    .info-container {
        flex: 1;
        max-width: 50%;
    }

    @media (max-width: 768px) {
        .product-layout {
            flex-direction: column;
        }

        .images-container,
        .info-container {
            max-width: 100%;
        }
    }
</style>
