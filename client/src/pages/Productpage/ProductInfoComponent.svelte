<script>
    import AuctionComponent from "./AuctionComponent.svelte";
    import DescriptionComponent from "./DescriptionComponent.svelte";
    import BiddingHistory from "./BiddingHistory.svelte";
    import {onMount} from "svelte";
    import {fetchDefault} from "../../serverRequest.js";
    import { fetchProducts } from '../../stores/ProductListStore';
    import { fetchProductsExternal } from '../../stores/FilterStore';

    export let product;
    let bids = [];
    let loading = true;

    async function getBids() {
        try {
            const {response , data } = await fetchDefault(
                `products/${product.id}/bids`,
                'GET'
            );
            // const response = await fetch(`http://localhost:3000/products/${product.id}/bids`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json',
            //     },
            // });
            // const data = await response.json();
            if (response.ok) {
                bids = data;
                loading = false;
            } else {
                console.error("Couldn't load bids: " + data.error);
            }

        } catch (e) {
            console.error("Couldn't load bids: " + e);
        }

    }


    async function subscribeToBids() {
        const { response, data } = await fetchDefault(`products/${product.id}/bid/subscribe`, 'POST');

        if (!response.ok) {
            console.error("Subscription failed:", await response.json());
            return;
        }

        const { channelId } = data;

        console.log("Subscribed to channel:", channelId);

        const eventSource = new EventSource(`http://localhost:3000/products/${product.id}/bid/${channelId}`);

        eventSource.addEventListener("message", event => {
            console.log("Bid received:", event.data);
            bids = [JSON.parse(event.data), ...bids];
            fetchProducts();
            fetchProductsExternal();
        });

        console.log("Now listening to channel:", channelId);

        eventSource.addEventListener("error", event => {
            console.error("SSE error", event);
            eventSource.close();
        });

        return () => eventSource.close();
    }

    onMount(() => {
        getBids();
        subscribeToBids();
    });
</script>

<main>
    <h1>{product.name}</h1>
    <p>{product.brand}</p>
    {#if loading}
        <p>Loading...</p>
    {:else}
    <div class="auction-bidding-container">
        <AuctionComponent bids={bids} product={product}></AuctionComponent>
        <BiddingHistory bids={bids} product={product}></BiddingHistory>
    </div>
    {/if}

    <DescriptionComponent productDescription={product.description}></DescriptionComponent>
</main>

<style>
    h1 {
        margin-bottom: 0.2rem;
    }

    p {
        margin-top: 0;
        margin-bottom: 3rem;
    }

    .auction-bidding-container {
        display: flex;
        gap: 2rem;
    }

</style>
