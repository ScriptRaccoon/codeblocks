export const prerender = true;

import { compute_codes } from "$lib/server/codes";

export const load = async () => {
    const codes = await compute_codes();
    return { codes };
};
