export type SpotifySession = {
	accessToken: string;
};

export type CurrentTrack = {
	id: string;
	uri: string;
	name: string;
	artists: {
		name: string;
	}[];
	album: {
		images: {
			url: string;
		}[];
	};
};

export function getArtistName(track?: CurrentTrack) {
	return track?.artists.map(a => a.name).join(', ');
}
