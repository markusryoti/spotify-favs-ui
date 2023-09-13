// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		onSpotifyWebPlaybackSDKReady: () => void;
		Spotify: {
			Player;
		};
	}
}

class Player {
	constructor(
		name: string,
		getOAuthToken: (cb: any) => void,
		volume: number
	): any {}
}

export {};
