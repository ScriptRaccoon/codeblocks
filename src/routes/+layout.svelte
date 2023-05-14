<script>
    import "./app.css";
</script>

<svelte:head>
    <title>Codeblock Components with Shiki in SvelteKit</title>
</svelte:head>

<h1>Codeblock Components with Shiki in SvelteKit</h1>

<main>
    <slot />
</main>

<style>
    h1 {
        text-align: center;
    }
    main {
        max-width: 36rem;
        margin-inline: auto;
        padding-inline: 0.5rem;
    }
</style>
