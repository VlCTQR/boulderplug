<script>
    import Filters from "./Filterbar/FiltersPopup.svelte";
    import PopoverMenu from "../../components/PopoverMenu.svelte";
    import BrandsPopup from "./Filterbar/BrandsPopup.svelte";
    import LevelPopup from "./Filterbar/LevelPopup.svelte";
    import ClosingPopup from "./Filterbar/ClosingPopup.svelte";
    import ToepatchPopup from "./Filterbar/ToepatchPopup.svelte";
    import ColorsPopup from "./Filterbar/ColorsPopup.svelte";
    import {createEventDispatcher, onMount} from 'svelte';
    import {fetchDefault} from "../../serverRequest.js";

    const dispatch = createEventDispatcher();

    export let filter = {};

    let filterOptions = {};
    let loading = true;

    let popoverPosition = { top: '0px', left: '0px' };
    const changePosition = event => {popoverPosition = { top: `${event.clientY}px`, left: `${event.clientX}px`}}

    let filtersShowPopover = false, brandsShowPopover = false, levelShowPopover = false, closingShowPopover = false, toepatchShowPopover = false, colorsShowPopover = false;

    const onButtonClick = (filterName, event) => {
        changePosition(event);
        switch (filterName) {
            case "filters": filtersShowPopover = !filtersShowPopover; break;
            case "brands": brandsShowPopover = !brandsShowPopover; break;
            case "level": levelShowPopover = !levelShowPopover; break;
            case "closing": closingShowPopover = !closingShowPopover; break;
            case "toepatch": toepatchShowPopover = !toepatchShowPopover; break;
            case "colors": colorsShowPopover = !colorsShowPopover; break;
        }
    };

    const notifyChange = (event) => {
        dispatch('filterChange', {filter: event.detail.filter});
    }

    const clearFilters = () => {
        dispatch('clearFilters');
    }

    const getFilterOptions = async () => {
        try{
            const { response, data } = await fetchDefault(
                'products/options',
                'GET',
                null,
            );
            if (!response.ok) {
                console.error("Error fetching product options:", data);
                return;
            }
            filterOptions = data;
        } catch (error) {
            console.error("Error fetching filter options:", error);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        getFilterOptions();
    });

    $: hasActiveFilters = filter.brands.length > 0 || filter.level || filter.closing || filter.toepatch || filter.colors.length > 0;
</script>

