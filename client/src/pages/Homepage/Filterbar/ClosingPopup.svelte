<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedClosing = '';

    export let possibleClosingOptions = [];
    export let loading = true;

    const toggleClosingSelection = (closing) => {
        selectedClosing = selectedClosing === closing ? '' : closing;
        notifyChange();
    };

    const notifyChange = () => {
        dispatch('selectedClosingChange', {filter: {closing: selectedClosing} });
    }
</script>

<main>
    {#if loading}
        <p>Loading closing options...</p>
    {:else}
        <p>Closing:</p>
        {#each possibleClosingOptions as closing}
            <div class="closing-container">
                <input
                        type="checkbox"
                        id={closing}
                        checked={selectedClosing === closing}
                        on:change={() => toggleClosingSelection(closing)}
                />
                <label for={closing}>{closing}</label>
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

    .closing-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }
</style>
