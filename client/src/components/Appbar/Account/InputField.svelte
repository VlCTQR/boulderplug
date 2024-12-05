<script>
    export let label;
    export let value;
    export let error = "";
</script>

<div class="input-container">
    <input type="text" placeholder={label} bind:value={value} />
    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>

<style>
    .error {
        color: red;
        font-size: 0.9rem;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
</style>
