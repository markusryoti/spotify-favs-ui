import type { Writable } from 'svelte/store';

export type CurrentTrack = {
	name: string;
	artists: {
		name: string;
	}[];
};

export type Player = {
	addListener: (event: string, cb: (params: any) => void) => void;
	connect: () => void;
	togglePlay: () => void;
	nextTrack: () => void;
	previousTrack: () => void;
};

export function buildPlayer(
	token: string,
	currentTrack: Writable<CurrentTrack>
): Promise<Player> {
	console.log('buildPlayer');

	const scriptTag = document.getElementById('spotify-player');

	if (!scriptTag) {
		const script = document.createElement('script');

		script.id = 'spotify-player';
		script.type = 'text/javascript';
		script.async = false;
		script.defer = true;
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.onload = () => {};
		script.onerror = (error: any) => {};

		document.head.appendChild(script);
	}

	return new Promise((resolve, reject) => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			console.log('creating new player');

			const player: Player = new window.Spotify.Player({
				name: 'Spotify Favorites - Web',
				getOAuthToken: (cb: any) => {
					cb(token);
				},
				volume: 0.5,
			});

			player.addListener('ready', ({ device_id }: { device_id: string }) => {
				console.log('Ready with Device ID', device_id);
				resolve(player);
			});

			player.addListener(
				'not_ready',
				({ device_id }: { device_id: string }) => {
					console.log('Device ID has gone offline', device_id);
					reject('offline');
				}
			);

			player.addListener(
				'initialization_error',
				({ message }: { message: string }) => {
					console.error(message);
					reject(message);
				}
			);

			player.addListener(
				'authentication_error',
				({ message }: { message: string }) => {
					console.error(message);
					reject(message);
				}
			);

			player.addListener(
				'account_error',
				({ message }: { message: string }) => {
					console.error(message);
					reject(message);
				}
			);

			player.addListener(
				'player_state_changed',
				({ track_window: { current_track } }) => {
					currentTrack.set(current_track as CurrentTrack);
				}
			);

			player.connect();
		};
	});
}
