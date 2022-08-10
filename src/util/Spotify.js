import { clientID } from "./environment";
const redirectURL = 'http://localhost:3000/'
let accessToken = ''

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        //check for existing access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if (accessTokenMatch) {
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`
            window.location = accessURL
        }
    },
    search(term) {
        if (term) {
            const accessToken = Spotify.getAccessToken()
            return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(res => {
                    return res.json()
                })
                .then(jsonRes => {
                    if (!jsonRes.tracks) {
                        return [];
                    }
                    return jsonRes.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                    }))
                })
        }
    },
    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs) {
            return
        }
        const accessToken = Spotify.getAccessToken()
        const headers = { Authorization: `Bearer ${accessToken}` }
        fetch('https://api.spotify.com/v1/me', { headers: headers })
            .then(res => res.json())
            .then(jsonRes => {
                const userID = jsonRes.id
                fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name, desceiption: 'Made with Jammming by Codecademy', public: true })
                })
                    .then(res => res.json())
                    .then(jsonRes => {
                        const playlistID = name
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks)`, {
                            headers: headers,
                            mode: 'no-cors',
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs })
                        })
                    })
            })
    }
}

export default Spotify;