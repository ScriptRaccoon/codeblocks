<script lang="ts">
    import { page } from "$app/stores";
    export let snippet = "";
    const codes = $page.data.codes;
</script>

{#if snippet && snippet in codes}
    <div>{@html codes[snippet]}</div>
{/if}

<style>
    div {
        padding: 0.5rem 1rem;
        border-radius: 0.2rem;
        background-color: #1e1e1e;
        margin-block: 1rem;
        font-size: 1rem;
        overflow-y: auto;
    }
</style>
