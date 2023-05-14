import { compute_codes } from "$lib/server/codes";
import { getHighlighter } from "shiki";

export const load = async () => {
    const codes = await compute_codes();
    return { codes };
};
