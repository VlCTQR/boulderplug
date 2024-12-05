<script>
 import {fetchDefault} from "../../serverRequest.js";
 import {FilteredProductList, SearchQuery} from "../../stores/FilterStore.js";

 let searchValue = '';
 
 const handleSearch = async () => {
     if (searchValue === '') {
         return;
     }
     let preparedSearch = searchValue.replace(/\s/g, '+');
     try {
         const {response, data} = await fetchDefault(
             'products?search=' + preparedSearch,
             'GET',
             null
         );

         if (response.ok) {
             console.log("Search results:", data);
             FilteredProductList.set(data);
             SearchQuery.set(searchValue);
             searchValue = '';
         } else {
             console.error("Error searching products:", data);
             FilteredProductList.set([]);
         }
     } catch (error) {
         console.error("Error searching products:", error);
         FilteredProductList.set([]);
     }
 }

 const handleKeyDown = (event) => {
     if (event.key === 'Enter') {
         handleSearch();
     }
 };
</script>

<main>
    <span>
        <input type="text" placeholder="Search products" bind:value={searchValue} on:keydown="{handleKeyDown}">
        <img src="/assets/search.png" alt="search" on:click="{handleSearch}" on:keydown="{handleSearch}">
    </span>
</main>

<style>
    span {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    input {
        height: 2.5rem;
        font-size: 1.2rem;
        padding: 0.8rem;
        border: 4px solid var(--border-color);
        border-radius: var(--border-radius);
        outline: none;
    }

    img {
        height: 3rem;
        margin-top: -1rem;
    }
</style>