<script>
    import BrandsPopup from "./BrandsPopup.svelte";
    import LevelPopup from "./LevelPopup.svelte";
    import ClosingPopup from "./ClosingPopup.svelte";
    import ToepatchPopup from "./ToepatchPopup.svelte";
    import ColorsPopup from "./ColorsPopup.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let filter = {};
    export let filterOptions = {};
    export let loading = true;

    const notifyChange = (event) => {
        dispatch('filterChange', {filter: event.detail.filter});
    }

    const removeAllFilters = () => {
        //filter = {};
        dispatch('clearFilters');
    };
</script>

<main>
    <button class="remove-filters-button" on:click={removeAllFilters}>
        Remove all filters
    </button>
    <div class="popup-container">
        <BrandsPopup loading="{loading}" possibleBrands={filterOptions.brands} on:selectedBrandsChange={notifyChange} selectedBrands={filter.brands}></BrandsPopup>
        <LevelPopup loading="{loading}" possibleLevels="{filterOptions.levels}" on:selectedLevelChange={notifyChange} selectedLevel={filter.level}></LevelPopup>
        <ClosingPopup loading="{loading}" possibleClosingOptions="{filterOptions.closing}" on:selectedClosingChange={notifyChange} selectedClosing={filter.closing}></ClosingPopup>
        <ToepatchPopup on:selectedToepatchChange={notifyChange} toepatch={filter.toepatch}></ToepatchPopup>
        <ColorsPopup loading="{loading}" possibleColors="{filterOptions.colors}" on:selectedColorsChange={notifyChange} selectedColors={filter.colors}></ColorsPopup>
    </div>
</main>

<style>
    .popup-container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .remove-filters-button {
        background-color: var(--disabled-color);
        color: black;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
    }

    .remove-filters-button:hover {
        background-color: var(--disabled-color-hover);
    }
</style>
