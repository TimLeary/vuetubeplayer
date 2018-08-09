<template>
  <div id="app">
    <VueTube/>
  </div>
</template>

<script>
import VueTube from './components/VueTube'

export default {
  name: 'App',
  components: {
    VueTube
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
