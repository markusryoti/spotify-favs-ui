import type { PageServerLoad } from "./$types";
import { getAccessTokenFromRequest } from "$lib/server/token";

type TopItemsResponse = {
    href: string
    limit: number
    next: string
    offset: number,
    previous: string,
    total: number,
    items: TopItem[]
}

type TopItem = {
    album: {
        album_type: string,
        artists: [
            {
                external_urls: {
                    spotify: string
                },
                href: string
                id: string
                name: string
                type: string
                uri: string
            }
        ],
        available_markets: string[],
        external_urls: {
            spotify: string
        },
        href: string
        id: string
        images: {
            height: number
            url: string
            width: number
        }[],
    }
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number,
    type: string,
    uri: string
}

export const load = (async ({ cookies, fetch }) => {
    const accessToken = await getAccessTokenFromRequest(cookies, fetch)

    const res = await fetch('https://api.spotify.com/v1/me/top/tracks',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

    const data: TopItemsResponse = await res.json()

    return {
        tracks: data.items
    };
}) satisfies PageServerLoad;
