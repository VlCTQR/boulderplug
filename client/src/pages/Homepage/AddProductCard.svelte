<script>
    import PopoverMenu from "../../components/PopoverMenu.svelte";
    import ProductForm from "../Productpage/ProductForm.svelte";

    let showingAddProductPopup = false;

    let product = {
        name: "",
        description: "",
        brand: "",
        level: "",
        closing: "",
        colors: [],
        images: [],
    };

    const showAddProductPopup = () => {
        showingAddProductPopup = true;
    }

    const closeAddProductPopup = () => {
        showingAddProductPopup = false;
    }

</script>

<div tabindex="0" role="button" class="add-product-card" on:click={showAddProductPopup} on:keydown={showAddProductPopup}>
    <h1>+</h1>

    <PopoverMenu
            isVisible={showingAddProductPopup}
            onClose={closeAddProductPopup}
            top='1.5%'
            left='40%'
    >
        <ProductForm product={product} on:productAdded={closeAddProductPopup} title="Add product"/>
    </PopoverMenu>
</div>

<style>
    .add-product-card {
        border: 3px dashed var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        box-shadow: var(--box-shadow);
    }

    .add-product-card h1 {
        margin-top: 50px;
        font-size: 5rem;
        color: var(--border-color);
    }
</style>