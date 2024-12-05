<script>
    import { onMount } from "svelte";
    import {User} from '../../stores/UserStore.js';
    import {ProductList} from "../../stores/ProductListStore.js";

    export let product;

    $: ProductList.subscribe(products => {
        product = products.find(p => p.id === Number(product.id));
    });

    export let bids = [];
    let loading = true;

    onMount(() => {
        if (bids.length > 0) {
            loading = false;
        }
    });

    $: if (bids.length > 0) {
        loading = false;
    }


</script>

<main>
    <h1>History</h1>
    <div class="bidding-history">
        {#if loading}
            <p>Loading...</p>
            {:else}
        {#each bids as bid}
            <div class="bid-entry">
                <div class="bid-info">
                    {#if $User.id === bid.userId}
                        <span class="user-name">You</span>
                    {:else}
                        <span class="user-name">{bid.userName}</span>
                    {/if}
                    <span class="bid-amount">${bid.bid}</span>
                </div>
            </div>
        {/each}
        {/if}
    </div>
</main>

<style>
    main {
        max-width: 300px;
        width: 150px;
    }

    h1 {
        font-size: 1.2em;
        margin-bottom: 10px;
        font-weight: bold;
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 5px;
    }

    .bidding-history {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
    }

    .bid-entry {
        display: flex;
        background: var(--background-gradient);
        border-radius: var(--border-radius);
        padding: 10px;
        margin-right: 10px;
        box-shadow: var(--box-shadow);
    }

    .bid-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 1em;
    }

    .user-name {
        font-weight: bold;
    }

    .bid-amount {
        font-weight: bold;
    }
</style>
