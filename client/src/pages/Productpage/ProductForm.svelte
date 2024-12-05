<script>
    import InputField from "../../components/Appbar/Account/InputField.svelte";
    import {fetchDefault, fetchWithAuth} from "../../serverRequest.js";
    import {createEventDispatcher, onMount} from "svelte";
    import {ProductList} from "../../stores/ProductListStore.js";
    import {FilteredProductList} from "../../stores/FilterStore.js";

    const dispatch = createEventDispatcher();

    export let title;

    export let product;

    export let isUpdating = false;

    let hover = [];

    let date = "";
    let time = "";

    let productOptions = {};
    let loadingOptions = true;
    let customBrand = false;
    let newBrand = "";
    let imageLink = "";

    let errors = {};

    const getProductOptions = async () => {
        try {
            const { response, data } = await fetchDefault(
                'products/options',
                'GET',
                null
            );
            if (!response.ok) {
                console.error("Error fetching product options:", data);
                return;
            }
            productOptions = data;
        } catch (error) {
            console.error("Error fetching product options:", error);
        } finally {
            loadingOptions = false;
        }
    };

    const toggleColor = (color) => {
        if (product.colors.includes(color)) {
            product.colors = product.colors.filter(c => c !== color);
        } else {
            product.colors.push(color);
        }
    };

    const addImageLink = () => {
        if (imageLink) {
            product.images.push(imageLink);
            product.images = product.images;
            imageLink = "";
        }
    };

    const deleteImage = (image) => {
        product.images = product.images.filter(img => img !== image);
    };

    const formatDateTime = () => {
        // format (YYYY-MM-DDTHH:MM:SSZ)
        const dateParts = date.split('/');
        const timeParts = time.split(':');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:00Z`;
    };

    const validateProduct = () => {
        errors = {};

        if (!product.name) {
            errors.name = "Enter a product name";
        }
        if (!product.brand) {
            errors.brand = "Select a brand";
        }

        if (!product.description || product.description.trim() === "") {
            errors.description = "Enter a description";
        }

        if (!product.level) {
            errors.level = "Select a level";
        }

        if (!product.closing) {
            errors.closing = "Select a type of closing";
        }

        if (product.colors.length === 0) {
            errors.colors = "Select at least one color";
        }

        if (product.images.length === 0) {
            errors.images = "Add at least one image";
        }

        if (date.trim() === "") {
            errors.date = "Enter a date";
        } else {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(date)) {
                errors.date = "Not a valid date (dd/MM/yyyy)";
            } else {
                const enteredDate = new Date(date.split('/').reverse().join('-'));

                const currentDate = new Date();

                if (enteredDate <= currentDate) {
                    errors.date = "Date must be in the future";
                }
            }
        }

        if (time.trim() === "") {
            errors.time = "Enter a time";
        } else {
            const timeRegex = /^\d{2}:\d{2}$/;
            if (!timeRegex.test(time)) {
                errors.time = "Not a valid time (hh:mm)";
            }
        }

        product.dateOfSale = formatDateTime();

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateProduct()) {
            const authToken = localStorage.getItem('authToken');
            try {
                if (isUpdating){
                    const { response, data } = await fetchWithAuth(
                        'products/' + product.id,
                        'PUT',
                        authToken,
                        product
                    );
                    if (!response.ok) {
                        console.error("Error updating product:", data);
                        alert("Error updating product: " + data.error);
                        return;
                    }
                    console.log("Product updated successfully:", data);
                    alert("Product updated successfully");

                    FilteredProductList.update(products => {
                        return products.map(p => p.id === data.id ? data : p);
                    });

                    ProductList.update(products => {
                        return products.map(p => p.id === data.id ? data : p);
                    });

                    // await fetchProducts();
                    // await fetchProductsExternal();

                    dispatch("productUpdated");
                } else {
                    const { response, data } = await fetchWithAuth(
                        'products',
                        'POST',
                        authToken,
                        product
                    );
                    if (!response.ok) {
                        console.error("Error adding product:", data);
                        alert("Error adding product: " + data.error);
                        return;
                    }
                    console.log("Product added successfully:", data);
                    alert("Product added successfully");

                    FilteredProductList.update(products => {
                        return products.concat(data);
                    });

                    ProductList.update(products => {
                        return products.concat(data);
                    });

                    dispatch("productAdded");
                }
            } catch (error) {
                console.error("Error adding/updating product:", error);
                alert("Error adding/updating product: " + error);
            }
        }
    };

    onMount(() => {
        getProductOptions();

        if (isUpdating && product.dateOfSale) {
            const dateObj = new Date(product.dateOfSale);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getUTCHours()).padStart(2, '0');
            const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

            date = `${day}/${month}/${year}`;
            time = `${hours}:${minutes}`;
        }
    });

</script>

<main class="popup-content">
    <div class="product-form">
        <h1>{title}</h1>

        <form on:submit|preventDefault={addImageLink}>
            <!-- Name Field -->
            <label for="name">Name:</label>
            <InputField label="Enter product name" bind:value={product.name} error={errors.name}/>

            <!-- Description Field -->
            <label for="description">Description:</label>
            <textarea name="description" id="description" cols="30" rows="1" bind:value={product.description}></textarea>
            {#if errors.description}
                <p class="error">{errors.description}</p>
            {/if}

            <br/>
            <br/>

            <!-- Brand Selection -->
            <label for="brand">Select Brand:</label>
            {#if loadingOptions}
                <p>Loading options...</p>
            {:else}
                <select bind:value={product.brand} on:change="{() => customBrand = product.brand === 'Other'}">
                    <option value="" disabled>Select a brand</option>
                    {#each productOptions.brands as brand}
                        <option value={brand}>{brand}</option>
                    {/each}
                    <option value="Other">Other</option>
                </select>

            {/if}

            {#if customBrand}
                <label for="newBrand">Enter New Brand:</label>
                <input type="text" id="newBrand" bind:value={newBrand} placeholder="Enter a new brand" on:input="{() => product.brand = newBrand}" />
            {/if}
            {#if errors.brand}
                <p class="error">{errors.brand}</p>
            {/if}

            <!-- Level Selection -->
            <label for="level">Select Level:</label>
            {#if loadingOptions}
                <p>Loading levels...</p>
            {:else}
                <select bind:value={product.level}>
                    <option value="" disabled>Select a level</option>
                    {#each productOptions.levels as level}
                        <option value={level}>{level}</option>
                    {/each}
                </select>
                {#if errors.level}
                    <p class="error">{errors.level}</p>
                {/if}
            {/if}

            <!-- Closing Type Selection -->
            <label for="closing">Select Closing Type:</label>
            {#if loadingOptions}
                <p>Loading closing types...</p>
            {:else}
                <select bind:value={product.closing}>
                    <option value="" disabled>Select closing type</option>
                    {#each productOptions.closing as closingType}
                        <option value={closingType}>{closingType}</option>
                    {/each}
                </select>
                {#if errors.closing}
                    <p class="error">{errors.closing}</p>
                {/if}
            {/if}

            <!-- Toepatch selection -->
            <label for="toepatch">Select Toepatch:</label>
            <select bind:value={product.toepatch}>
                <option value="" disabled>Select a toepatch</option>
                    <option value={false}>No toepatch</option>
                    <option value={true}>Toepatch</option>
            </select>

            <!-- Color Selection -->
            <label for="colors">Select Colors:</label>
            {#if loadingOptions}
                <p>Loading colors...</p>
            {:else}
                <div class="color-selection">
                    {#each productOptions.colors as color}
                        <div class="color-option">
                            <input
                                    type="checkbox"
                                    id={color}
                                    value={color}
                                    checked={product.colors.includes(color)}
                                    on:change={() => toggleColor(color)} />
                            <label for={color}>{color}</label>
                        </div>
                    {/each}
                </div>
                {#if errors.colors}
                    <p class="error">{errors.colors}</p>
                {/if}
            {/if}

            <br/>
            <br/>

            <!-- Image Link Input -->
            <label for="imageLink">Image Link:</label>
            <input type="text" id="imageLink" bind:value={imageLink} placeholder="Enter image URL" />
            <button type="button" on:click={addImageLink}>Upload</button>

            {#if errors.imageLink}
                <p class="error">{errors.images}</p>
            {/if}

            <!-- Display Images -->
            <div class="image-preview">
                {#each product.images as image, i}  <div class="image-container">
                    <img src={image} alt="Product Image" class="product-image" />
                    <div
                            class="overlay"
                            role="button"
                            aria-label="Delete image"
                            on:mouseenter={() => hover[i] = true}  on:mouseleave={() => hover[i] = false}
                            on:click={() => deleteImage(image)}
                            tabindex="0"
                    >
                        <span class="delete-icon">X</span>
                    </div>
                </div>
                {/each}
            </div>

            <br/>
            <br/>

            <!-- Date of sale field -->
            <h3>When does the auction end?</h3>
            <label for="date">Date (dd/MM/yyyy):</label>
            <InputField label="Enter date" bind:value={date} error={errors.date} />

            <label for="time">Time (hh:mm):</label>
            <InputField label="Enter time" bind:value={time} error={errors.time} />

            <br/>
            <br/>

            <div class="submit-button">
                {#if isUpdating}
                    <button on:click={handleSubmit}>Update Product</button>
                {:else}
                <button on:click={handleSubmit}>Upload Product</button>
                {/if}
            </div>

        </form>
    </div>
</main>

<style>
    .popup-content {
        height: 80vh; /* Use a percentage of the viewport height */
        overflow-y: auto; /* Enable scrolling for the popup if necessary */
        display: flex; /* Flexbox layout for centering */
        justify-content: center; /* Center content */
        align-items: flex-start; /* Align to the start for better visual layout */
        padding: 1rem; /* Add some padding for aesthetics */
    }

    .product-form {
        flex: 1; /* Allow the form to grow and fill available space */
        display: flex;
        flex-direction: column;
        align-items: stretch; /* Stretch to fill the available width */
        justify-content: flex-start; /* Align items to the top */
        margin-top: 1rem; /* Spacing from top */
        max-height: 90vh; /* Limit height for the form */
        padding: 1rem; /* Padding inside the form */
    }

    .error {
        color: red;
        font-size: 0.9rem;
    }

    .submit-button {
        display: flex;
        justify-content: center;
    }

    /* Remove unnecessary overflow from the main form */
    form {
        width: 100%;
    }

    select, input[type="text"], textarea {
        padding: 0.5rem;
        margin-bottom: 1rem;
        width: 100%;
    }

    textarea {
        resize: vertical;
        margin: 0;
    }

    .color-selection {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .color-option {
        display: flex;
        align-items: center;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }

    .image-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .image-container {
        position: relative;
        display: inline-block;
    }

    .product-image {
        width: 100px; /* Adjust size as needed */
        height: auto;
        border: 1px solid #ccc; /* Optional styling */
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        cursor: pointer;
        opacity: 0; /* Initially hidden */
        transition: opacity 0.2s ease-in-out; /* Smooth transition on hover */
    }

    .image-container:hover .overlay {
        opacity: 1; /* Show overlay on hover */
    }

    .delete-icon {
        color: white;
        font-weight: bold;
    }
</style>
