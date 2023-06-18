import type { PageLoad } from './$types';

export const load = (async (cookies) => {
    // check cookies

    return {
        message: "u have access"
    }
}) satisfies PageLoad;

