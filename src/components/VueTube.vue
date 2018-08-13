<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12" id="youtubeplayer">
          <youtube
            v-if="isSelectedVideoNotEmpty"
            :video-id="selectedVideo"
            :player-width="playerWidth"
            :player-height="playerHeight"
            :player-vars="youtubeVars"
            @ready="youtubeReady"
            @ended="youtubeEnded"
            @playing="youtubePlaying"
            @paused="youtubePaused"
            @buffering="youtubeBuffering"
            @qued="youtubeQued"
            @click.native="clickOnPlayer($event)"
            :mute="mute"
            ></youtube>
      </div>
    </div>
    <div class="row justify-content-center no-gutters" v-if="isSelectedVideoNotEmpty">
      <div class="col btn-group btn-group-sm">
          <button type="button" class="btn btn-primary btn-sm" @click="playOrPause">{{ mainControllButtonText }}</button>
          <button type="button" class="btn btn-primary btn-sm" @click="muteOrUnmute">{{ muteControllButtonText }}</button>
      </div>
      <div class="col">{{ playerTimeFormated }} / {{ playerTotalTimeFormated }}</div>
      <div class="col-8 btn-primary" id="player-process-slider" @click="playerSliderClicked($event)">
        <div id="player-process" v-bind:style="{ width: processWidth +'%' }"></div>
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
      <ul class="vertical-list">
      <li v-for="video in results.items" v-bind:key="video.id.videoId" @click="playVideo(video)">
        <img :src="video.snippet.thumbnails.medium.url"/>
        <h4>{{ video.snippet.title }}</h4>
      </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSearchVideosPromise } from '@/services/YoutubeApi'

let playerInterval = null

export default {
  name: 'VueTube',
  data: function () {
    return {
      playerTime: 0,
      playerTotalTime: 0,
      playerWidth: 0,
      playerHeight: 0,
      mute: false,
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
  mounted () {
    let playerDimension = this.getPlayerDimension()
    this.playerWidth = playerDimension.width
    this.playerHeight = playerDimension.height
  },
  computed: {
    isResultEmpty: function () {
      return this.results.hasOwnProperty('items') && this.results.items.length > 0
    },
    isSelectedVideoNotEmpty: function () {
      return this.selectedVideo !== ''
    },
    mainControllButtonText: function () {
      if (this.playerStatus === 'playing') {
        return this.$t('vuetube.pause')
      } else {
        return this.$t('vuetube.play')
      }
    },
    muteControllButtonText: function () {
      if (this.mute === false) {
        return this.$t('vuetube.mute')
      }

      return this.$t('vuetube.unmute')
    },
    playerTimeFormated: function () {
      return this.formatTime(this.playerTime)
    },
    playerTotalTimeFormated: function () {
      return this.formatTime(this.playerTotalTime)
    },
    processWidth: function () {
      return (this.playerTime / this.playerTotalTime) * 100
    }
  },
  methods: {
    getPlayerDimension: function () {
      let ytWidth = document.getElementById('youtubeplayer').clientWidth
      return {
        width: ytWidth,
        height: Math.ceil(ytWidth / 2)
      }
    },
    playerSliderClicked: function (event) {
      let rate = (event.offsetX / event.target.offsetWidth)
      let seekerPos = this.playerTotalTime * rate
      this.player.seekTo(seekerPos, true)
    },
    formatTime: function (timeInSecond, padChar = '0', timeDelimiter = ':') {
      let seconds = Math.floor(timeInSecond)
      let hours = Math.floor(seconds / 3600)
      seconds -= hours * 3600
      let minutes = Math.floor(seconds / 60)
      seconds -= minutes * 60

      if (hours < 10) { hours = padChar + hours }
      if (minutes < 10) { minutes = padChar + minutes }
      if (seconds < 10) { seconds = padChar + seconds }
      return hours + timeDelimiter + minutes + timeDelimiter + seconds
    },
    playerCurrentTime: function () {
      this.playerTime = this.player.getCurrentTime()
    },
    getPlayerTotalTime: function () {
      this.playerTotalTime = this.player.getDuration()
    },
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
    playOrPause: function () {
      if (this.playerStatus === 'playing') {
        this.controllPause()
      } else {
        this.controllPlay()
      }
    },
    muteOrUnmute: function () {
      this.mute = !this.mute
    },
    clickOnPlayer: function (event) {
      this.playOrPause()
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
      this.getPlayerTotalTime()
      this.createCurrentTimeRefresher()
      this.log('ready')
    },
    createCurrentTimeRefresher: function () {
      if (playerInterval) {
        window.clearInterval(playerInterval)
      }
      playerInterval = this.createInterval(this.playerCurrentTime, 100)
    },
    createInterval: function (func, time) {
      return window.setInterval(func, time)
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
