<script>
import Main from './views/Main.vue';

export default {
  name: 'App',
  components: { Main },
}
</script>

<template>
  <div class="page-container">
    <Main />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter';
}

.page-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.column-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

