<script>
    export let productDescription;
    let showDescription = false;

    const toggleDescription = () => {
        showDescription = !showDescription;
    };
</script>

<main>
    <div class="description-container">
        <button on:click={toggleDescription} class="description-button">
            <span>Description</span>
            <div class="triangle" class:rotate={showDescription}></div>
        </button>

        {#if showDescription}
            <div class="description-text">
                <p>{productDescription}</p>
            </div>
        {/if}
    </div>
</main>

<style>
    .description-container {
        margin-top: 50px;
        width: 60%;
    }

    .description-button {
        width: 100%;
        border: none;
        background: none;
        border-bottom: 3px solid var(--border-color);
        border-radius: 0;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        cursor: pointer;
    }

    .description-button span {
        font-weight: bold;
    }

    .description-button:focus {
        outline: none;
    }

    .triangle {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid black;
        transition: transform 0.3s ease;
    }

    .rotate {
        transform: rotate(180deg);
    }

    .description-text {
        margin-top: 10px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 5px;
        box-shadow: var(--box-shadow);
    }
</style>
