<script>
	import Appbar from "./components/Appbar.svelte";
	import Homepage from "./pages/Homepage/Homepage.svelte";
	import router from "page";
	import ProductPage from "./pages/Productpage/ProductPage.svelte";
	import './global.css';

	let page;

	router('/', () => page = Homepage);

	let productId;
	router('/products/:id', (ctx) => {
		page = ProductPage;
		productId = ctx.params.id;
	});

	router.start();

</script>

<main>
	<Appbar />
	{#if page === Homepage}
		<Homepage />
	{:else if page === ProductPage}
		<ProductPage productId={productId} />
	{/if}

<!--	Product Page Testing:-->
<!--	<ProductPage productId="2" />-->
</main>

<style>
	html, body {
		margin: 0;
		padding: 0;
	}

	main {
		display: flex;
		flex-direction: column;
		/*align-items: center;*/
		justify-content: flex-start;
		min-height: 100vh;
	}
</style>