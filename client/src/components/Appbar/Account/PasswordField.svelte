<script>
    export let value;
    export let error = "";
    export let label = "";
    let passwordVisible = false;

    const togglePasswordVisibility = () => {
        passwordVisible = !passwordVisible;
    };
</script>

<div class="password-container">
    {#if passwordVisible}
        <input type="text" placeholder="Password" bind:value={value} />
    {:else}
        <input type="password" placeholder={label} bind:value={value} />
    {/if}

    <button class="toggle-visibility" on:click={togglePasswordVisibility}>
        <img src={passwordVisible ? '/assets/eye-open.png' : '/assets/eye-closed.png'} alt="Toggle visibility" />
    </button>

    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>

<style>
    .password-container {
        position: relative;
        width: 100%;
    }

    .toggle-visibility {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
    }

    .toggle-visibility img {
        width: 20px;
        height: 20px;
    }

    .error {
        color: red;
        font-size: 0.9rem;
        width: 190px;
        white-space: normal;
        word-wrap: break-word;
    }
</style>