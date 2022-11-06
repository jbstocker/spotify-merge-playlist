export const authEndpoint = 'https://accounts.spotify.com/authorize';

const redirectUri = 'http://localhost:3000/merge/';

const clientId = process.env.CLIENT_ID;

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public'
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  '%20'
)}&response_type=token&show_dialog=true`;

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      // #accessToken=mysecretkey&name=somerandomname
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);

      return initial;
    }, {});
};

export const fetchEntirePlaylist = async (token, playlistId) => {
  const resultItems = [];
  const initialPlaylistData = await fetchPlaylistTracks(token, playlistId);
  if (initialPlaylistData.error) {
    return undefined;
  }
  resultItems.push(initialPlaylistData.tracks.items);
  if (initialPlaylistData.tracks.next) {
    let moreTracks = true;
    let nextUrl = initialPlaylistData.tracks.next;
    let i = 0;
    while (moreTracks) {
      const additionalTracksData = await fetchPlaylistTracksNext(
        token,
        nextUrl
      );
      resultItems.push(additionalTracksData.items);
      if (additionalTracksData.next) {
        nextUrl = additionalTracksData.next;
      } else {
        moreTracks = false;
      }

      //Let's escape if the playlist is too large - don't want to get infinite loop'd
      i++;
      if (i >= 10) {
        moreTracks = false;
      }
    }
  }
  return resultItems;
};

export const fetchPlaylistTracks = async (token, playlistId) => {
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  return fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    fetchOptions
  )
    .then((response) => response.json())
    .catch((err) => {
      return err;
    });
};

export const fetchPlaylistTracksNext = async (token, nextUrl) => {
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  return fetch(nextUrl, fetchOptions)
    .then((response) => response.json())
    .catch((err) => {
      return err;
    });
};
