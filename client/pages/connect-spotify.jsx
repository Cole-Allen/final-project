import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleSpotify = this.handleSpotify.bind(this);
    this.getSpotifyCode = this.getSpotifyCode.bind(this);
    this.requestSpotifyData = this.requestSpotifyData.bind(this);
  }

  componentDidMount() {
    this.getSpotifyCode();
  }

  handleSpotify() {
    fetch('/api/spotify/login')
      .then(res => res.json())
      .then(data => { window.location = new URL(data.url); });
  }

  getSpotifyCode() {
    const qs = window.location.search;
    if (qs.length > 0) {
      const urlParams = new URLSearchParams(qs);
      const code = urlParams.get('code');
      fetch('/api/spotify/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
          }
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          window.location.search = '';
        });
    }
  }

  requestSpotifyData() {
    const token = window.localStorage.getItem('access_token');
    console.log(token);
    fetch('/api/spotify/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token })
    })
      .then(res => console.log(res));
  }

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <button onClick={this.handleSpotify}>Sign in with Spotify</button>
        <button onClick={this.requestSpotifyData}>Test</button>
      </div>
    );
  }
}
