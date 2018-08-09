<template>
  <div class="container">
    <div id="youtubeplayer">
      <youtube
        v-if="isSelectedVideoNotEmpty"
        :video-id="selectedVideo"
        player-width="604"
        player-height="1240"
        :player-vars="youtubeVars"
        @ready="youtubeReady"
        @ended="youtubeEnded"
        @playing="youtubePlaying"
        @paused="youtubePaused"
        @buffering="youtubeBuffering"
        @qued="youtubeQued"
        ></youtube>
    </div>
    <div id="youtube_control">
      <div class="form-group">
        <input type="text" id="youtube_search_input" class="form-control" v-model="searchText" @focus="searchInputFocus" :placeholder="$t('vuetube.enterSearchTermHere')" />
      </div>
      <div class="form-group">
        <button class="form-control btn btn-sm" @click="searchYoutube()">{{ $t('vuetube.search') }}</button>
      </div>
    </div>
    <div v-if="isResultEmpty" id="resultList">
      <ul>
      <li v-for="video in results.items" v-bind:key="video.id.videoId" @click="playVideo(video)">
        <img :src="video.snippet.thumbnails.medium.url"/>
        <h4>{{ video.snippet.title }}</h4>
      </li>
      </ul>
    </div>
  </div>
</template>

<style>
  ul {
    list-style-type: none;
  }
</style>

<script>
import { getSearchVideosPromise } from '@/services/YoutubeApi'

export default {
  name: 'VueTube',
  data: function () {
    return {
      searchText: '',
      results: {},
      selectedVideo: '',
      youtubeVars: {
        'color': 'white',
        'start': 0,
        'autoplay': 1,
        'modestbranding': 1,
        'controls': 1,
        'showinfo': 0,
        'fs': 1,
        'rel': 0
      }
    }
  },
  computed: {
    isResultEmpty: function () {
      return this.results.hasOwnProperty('items') && this.results.items.length > 0
    },
    isSelectedVideoNotEmpty: function () {
      return this.selectedVideo !== ''
    }
  },
  methods: {
    log (message) {
      console.log(`${new Date().toLocaleTimeString()} -- ${message}`)
    },
    searchYoutube: function () {
      console.log(this.searchText)
      getSearchVideosPromise(this.searchText)
        .then((response) => {
          this.results = response.data
        })
        .catch((error) => {
          this.results = {}
          console.log(error)
        })
    },
    playVideo: function (video) {
      this.selectedVideo = video.id.videoId
    },
    searchInputFocus: function () {

    },
    youtubeReady: function () { this.log('ready') },
    youtubePlaying: function () { this.log('playing') },
    youtubeEnded: function () { this.log('ended') },
    youtubePaused: function () { this.log('paused') },
    youtubeBuffering: function () { this.log('buffering') },
    youtubeQued: function () { this.log('qued') }
  }
}
</script>
