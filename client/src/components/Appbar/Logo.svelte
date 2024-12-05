<script>
    import router from 'page';

    const goToHomepage = () => {
        router('/');
    }
</script>

<main>
        <span on:click="{goToHomepage}" on:keydown="{goToHomepage}">
            <img src="/assets/logo.png" alt="logo">
            Boulder Plug
        </span>
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    span {
        display: flex;
        align-items: center;
        font-family: 'Arial', sans-serif;
        font-size: 3.5rem;
        font-weight: bold;
        color: var(--text-color);
    }

    img {
        height: 2.5rem;
        margin-right: -5px;
        margin-top: -2px;
    }
</style>