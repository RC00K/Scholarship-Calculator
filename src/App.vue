<template>
  <div id="app">
    <AwardResult></AwardResult>
  </div>
</template>

<script>
import AwardResult from "./components/AwardResult.vue";

export default {
  name: "App",
  components: {
    AwardResult,
  },
  data() {
    return {
      number: 0,
    };
  },
};
</script>

<style>
#app {
  font-family: 'Open Sans', 'Barlow Semi Condensed', 'Barlow', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #212222;
  margin-top: 60px;
}
</style>
