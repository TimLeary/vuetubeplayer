import axios from 'axios'

const YOUTUBE_SEARCH_URL = `https://www.googleapis.com/youtube/v3/search`
const YOUTUBE_API_KEY = `AIzaSyD-gOrVWH4ZGQl16U-1-axTie5PG3bGoQw`

export function getSearchVideosPromise (searchText) {
  return axios({
    method: 'get',
    url: YOUTUBE_SEARCH_URL,
    params: {
      key: YOUTUBE_API_KEY,
      type: 'video',
      part: 'snippet',
      q: searchText
    }
  })
}
