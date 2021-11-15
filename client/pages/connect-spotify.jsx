import React from 'react';
import AppContext from '../lib/app-context';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };

    this.handleSpotify = this.handleSpotify.bind(this);
    this.getSpotifyCode = this.getSpotifyCode.bind(this);
    this.requestSpotifyData = this.requestSpotifyData.bind(this);
    this.handleUnlinkSpotify = this.handleUnlinkSpotify.bind(this);
  }

  componentDidMount() {

    if (window.localStorage.getItem('access_token')) { // Checks to see if user already has a token
      this.requestSpotifyData();
    } else {
      this.getSpotifyCode(); // Checks to see if there is a code in search
    }
  }

  handleSpotify() { // redirect to spotify authorize page
    fetch('/api/spotify/login')
      .then(res => res.json())
      .then(data => {
        window.location = new URL(data.url);
      });
  }

  handleUnlinkSpotify() { // deletes tokens
    fetch(`/api/${window.localStorage.getItem('jwt')}/spotify/unlink`)
      .then(res => {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('spot_name');
        this.setState({
          username: null,
          spotifyImage: null
        });
      });
  }

  getSpotifyCode() { // search url for search params given by spotify redirect
    const qs = window.location.search;
    if (qs.length > 0) {
      const urlParams = new URLSearchParams(qs);
      const code = urlParams.get('code');
      fetch('/api/spotify/code', { // get access and refresh tokens using search params code
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          window.localStorage.setItem('access_token', data.access_token); // Store tokens in local storage
          window.localStorage.setItem('refresh_token', data.refresh_token); // ***Will update to store in DB
          this.requestSpotifyData(); // get user data after recieveing and storing tokens
          window.location.search = ''; // remove search from url for clarity

        });
    }
  }

  requestSpotifyData() { // get spotify data using access_token
    fetch(`/api/${window.localStorage.getItem('jwt')}/spotify/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: window.localStorage.getItem('access_token') })
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          username: data.display_name, // assign displayname to username so it welcomes user
          spotifyImage: data.images[0].url,
          loading: false
        });
        console.log(data);
        const split = data.uri.split(':'); // get the user id for later use
        window.localStorage.setItem('spot_name', split[2]);// store user id for later use in api calls
      });

  }

  render() {
    // if (this.state.loading) {
    //   return (
    //     <h1>Loading</h1>
    //   );
    // }
    const signedIn = this.state.username
      ? <div className="settings-spotify-signed-in">
          <img src={this.state.spotifyImage}/>
          <div>
          Signed in as {this.state.username}
          </div>
        <i onClick={this.handleUnlinkSpotify} className="fas fa-unlink"></i>
        </div>
      : <button onClick={this.handleSpotify}>
          Sign in with Spotify
        </button>;
    return (
      <div className="settings-page">
        <div className="routine-back">
          <a href="#home" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>
        </div>
        <h1>Settings</h1>
        {signedIn}
      </div>
    );
  }
}

Settings.contextType = AppContext;
