import { writable } from 'svelte/store';

export function buildPlayer(token: string) {
	console.log('Constructing a new player');

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

		const currentTrack = writable({ name: '' });

		return new Promise((resolve, reject) => {
			window.onSpotifyWebPlaybackSDKReady = () => {
				const player = new window.Spotify.Player({
					name: 'Spotify Favorites - Web',
					getOAuthToken: (cb: any) => {
						cb(token);
					},
					volume: 0.5,
				});

				player.addListener('ready', ({ device_id }: { device_id: string }) => {
					console.log('Ready with Device ID', device_id);
					resolve({
						player,
						currentTrack,
					});
				});

				player.addListener(
					'not_ready',
					({ device_id }: { device_id: string }) => {
						console.log('Device ID has gone offline', device_id);
					}
				);

				player.addListener(
					'initialization_error',
					({ message }: { message: string }) => {
						console.error(message);
					}
				);

				player.addListener(
					'authentication_error',
					({ message }: { message: string }) => {
						console.error(message);
					}
				);

				player.addListener(
					'account_error',
					({ message }: { message: string }) => {
						console.error(message);
					}
				);

				player.addListener(
					'player_state_changed',
					({ position, duration, track_window: { current_track } }: any) => {
						console.log('Currently Playing', current_track);
						console.log('Position in Song', position);
						console.log('Duration of Song', duration);

						currentTrack.set(current_track);
					}
				);

				player.connect();
			};
		});
	}
}
