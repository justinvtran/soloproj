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
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

server.get('/profile/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await getUserProfile(username);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.get('/playlists/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const playlists = await getUserPlaylists(username);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

const getUserProfile = async (user_id) => {
  const access_token = await getAuth();
  const api_url = `https://api.spotify.com/v1/users/${user_id}`;
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

const getUserPlaylists = async (user_id) => {
  const access_token = await getAuth();
  const api_url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
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

// const express = require('express');
// const server = express();
// const path = require('path');


// server.use(express.json());
// server.use(express.static(path.join(__dirname, 'public')));

// // // define port variable
// const port = process.env.PORT || 3000;
// server.listen(port, ()=> console.log(`\n Running on port ${port}\n`))


// const axios = require('axios');
// const qs = require('qs');
// require('dotenv').config();

// const client_id = process.env.SPOTIFY_API_ID; // Your client id
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
// const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');
// // let savedusername = jvintenct97;


// //the first time savedusername gets assigned is when the user inputs a username into the search bar.
// //after they press enter or search, savedusername is now reassigned (savedusername = whatever they typed)
// //once enter is pressed or the search button and the textbox has text in it, thats the only time savedusername is ever reassigned.

// // let savedusernamereassign = (textboxvalue) => {
// //     if (!textboxvalue then reassign saved username){
// //       savedusername = textobxvalue
// //     }
// // }

// //from front end, when button or enter is clicked and textbox !== empty, then call savedusernamereassign.

// server.get('/profile/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const profile = await getUserProfile(username);
//     res.status(200).json(profile);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.get('/', (req, res) => {
//   return res.status(200).sendFile(path.resolve(__dirname, './index.html'));
// })
// const getAuth = async () => {
//   try{
//     //make post request to SPOTIFY API for access token, sending relavent info
//     const token_url = 'https://accounts.spotify.com/api/token';
//     const data = qs.stringify({'grant_type':'client_credentials'});

//     const response = await axios.post(token_url, data, {
//       headers: { 
//         'Authorization': `Basic ${auth_token}`,
//         'Content-Type': 'application/x-www-form-urlencoded' 
//       }
//     })
//     //return access token
//     console.log(response.data.access_token);
//     return response.data.access_token;
//     //console.log(response.data.access_token);   
//   }catch(error){
//     //on fail, log the error in console
//     console.log(error);
//   }
// }

// // const getAudioFeatures_Track = async (track_id) => {
// //   //request token using getAuth() function
// //   const access_token = await getAuth();
// //   //console.log(access_token);

// //   const api_url = `https://api.spotify.com/v1/audio-features/${track_id}`;
// //   //console.log(api_url);
// //   try{
// //     const response = await axios.get(api_url, {
// //       headers: {
// //         'Authorization': `Bearer ${access_token}`
// //       }
// //     });
// //     console.log(response.data);
// //     return response.data;
// //   }catch(error){
// //     console.log(error);
// //   }  
// // };

// const getUserProfile = async (user_id) => {
//   const access_token = await getAuth();
//   const api_url = `https://api.spotify.com/v1/users/${user_id}`
//   try{
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });
//     console.log(response.data);
//     return response.data;
//   }catch(error){
//     console.log(error);
//   }  
// }
// console.log(getUserProfile('jvincentt97'));

