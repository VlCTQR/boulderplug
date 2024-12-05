<script>
    import { onDestroy } from "svelte";
    import router from 'page';
    import { calculateTimeLeft } from '../timeUtils.js';
    import { User } from "../../stores/UserStore.js";
    import PopoverMenu from "../../components/PopoverMenu.svelte";
    import {fetchWithAuth} from "../../serverRequest.js";
    import {ProductList} from "../../stores/ProductListStore.js";
    import {FilteredProductList} from "../../stores/FilterStore.js";
    import ProductForm from "../Productpage/ProductForm.svelte";

    export let product;

    let timeLeft = '';
    let timeClass = '';
    let priceLabel = '';

    let errorMessage = '';
    let showingErrorPopup = false;

    let popoverPosition = { top: '0px', left: '0px' };
    const changePosition = event => {popoverPosition = { top: `${event.clientY}px`, left: `${event.clientX}px`}}

    const updateTime = () => {
        const result = calculateTimeLeft(product.dateOfSale);
        timeLeft = result.timeLeft;
        timeClass = result.timeClass;
        priceLabel = result.priceLabel;
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });

    const goToAuction = () => {
        router(`/products/${product.id}`);
    };

    const closeErrorPopup = () => {
        showingErrorPopup = false;
        errorMessage = '';
    }

    const showErrorPopup = (message) => {
        errorMessage = message;
        showingErrorPopup = true;
    }

    const deleteProduct = async (event) => {
        changePosition(event);
        const role = $User.role;
        if (role === 'admin') {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                showErrorPopup("You must be signed in as an admin to delete a product");
            }

            try {
                const {response, data} = await fetchWithAuth(
                    `products/${product.id}`,
                    'DELETE',
                    authToken
                );
                if (response.ok) {

                    FilteredProductList.update(products => {
                        return products.filter(p => p.id !== product.id);
                    });
                    ProductList.update(products => {
                        return products.filter(p => p.id !== product.id);
                    });
                    // await fetchProducts();
                    // await fetchProductsExternal();
                } else {
                    showErrorPopup("Couldn't delete product: " + data.error);
                }
            } catch (e) {
                showErrorPopup("Couldn't delete product: " + e);
            }
        } else {
            showErrorPopup("You must be signed in as an admin to delete a product");
        }
    }

    let showingEditPopup = false;

    const closeEditPopup = () => {
        showingEditPopup = false;
    }

    const editProduct = (event) => {
        event.stopPropagation();
        showingEditPopup = true;
    }
</script>

<main class="product-card" on:click={goToAuction} on:keydown={goToAuction}>
    {#if $User.role === 'admin'}
        <!-- Delete button -->
        <button class="icon-btn" on:click|stopPropagation="{(e) => deleteProduct(e)}">
            <img src="/assets/trash-can.png" alt="Delete" />
        </button>

        <!-- Edit button -->
        <button class="icon-btn edit-btn" on:click|stopPropagation="{(e) => editProduct(e)}">
            <img src="/assets/edit.png" alt="Edit" />
        </button>
    {/if}

    <PopoverMenu
        isVisible={showingEditPopup}
        onClose={closeEditPopup}
        top='1.5%'
        left='40%'
    >
        <ProductForm isUpdating={true} product={product} on:productUpdated={closeEditPopup} title="Edit product" />
    </PopoverMenu>

    {#if showingErrorPopup}
        <PopoverMenu top={popoverPosition.top} left={popoverPosition.left}> isVisible={showingErrorPopup} onClose={closeErrorPopup}>
            <h2>{errorMessage}</h2>
        </PopoverMenu>
    {/if}

    <div class="product-image">
        <img src={product.images[0]} alt={product.name} />
    </div>
    <div class="product-details">
        <h3>{product.name}</h3>
        <p>{priceLabel}: <span class="price">
            {#if product.bids && product.bids[0] && product.bids[0].bid}
                ${product.bids[0].bid.toFixed(2)}
            {:else}
                $0.00
            {/if}
        </span></p>
        <p>Time left: <span class={`time-left ${timeClass}`}>{timeLeft}</span></p>
    </div>
    <button class="auction-btn" on:click={goToAuction}>Go to auction</button>
</main>



<style>
    .product-card {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 2fr auto;
        align-items: center;
        background-color: #f0f0f0;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        gap: 1rem;
        width: auto;
    }

    .icon-btn {
        position: absolute;
        top: -30px;
        left: -30px;
        background-color: var(--disabled-color-hover);
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .edit-btn {
        top: 40px;
        left: -30px;
        background-color: var(--active-button-bg);
    }

    .icon-btn img {
        width: 20px;
        height: 20px;
    }

    .product-image img {
        height: 100px;
        width: auto;
        border-radius: 8px;
    }

    .product-details {
        display: flex;
        flex-direction: column;
    }

    h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    p {
        margin: 0.5rem 0;
    }

    .price {
        color: var(--enabled-color);
        font-weight: bold;
    }

    .time-left.days {
        color: #E4D00A;
    }

    .time-left.hours {
        color: #F08000;
    }

    .time-left.minutes {
        color: #e74c3c;
    }

    .time-left.seconds {
        color: #e74c3c;
    }

    .time-left.ended {
        color: gray;
    }

    .time-left {
        font-weight: bold;
    }

    .auction-btn {
        background-color: var(--active-button-bg);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        justify-self: center;
    }

    .auction-btn:hover {
        background-color: var(--active-button-bg-hover);
    }
</style>