<main>
    <div class="filter-container {hasActiveFilters ? 'border' : ''}">
        <button class="filter-button" on:click={(e) => onButtonClick("filters", e)}>Filters</button>
        <PopoverMenu
                isVisible={filtersShowPopover}
                onClose={() => filtersShowPopover = false}
                top={popoverPosition.top}
                left={popoverPosition.left}>
            <Filters loading="{loading}" filterOptions="{filterOptions}" on:filterChange={notifyChange} on:clearFilters={clearFilters} filter={filter}></Filters>
        </PopoverMenu>

        <!-- Brands Button -->
        {#if filter.brands.length}
            <div class="custom-button-wrapper">
                <button class="custom-button" on:click={(e) => onButtonClick("brands", e)}>
                    {filter.brands.join(", ")}
                </button>
                <PopoverMenu
                        isVisible={brandsShowPopover}
                        onClose={() => brandsShowPopover = false}
                        top={popoverPosition.top}
                        left={popoverPosition.left}
                >
                    <BrandsPopup loading="{loading}" possibleBrands={filterOptions.brands} on:selectedBrandsChange={notifyChange} selectedBrands={filter.brands}></BrandsPopup>
                </PopoverMenu>
            </div>
        {/if}

        <!-- Level Button -->
        {#if filter.level}
            <div class="custom-button-wrapper">
                <button class="custom-button" on:click={(e) => onButtonClick("level", e)}>
                    {filter.level}
                </button>
                <PopoverMenu
                        isVisible={levelShowPopover}
                        onClose={() => levelShowPopover = false}
                        top={popoverPosition.top}
                        left={popoverPosition.left}
                >
                    <LevelPopup loading="{loading}" possibleLevels="{filterOptions.levels}" on:selectedLevelChange={notifyChange} selectedLevel={filter.level}></LevelPopup>
                </PopoverMenu>
            </div>
        {/if}

        <!-- Closing Button -->
        {#if filter.closing}
            <div class="custom-button-wrapper">
                <button class="custom-button" on:click={(e) => onButtonClick("closing", e)}>
                    {filter.closing}
                </button>
                <PopoverMenu
                        isVisible={closingShowPopover}
                        onClose={() => closingShowPopover = false}
                        top={popoverPosition.top}
                        left={popoverPosition.left}
                >
                    <ClosingPopup loading="{loading}" possibleClosingOptions="{filterOptions.closing}" on:selectedClosingChange={notifyChange} selectedClosing={filter.closing}></ClosingPopup>
                </PopoverMenu>
            </div>
        {/if}

        <!-- Toe Patch Button -->
        {#if filter.toepatch !== null}
            <div class="custom-button-wrapper">
                <button class="custom-button" on:click={(e) => onButtonClick("toepatch", e)}>
                    {filter.toepatch ? 'Toe Patch' : 'No Toe Patch'}
                </button>
                <PopoverMenu
                        isVisible={toepatchShowPopover}
                        onClose={() => toepatchShowPopover = false}
                        top={popoverPosition.top}
                        left={popoverPosition.left}
                >
                    <ToepatchPopup on:selectedToepatchChange={notifyChange} toepatch={filter.toepatch}></ToepatchPopup>
                </PopoverMenu>
            </div>
        {/if}

        <!-- Colors Button -->
        {#if filter.colors.length}
            <div class="custom-button-wrapper">
                <button class="color-button" on:click={(e) => onButtonClick("colors", e)}>
                    {#each filter.colors as color}
                        <div class="color-dot {color}"></div>
                    {/each}
                </button>
                <PopoverMenu
                        isVisible={colorsShowPopover}
                        onClose={() => colorsShowPopover = false}
                        top={popoverPosition.top}
                        left={popoverPosition.left}
                >
                    <ColorsPopup loading="{loading}" possibleColors="{filterOptions.colors}" on:selectedColorsChange={notifyChange} selectedColors={filter.colors}></ColorsPopup>
                </PopoverMenu>
            </div>
        {/if}
    </div>
</main>

<style>

    .filter-container {
        display: inline-flex;
        gap: 0.5rem;
        padding-top: 0.4rem;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
        background-color: var(--background-color);
        margin-top: 1rem;
        transition: border 0.3s;
    }

    .filter-container.border {
        border: 3px solid var(--border-color);
        border-radius: var(--border-radius);
    }

    .custom-button, .color-button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--background-gradient);
        color: var(--text-color);
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .custom-button:hover, .color-button:hover {
        background: var(--primary-color-hover);
    }

    .filter-button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: linear-gradient(180deg, #e4e4e4, var(--active-button-bg));
        color: var(--text-color);
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .filter-button:hover {
        background: var(--active-button-bg);
    }

    .color-dot {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        border: none;
        margin-left: 0.5rem;
    }

    .color-button {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem 0.5rem 0.5rem;
    }

    .red { background: linear-gradient(180deg, red, #e4e4e4); }
    .blue { background: linear-gradient(180deg, blue, #e4e4e4 ); }
    .orange { background: linear-gradient(180deg, orange, #e4e4e4); }
    .green { background: linear-gradient(180deg, green, #e4e4e4); }
    .yellow { background: linear-gradient(180deg, yellow, #e4e4e4); }
    .black { background: linear-gradient(180deg, black, #e4e4e4); }
    .white { background: linear-gradient(180deg, white, #e4e4e4); }
</style>


