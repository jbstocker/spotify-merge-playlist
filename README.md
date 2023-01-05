# Spotify Merge App

This application allows a user to enter two playlistid's for merging. It will automatically detect and remove duplicates

To use the app please add a .env file with the following formatting:

```
CLIENT_ID="clientId"
REDIRECTURI="http://localhost:8888/callback"
CLIENT_REDIRECTURI="http://localhost:3000/"
```

The app uses PKCE auth so no client secrets are needed, however a client_id is required for PKCE, documentation here: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

To run use `yarn install` and `yarn dev`
