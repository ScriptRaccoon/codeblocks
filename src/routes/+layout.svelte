<script>
    import Header from "$lib/components/Header.svelte";
    import "./app.css";
</script>

<svelte:head>
    <title>Codeblock Components with Shiki in SvelteKit</title>
</svelte:head>

<Header />

<main>
    <slot />
</main>

<style>
    main {
        max-width: 36rem;
        margin-inline: auto;
        padding-inline: 0.5rem;
    }
</style>
