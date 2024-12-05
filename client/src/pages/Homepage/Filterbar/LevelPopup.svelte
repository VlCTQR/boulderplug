<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedLevel = '';

    export let possibleLevels = [];
    export let loading = true;

    const toggleLevelSelection = (level) => {
        selectedLevel = selectedLevel === level ? '' : level;
        notifyChange();
    };

    const notifyChange = () => {
        dispatch('selectedLevelChange', {filter: {level: selectedLevel} });
    }

</script>

<main>
    {#if loading}
        <p>Loading levels...</p>
    {:else}
        <p>Levels:</p>
        {#each possibleLevels as level}
            <div class="level-container">
                <input
                        type="checkbox"
                        id={level}
                        checked={selectedLevel === level}
                        on:change={() => toggleLevelSelection(level)}
                />
                <label for={level}>{level}</label>
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

    .level-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }
</style>
