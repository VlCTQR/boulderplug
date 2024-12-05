<script>
    import { calculateTimeLeft } from '../timeUtils.js';
    import {User} from '../../stores/UserStore.js';
    import { ProductList } from '../../stores/ProductListStore';
    import { FilteredProductList } from '../../stores/FilterStore';
    import {fetchWithAuth} from "../../serverRequest.js";
    import PopoverMenu from "../../components/PopoverMenu.svelte";

    export let product;

    let timeLeft = '';
    let customInput = false;
    let customBidAmount = '';
    export let bids = [];

    let showingPopover = false;
    let popoverPosition = { top: '40%', left: '40%' };
    let popoverMessage = '';

    const togglePopover = () => {
        showingPopover = !showingPopover;
    }

    const updateTime = () => {
        const result = calculateTimeLeft(product.dateOfSale);
        timeLeft = result.timeLeft;
    };

    updateTime();

    const increaseBid = async (amount) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            popoverMessage = 'You must be signed in to bid';
            togglePopover();
            return;
        }

        let currentBid;

        if (highestBid === null){
            currentBid = 0;
        } else {
            currentBid = highestBid.bid
        }

        try {
            const {response, data} = await fetchWithAuth(
                `products/${product.id}/bids`,
                'POST',
                authToken,
                {
                    bid: currentBid + amount
                }
            )

            if (response.ok) {
                product = data;
                ProductList.update(products => {
                    return products.map(p => p.id === product.id ? product : p);
                });
                FilteredProductList.update(products => {
                    return products.map(p => p.id === product.id ? product : p);
                });
            } else {
                popoverMessage = data.message;
                togglePopover();
            }
        } catch (error) {
            alert('An error occurred while trying to bid.');
            console.error(error);
        }

    };

    const submitCustomBid = () => {
        const amount = parseFloat(customBidAmount);
        if (!isNaN(amount)) {
            increaseBid(amount);
            customInput = false;
            customBidAmount = '';
        }
    };

    const cancelCustomInput = () => {
        customInput = false;
        customBidAmount = '';
    };

    $: highestBid = bids.length > 0 ? bids[0] : null;
</script>

<main>
    <div class="bid-info">
        {#if timeLeft === 'Auction ended' && highestBid}
            <div class="sold-body">
                <h1>Auction<br>Ended</h1>
                <div class="sold-info">
                    <p>Item won by:<br><strong>
                        {#if $User.id === highestBid.userId}
                            You
                        {:else}
                            {highestBid.userName}
                        {/if}
                    </strong></p>
                    <div class="current-bid">
                        <p class="bid-amount">${highestBid.bid}</p>
                    </div>
                </div>
            </div>
        {:else}
            <div class="info-body">
                <div class="current-bid">
                    {#if highestBid}
                        <p class="bid-amount">${highestBid.bid}</p>
                    {:else}
                        <p class="bid-amount">No bids yet</p>
                    {/if}
                </div>
                <div class="time-left">
                    <p class="time-left-text">{timeLeft}</p>
                </div>
            </div>

            <div class="increase-buttons">
                <p>Up by:</p>
                <div class="buttons">
                    {#if !customInput}
                        <button on:click={() => increaseBid(1)}>$1</button>
                        <button on:click={() => increaseBid(5)}>$5</button>
                        <button on:click={() => increaseBid(10)}>$10</button>
                        <button on:click={() => customInput = true}>Custom</button>
                    {:else}
                        <input type="number" bind:value={customBidAmount} placeholder="Enter increment" class="custom-input">
                        <button on:click={submitCustomBid}>Increase bid</button>
                        <button class="cancel-btn" on:click={cancelCustomInput}>X</button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <PopoverMenu
            isVisible={showingPopover}
            onClose={togglePopover}
            top={popoverPosition.top}
            left={popoverPosition.left}
    >
        <p>{popoverMessage}</p>
    </PopoverMenu>
</main>

<style>
    main {
        display: flex;
        justify-content: left;
        align-items: center;
        height: 100%;
    }

    .bid-info {
        background: var(--background-gradient);
        padding: 1rem;
        border-radius: var(--border-radius);
        width: 400px;
        text-align: left;
    }

    .info-body {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        gap: 2rem;
    }

    .sold-body {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 3rem;
    }

    .sold-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .sold-info strong {
        margin-bottom: 20px;
    }

    .current-bid, .time-left {
        padding: 10px;
        border-radius: 8px;
        width: 48%;
        text-align: center;
    }

    .current-bid {
        background-color: var(--enabled-color);
        color: white;
        border-radius: 10px;
        width: 130px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .time-left {
        background-color: #FF6347;
        color: white;
    }

    .time-left-text {
        font-weight: bold;
    }

    .bid-amount {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .increase-buttons {
        margin-top: 10px;
    }

    .buttons {
        display: flex;
        gap: 0.5rem;
    }

    button {
        background-color: #87CEEB;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-weight: bold;
    }

    button:hover {
        background-color: var(--active-button-bg);
    }

    .custom-input {
        width: max-content;
        padding: 5px 5px 5px 10px;
        margin-right: 5px;
        border-radius: 1rem;
    }

    .cancel-btn {
        background-color: var(--disabled-color);
        color: var(--text-color);
        padding: 5px 10px;
        border-radius: 5rem;
    }

    .cancel-btn:hover {
        background-color: var(--disabled-color-hover);
    }
</style>
