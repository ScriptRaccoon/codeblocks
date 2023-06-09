# Codeblock Components with Shiki in SvelteKit

This repository shows how to implement reusable Codeblock components inside of a [SvelteKit project](https://kit.svelte.dev). Syntax highlighting is implemented via [Shiki](https://github.com/shikijs/shiki).

This is an alternative to the more common approach with markdown (see for example [SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/) by Rodney Johnson).

Demo: https://codeblocks-shiki.netlify.app/

## Snippets

The snippets are located in the folder [`$lib/snippets`](https://github.com/ScriptRaccoon/codeblocks/tree/main/src/lib/snippets). This folder can be changed. For example:

```css
/* $lib/snippets/style.css */

.section {
    padding-block: 1rem;
    color: #222;
}
```

Saving each snippet, even when it is just one line, in a separate file may sound overkill, but this is necessary for the method presented here, and it also has the advantage that your editor does the code formatting for you. (Shiki only highlights the code.)

## Shiki code

We install Shiki with `npm i shiki`.

The file [`codes.ts`](https://github.com/ScriptRaccoon/codeblocks/tree/main/src/lib/server/codes.ts) exports a function which uses Shiki to compute an object with all HTML codes of the snippets. The keys are the file names. Here you can also adjust the supported languages and themes as well as the snippet path folder (this has to be a string literal, hence we cannot make it into a variable).

```typescript
// $lib/server/codes.ts

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

To explain this a little bit, notice that Vite's [`import.meta.glob`](https://vitejs.dev/guide/features.html) returns an object whose keys are the file paths and whose values are the file contents. In the `transform` function, we let Shiki operate on the file content and replace the file path by the file name. Shiki needs the language, which we can extract from the file extension.

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

When the code blocks are located only on a single page, you can also use a page server load instead.

## Codeblock component

These codes are then used in the [`Codeblock.svelte`](https://github.com/ScriptRaccoon/codeblocks/blob/main/src/lib/components/Codeblock.svelte) component. It exports a prop `snippet` and computes the rendered code via `codes[snippet]`.

```svelte
<!-- $lib/components/Codeblock.svelte -->

<script lang="ts">
    import { page } from "$app/stores";
    export let snippet = "";
    const code = $page.data.codes?.[snippet];
</script>

{#if code}
    <div>{@html code}</div>
{/if}
```

This produces rather crude-looking code blocks, though. You can improve the styling here as follows.

```css
div :global(pre) {
    font-size: 1rem;
    padding: 1.25rem;
    border-radius: 0.5rem;
    margin-block: 1rem;
    overflow: auto;
}
```

The last property is important, since it adds scrollbars when the code is too wide. We attach a padding to the `pre` element generated by Shiki in order to keep the background color determined by the theme.

When an invalid snippet is passed to the component, nothing is rendered. In order to catch bugs during development, you can expand the if-block as follows:

```svelte
{:else}
    <div><strong>Invalid code snippet: {snippet}</strong></div>
{/if}
```

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
