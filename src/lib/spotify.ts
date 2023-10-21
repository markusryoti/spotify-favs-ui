export type SpotifySession = {
	accessToken: string;
};

export type CurrentTrack = {
	name: string;
	artists: {
		name: string;
	}[];
};

export function getArtistName(track?: CurrentTrack) {
	return track?.artists.map(a => a.name).join(', ');
}
