<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedBrands = [];

    export let possibleBrands = [];
    export let loading = true;

    const toggleBrandSelection = (brand) => {
        if (selectedBrands.includes(brand)) {
            selectedBrands = selectedBrands.filter(b => b !== brand);
        } else {
            selectedBrands = [...selectedBrands, brand];
        }
        notifyChange();
    };

    const notifyChange = () => {
        dispatch('selectedBrandsChange', {filter: {brands: selectedBrands} });
    }
</script>

<main>
    {#if loading}
        <p>Loading brands...</p>
    {:else}
        <p>Brands:</p>
        {#each possibleBrands as brand}
            <div class="brand-container">
                <input
                        type="checkbox"
                        id={brand}
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        on:change={() => toggleBrandSelection(brand)}
                />
                <label for={brand}>{brand}</label>
            </div>
        {/each}
    {/if}
</main>

<style>
    main {
        padding-right: 1rem;
    }

    p {
        font-weight: bold;
    }

    .brand-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }
</style>
