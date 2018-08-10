<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12">
        <div id="youtubeplayer">
          <youtube
            v-if="isSelectedVideoNotEmpty"
            :video-id="selectedVideo"
            player-width="1240"
            player-height="604"
            :player-vars="youtubeVars"
            @ready="youtubeReady"
            @ended="youtubeEnded"
            @playing="youtubePlaying"
            @paused="youtubePaused"
            @buffering="youtubeBuffering"
            @qued="youtubeQued"
            @click.native="clickOnPlayer($event)"
            ></youtube>
        </div>
      </div>
    </div>
    <div id="youtube_control">
      <div class="row justify-content-center">
        <div class="col-12 align-self-center">
          <div class="form-group">
            <input type="text" id="youtube_search_input" class="form-control" v-model="searchText" @focus="searchInputFocus" :placeholder="$t('vuetube.enterSearchTermHere')" />
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12 align-self-center">
          <div class="form-group">
            <button class="form-control btn btn-sm btn-default" @click="searchYoutube()">{{ $t('vuetube.search') }}</button>
          </div>
        </div>
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
  iframe[id^="youtube-player"] {
    pointer-events: none;
  }
</style>

<script>
import { getSearchVideosPromise } from '@/services/YoutubeApi'

export default {
  name: 'VueTube',
  data: function () {
    return {
      player: null,
      playerStatus: null,
      searchText: '',
      results: {},
      selectedVideo: '',
      youtubeVars: {
        'color': 'white',
        'start': 0,
        'autoplay': 1,
        'modestbranding': 1,
        'controls': 0,
        'showinfo': 0,
        'fs': 1,
        'rel': 0,
        'widget_referrer': 1,
        'enablejsapi': 1,
        'autohide': 2
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
    controllPause: function () {
      if (this.player) {
        this.player.pauseVideo()
      }
    },
    controllPlay: function () {
      if (this.player) {
        this.player.playVideo()
      }
    },
    controllSetVolume: function (volume = 100) {
      if (this.player) {
        this.player.playVideo(volume)
      }
    },
    clickOnPlayer: function (event) {
      if (this.playerStatus === 'playing') {
        this.controllPause()
      } else {
        this.controllPlay()
      }
    },
    searchYoutube: function () {
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
    youtubeReady: function (event) {
      this.playerStatus = 'ready'
      this.player = event.target
      this.controllSetVolume(100)
      this.log('ready')
    },
    youtubePlaying: function () {
      this.playerStatus = 'playing'
      this.log('playing')
    },
    youtubeEnded: function () {
      this.playerStatus = 'ended'
      this.log('ended')
    },
    youtubePaused: function () {
      this.playerStatus = 'paused'
      this.log('paused')
    },
    youtubeBuffering: function () {
      this.playerStatus = 'paused'
      this.log('buffering')
    },
    youtubeQued: function () {
      this.playerStatus = 'qued'
      this.log('qued')
    }
  }
}
</script>
