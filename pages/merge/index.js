import React from 'react';
import { getTokenFromUrl, fetchEntirePlaylist } from '../api/spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';

const spotify = new SpotifyWebApi();

function index() {
  const [playlist1Id, setPlaylist1Id] = useState('');
  const [playlist2Id, setPlaylist2Id] = useState('');
  const [newPlayListName, setNewPlayListName] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!spotify.getAccessToken()) {
      const _spotifyToken = getTokenFromUrl().access_token;
      if (_spotifyToken) {
        spotify.setAccessToken(_spotifyToken);
      }
      spotify.getMe().then((me) => {
        setUser(me);
        console.log(me);
      });
    }
    console.log('Token retrievd', spotify.getAccessToken());
  }, []);

  const fetchAndMerge = async () => {
    // sample playlist '0qqj2XPNmaMphaQjVzzsIa?si=ce21b55389c5424a';
    // sample playlist2 '6q8JdpfICxAplSnCuw4w4W?si=9f33e832faa64e1b';

    const playList1 = await fetchEntirePlaylist(
      spotify.getAccessToken(),
      playlist1Id
    );
    if (!playList1) {
      alert(`There was an issue retrieving playlist 1: ${playlist1Id}`);
      return;
    }
    const playList2 = await fetchEntirePlaylist(
      spotify.getAccessToken(),
      playlist2Id
    );
    if (!playList2) {
      alert(`There was an issue retrieving playlist 2: ${playlist2Id}`);
      return;
    }
    let resultItems = [...playList1, ...playList2];

    console.log('resultItems', resultItems);
    let unpackedResults = [];
    for (const result of resultItems) {
      unpackedResults = [...unpackedResults, ...result];
    }
    let unpackedTrackUrls = [];
    for (const track of unpackedResults) {
      unpackedTrackUrls.push(track.track.uri);
    }

    let unique = [...new Set([...unpackedTrackUrls])];
    console.log(unique);
    const chunkSize = 100;
    let chunkedUnique = [];
    for (let i = 0; i < unique.length; i += chunkSize) {
      const chunk = unique.slice(i, i + chunkSize);
      chunkedUnique.push(chunk);
    }
    console.log(chunkedUnique);
    spotify
      .createPlaylist(user.id, {
        name:
          `${newPlayListName}` || `Merged ${playlist1Id} and ${playlist2Id}`,
        description: `Merge of ${playlist1Id} and ${playlist2Id}`,
        public: true
      })
      .then((newPlaylist) => {
        console.log(newPlaylist);
        for (const playListChunk of chunkedUnique) {
          spotify.addTracksToPlaylist(newPlaylist.id, playListChunk);
        }
        console.log(newPlaylist);
      });
  };

  const handleChangePlayList1 = (event) => {
    setPlaylist1Id(event.target.value);
  };

  const handleChangePlayList2 = (event) => {
    setPlaylist2Id(event.target.value);
  };

  const handleChangeNewPlaylistName = (event) => {
    setNewPlayListName(event.target.value);
  };

  const mergeButton = () => {
    console.log('p1', playlist1Id);
    console.log('p2', playlist2Id);
    fetchAndMerge();
  };

  return (
    <div className='merge-page'>
      <h1>Merge Playlists</h1>
      <div className='input-section'>
        <input
          placeholder='Playlist1 Id'
          onChange={handleChangePlayList1}
        ></input>
        <input
          placeholder='Playlist2 Id'
          onChange={handleChangePlayList2}
        ></input>
      </div>
      <div>
        <input
          placeholder='New Playlist Name'
          onChange={handleChangeNewPlaylistName}
        ></input>
      </div>
      <button className='merge-button' onClick={() => mergeButton()}>
        Merge
      </button>
    </div>
  );
}

export default index;
