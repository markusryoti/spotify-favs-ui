import type { PageServerLoad } from './$types';
import { getTokensFromRequest } from '$lib/server/token';

type TopItemsResponse = {
	href: string;
	limit: number;
	next: string;
	offset: number;
	previous: string;
	total: number;
	items: TopItem[];
};

type TopItem = {
	album: {
		album_type: string;
		artists: [
			{
				external_urls: {
					spotify: string;
				};
				href: string;
				id: string;
				name: string;
				type: string;
				uri: string;
			}
		];
		available_markets: string[];
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		images: {
			height: number;
			url: string;
			width: number;
		}[];
	};
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
};

type QueryConfig = {
	timeRange: 'medium_term' | 'short_term';
	limit: 10 | 20 | 30 | 40 | 50;
};

export const load = (async ({ cookies, fetch }) => {
	const tokens = await getTokensFromRequest(cookies, fetch);

	const res = await fetch(
		`https://api.spotify.com/v1/me/top/tracks?time_range=${'short_term'}&limit=${10}`,
		{
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		}
	);

	const data: TopItemsResponse = await res.json();

	return {
		tracks: data.items,
	};
}) satisfies PageServerLoad;
