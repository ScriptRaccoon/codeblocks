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
