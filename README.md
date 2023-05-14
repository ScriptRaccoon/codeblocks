# Codeblock Components with Shiki in SvelteKit

https://codeblocks-shiki.netlify.app/

This repository shows how to implement reusable Codeblock components inside of a SvelteKit project, with syntax highlighting by [Shiki](https://github.com/shikijs/shiki). This is an alternative to the more common approach with markdown.

1. The snippets are located in the folder `src/lib/snippets`.

2. The file `src/lib/server/codes.ts` exports a function which computes, with Shiki, an object with all HTML codes of the snippets. The keys are the filenames. Here you can also adjust the snippet path folder as well as the supported languages and themes.

3. The layout server load in `+layout.server.ts` uses this function to return the codes as page data.

4. These codes are then used in the `Codeblock.svelte` component.

5. The `Codeblock.svelte` component accepts the filename of one of these snippets as a prop: `<Codeblock snippet="index.html" />` for example.

Remarks: The pages with code blocks need to be [prerendered](https://kit.svelte.dev/docs/glossary#prerendering). Shiki needs to run on the server only. Otherwise there will be an error.

Thanks to `karimfromjordan` and `Patrick` on the Svelte Discord server for their help with the implementation.
