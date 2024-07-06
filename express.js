// const express = require('express');
// const server = express();
// const path = require('path');
// const axios = require('axios');
// const qs = require('qs');
// require('dotenv').config();

// server.use(express.json());
// server.use(express.static(path.join(__dirname, 'public')));

// const port = process.env.PORT || 3000;
// server.listen(port, () => console.log(`\n Running on port ${port}\n`));

// const client_id = process.env.SPOTIFY_API_ID;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

// server.get('/profile/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const profile = await getUserProfile(username);
//     res.status(200).json(profile);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.get('/playlists/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const playlists = await getUserPlaylists(username);
//     res.status(200).json(playlists);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.get('/top-tracks/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const topTracks = await getUserTopTracks(username);
//     res.status(200).json(topTracks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.get('/top-artists/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const topArtists = await getUserTopArtists(username);
//     res.status(200).json(topArtists);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// const getAuth = async () => {
//   try {
//     const token_url = 'https://accounts.spotify.com/api/token';
//     const data = qs.stringify({ 'grant_type': 'client_credentials' });

//     const response = await axios.post(token_url, data, {
//       headers: {
//         'Authorization': `Basic ${auth_token}`,
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getUserProfile = async (user_id) => {
//   const access_token = await getAuth();
//   const api_url = `https://api.spotify.com/v1/users/${user_id}`;
//   try {
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getUserPlaylists = async (user_id) => {
//   const access_token = await getAuth();
//   const api_url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
//   try {
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getUserTopTracks = async (user_id) => {
//   const access_token = await getAuth();
//   const api_url = `https://api.spotify.com/v1/me/top/tracks`;
//   try {
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getUserTopArtists = async (user_id) => {
//   const access_token = await getAuth();
//   const api_url = `https://api.spotify.com/v1/me/top/artists`;
//   try {
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };


const express = require('express');
const server = express();
const path = require('path');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n Running on port ${port}\n`));

const client_id = process.env.SPOTIFY_API_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

// Spotify Scopes for the desired permissions
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'user-library-read',
  'ugc-image-upload'
].join(' ');

const auth_query_parameters = qs.stringify({
  response_type: 'code',
  client_id: client_id,
  scope: scopes,
  redirect_uri: redirect_uri,
  state: 'some_random_state'
});

server.get('/login', (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?${auth_query_parameters}`);
});

server.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' + 
      qs.stringify({
        error: 'state_mismatch'
      }));
  } else {
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    });

    try {
      const response = await axios.post(token_url, data, {
        headers: {
          'Authorization': `Basic ${auth_token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token } = response.data;
      res.redirect(`/#${qs.stringify({ access_token, refresh_token })}`);
    } catch (error) {
      console.error(error);
      res.redirect('/#' + 
        qs.stringify({
          error: 'invalid_token'
        }));
    }
  }
});

const getAuth = async () => {
  try {
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ 'grant_type': 'client_credentials' });

    const response = await axios.post(token_url, data, {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (access_token) => {
  const api_url = `https://api.spotify.com/v1/me`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getUserPlaylists = async (access_token) => {
  const api_url = `https://api.spotify.com/v1/me/playlists`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Add endpoints to fetch user data
server.get('/profile', async (req, res) => {
  const access_token = req.query.access_token;
  try {
    const profile = await getUserProfile(access_token);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.get('/playlists', async (req, res) => {
  const access_token = req.query.access_token;
  try {
    const playlists = await getUserPlaylists(access_token);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add additional endpoints for top tracks and top artists
server.get('/top-tracks', async (req, res) => {
  const access_token = req.query.access_token;
  const api_url = `https://api.spotify.com/v1/me/top/tracks`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.get('/top-artists', async (req, res) => {
  const access_token = req.query.access_token;
  const api_url = `https://api.spotify.com/v1/me/top/artists`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

