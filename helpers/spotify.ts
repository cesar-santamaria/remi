import { Axios, AxiosResponse } from 'axios'
import { Itracks, IArtist, Isonglist } from '../interface'

const qs = require('qs')
const axios = require('axios')

/* Obtain the spotify access token to access playlists and track previews.
 * To obtain spotify access keys, follow steps taken in https://developer.spotify.com/documentation/general/guides/authorization/
 * The authorization method used for this application is Client Credential using the Client Secret Key.
 *
 * @return - axios promise containing the access token which will expire in 1 hour.
 */
const getToken = () => {
  const client_id = process.env.CLIENT_ID
  const client_secret = process.env.CLIENT_SECRET
  const auth_token = Buffer.from(
    `${client_id}:${client_secret}`,
    'utf-8'
  ).toString('base64')

  const url = 'https://accounts.spotify.com/api/token'
  const headers = {
    Authorization: 'Basic ' + auth_token,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const body = qs.stringify({ grant_type: 'client_credentials' })

  return axios.post(url, body, { headers: headers }).catch((error: any) => {
    console.log('error', error.message)
  })
}

/* Query spotify API to obtain a playlist for song previews.
 * @params - {token} - Access token used to perform any search queries
 * @params - {genre} - Specified genre to seed the query.
 * @params - {artist} - Spotify ID of a specific artist. If truthy, query will only use that artist.
 *
 * @return - axios promise containing an array of tracks with all information.
 */
const getPlaylist = (
  token: string,
  genre: string,
  artist: string
): Promise<void | AxiosResponse<any, any>> => {
  const limit = 50 // needs to be set as a function argument
  let apiPlaylistUrl = 'https://api.spotify.com/v1/recommendations?market=CA'
  apiPlaylistUrl += `&limit=${limit}`
  if (artist !== '') {
    apiPlaylistUrl = `https://api.spotify.com/v1/artists/${artist}/top-tracks?market=CA`
  }
  {
    genre
  }
  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return axios.get(apiPlaylistUrl, { headers: header }).catch((error: any) => {
    console.log('error', error.message)
    getToken()
  })
}

/* Takes a tracks array and filters out all information except the artist name and track name.
 * @params - {tracks} - takes in a successful axios.get response.
 *
 * @return - {tracks} {artist, id} returns a filtered object.
 */
const filterTitles = (tracks: Itracks[]): Isonglist[] => {
  return tracks.map((track) => {
    return {
      artist: track.artists.map((artist: IArtist) => artist.name).join(', '),
      name: track.name,
    }
  })
}

/* Creates a list of songs for the autocomplete function of the game.
 * @params - [{sampleSonglist}] - takes in a sample list of songs to seed it.
 * @params - [{titles}] - takes in a filtered playlist array of songs and adds non-duplicates to the sampleSonglist.
 *
 * @return - {output} [{ artist, title }]
 */
const createAutocomplete = (
  sampleSonglist: Isonglist[],
  titles: Isonglist[]
): Isonglist[] => {
  const autocomplete = [...sampleSonglist, ...titles]
  const output = [...new Set(autocomplete.map((e) => JSON.stringify(e)))].map(
    (e) => JSON.parse(e)
  )
  return output
}

/* Query spotify API to obtain an array of artists and IDs for additional searching
 * @params - {token} - Access token used to perform any search queries
 * @params - {searchParam} - a URI encoded string of the search parameters
 *
 * @return - axios promise containing an array of artists with all information provided by spotify
 */
const queryArtist = (
  token: string,
  searchParam: string
): Promise<AxiosResponse<any, any>> => {
  const apiArtistUrl = `https://api.spotify.com/v1/search?q=${searchParam}&type=artist&market=CA&limit=5`
  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return axios.get(apiArtistUrl, { headers: header })
}

module.exports = {
  getToken,
  getPlaylist,
  filterTitles,
  createAutocomplete,
  queryArtist,
}
