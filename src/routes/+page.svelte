<script lang="ts">
    function getLoginUrl() {
        const authEndpoint = "https://accounts.spotify.com/authorize";
        const redirectUri = "http://localhost:5173/spotify-redirect";
        const clientId = "f5d9847f233f4aba85c76642845010a9";

        const scopes = [
            "streaming",
            "user-read-email",
            "user-read-private",
            "user-top-read",
        ];

        const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
        )}`;
        return loginUrl;
    }
</script>

<h1 class="mb-4">Welcome to Favs</h1>

<a type="button" class="btn variant-filled" href={getLoginUrl()}>
    Login to Spotify
</a>
