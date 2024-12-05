<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let toepatch;
    let withToepatch = toepatch;
    let withoutToepatch = !toepatch;

    console.log(withoutToepatch);

    // Handle change for both checkboxes
    const handleToepatchChange = (isWith) => {
        if (isWith) {
            withToepatch = true;
            withoutToepatch = false; // Uncheck the other checkbox
            toepatch = true; // Set to true
        } else {
            withoutToepatch = true;
            withToepatch = false; // Uncheck the other checkbox
            toepatch = false; // Set to false
        }
        notifyChange();
    };

    const notifyChange = () => {
        dispatch('selectedToepatchChange', {filter: {toepatch: toepatch}});
    };
</script>

<main>
    <p>Toe Patch:</p>
    <div class="toepatch-container">
        <input
                type="checkbox"
                id="with-toepatch"
                bind:checked={withToepatch}
                on:change={() => handleToepatchChange(true)}
        />
        <label for="with-toepatch">With Toe Patch</label>
    </div>

    <div class="toepatch-container">
        <input
                type="checkbox"
                id="without-toepatch"
                bind:checked={withoutToepatch}
                on:change={() => handleToepatchChange(false)}
        />
        <label for="without-toepatch">Without Toe Patch</label>
    </div>
</main>

<style>
    main {
        padding-right: 1rem;
    }

    p {
        font-weight: bold;
    }

    .toepatch-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }

    label {
        margin-right: 1rem;
    }
</style>
