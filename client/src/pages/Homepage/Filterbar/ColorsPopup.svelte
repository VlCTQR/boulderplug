<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedColors = [];
    export let possibleColors = [];
    export let loading = true;

    const toggleColorSelection = (color) => {
        if (selectedColors.includes(color)) {
            selectedColors = selectedColors.filter(c => c !== color);
        } else {
            selectedColors = [...selectedColors, color];
        }
        notifyChange();
    };

    const notifyChange = () => {
        dispatch('selectedColorsChange', {filter: {colors: selectedColors} });
    }

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<main>
    {#if loading}
        <p>Loading colors...</p>
    {:else}
        <p>Colors:</p>
        {#each possibleColors as color}
            <div class="color-container">
                <input
                        type="checkbox"
                        id={color}
                        value={color}
                        checked={selectedColors.includes(color)}
                        on:change={() => toggleColorSelection(color)}
                />
                <label for={color}>{capitalize(color)}</label>
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

    .color-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }
</style>
