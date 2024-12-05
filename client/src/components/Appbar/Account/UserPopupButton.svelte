<script>
    export let isSignedIn;
    export let togglePopover;
</script>

<span>
    {#if isSignedIn}
        <img src="/assets/user.png" alt="Manage account" on:click={togglePopover} />
    {:else}
        <img src="/assets/noUser.png" alt="Sign in/up" on:click={togglePopover} />
    {/if}
</span>

<style>
    span {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    span img {
        height: 3rem;
        cursor: pointer;
    }
</style>
