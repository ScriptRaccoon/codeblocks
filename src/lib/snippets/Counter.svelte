<!-- Counter.svelte -->

<script lang="ts">
    let count = 0;
    setInterval(() => {
        count++;
    }, 1000);
</script>

<p>{count}</p>
