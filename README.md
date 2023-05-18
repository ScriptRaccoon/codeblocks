# Codeblock Components with Shiki in SvelteKit

This repository shows how to implement reusable Codeblock components inside of a SvelteKit project. Syntax highlighting is implemented via [Shiki](https://github.com/shikijs/shiki). This is an alternative to the more common approach with markdown (see for example [SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/) by Rodney Johnson).

Demo: https://codeblocks-shiki.netlify.app/

## Snippets

The snippets are located in the folder `src/lib/snippets`. This folder can be changed.

For example:

```css
/* src/lib/snippets/style.css */

.section {
    padding-block: 1rem;
    color: #222;
}
```

Saving each snippet, even when it is just one line, in a separate file may sound overkill, but this is necessary for the method presented here, and it also has the advantage that your editor does the code formatting for you.

## Shiki code

The file `src/lib/server/codes.ts` exports a function which computes, with Shiki, an object with all HTML codes of the snippets. The keys are the file names. Here you can also adjust the snippet path folder (this has to be a string literal, hence we cannot make it into a variable) as well as the supported languages and themes.

```typescript
// codes.ts

import { getHighlighter } from "shiki";

export async function compute_codes() {
    const highlighter = await getHighlighter({
        theme: "dark-plus",
        langs: ["html", "js", "css", "svelte"],
    });

    const snippets = import.meta.glob("$lib/snippets/*", {
        as: "raw",
        eager: true,
    });

    const codes = Object.fromEntries(Object.entries(snippets).map(transform));

    function transform([path, file_content]: [string, string]) {
        const file_name = path.split("/").at(-1)!;
        const lang = file_name.split(".").at(-1);
        const code = highlighter.codeToHtml(file_content, { lang });
        return [file_name, code];
    }

    return codes;
}
```

To explain this a little bit, notice that Vite's `import.meta.glob` returns an object whose keys are the file paths and whose values are the file contents. In the `transform` function, we let Shiki operate on the file content and replace the file path by the file name. Shiki needs the language, which we can extract from the file extension.

## Page Data

The layout server load uses this function to make the codes available as page data.

```typescript
// +layout.server.ts

export const prerender = true;

import { compute_codes } from "$lib/server/codes";

export const load = async () => {
    const codes = await compute_codes();
    return { codes };
};
```

Notice that pages with code blocks need to be [prerendered](https://kit.svelte.dev/docs/glossary#prerendering), and Shiki needs to run on the server only. Otherwise there will be an error. This is why we set `prerender = true` here.

## Codeblock component

These codes are then used in the Codeblock component. It exports a prop `snippet` and computes the rendered code via `codes[snippet]`.

```svelte
<!-- Codeblock.svelte -->

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
```

The background color `#1e1e1e` is taken from the `dark-plus` theme. The other CSS styles are just a matter of preference.

## Using the component

The `Codeblock.svelte` component accepts the file name of one of these snippets as a prop.

```svelte
<!-- +page.svelte -->

<Codeblock snippet="index.html" />
<Codeblock snippet="script.js" />
<Codeblock snippet="style.css" />
<Codeblock snippet="Counter.svelte" />
```

## Acknowledgements

Thanks to `karimfromjordan` and `Patrick` on the Svelte Discord server for their help with the implementation.
