<script>
    import Logo from "./Appbar/Logo.svelte";
    import Navigation from "./Appbar/Navigation.svelte";
    import Searchbar from "./Appbar/Searchbar.svelte";

</script>

<main>
    <div class="left">
        <Navigation />
    </div>
    <div class="center">
        <Logo />
    </div>
    <div class="right">
        <Searchbar />
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 10vh;
        background: var(--background-gradient);
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 16px;
        box-sizing: border-box;
    }

    .left, .right {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .left {
        justify-content: flex-start;
    }

    .right {
        justify-content: flex-end;
    }

    .center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
