import Vuex from 'vuex'

export const youtubeStore = new Vuex.Store({
  state: {
    searchText: ''
  },
  mutations: {
    search (state, text) {
      state.searchText = text
    }
  },
  actions: {
    refreshSearch (context) {
      return new Promise(
        (resolve => {
          this.$http.get('https://www.googleapis.com/youtube/v3/search')
        }
      ));
    }
  }
});
