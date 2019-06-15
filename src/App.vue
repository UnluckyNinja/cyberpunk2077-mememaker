<template>
  <div id="app">
    <el-container style="min-height: 100vh">
      <el-header class="header vertical-center">赛博朋克2077沙雕图生成器</el-header>
      <el-main class="main">
        <MemeMaker></MemeMaker>
      </el-main>
      <el-footer class="footer vertical-center">© 2019 UnluckyNinja</el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MemeMaker from './components/MemeMaker.vue';

@Component({
  components: {
    MemeMaker,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  // min-height: 100vh;

  .header,
  .footer {
    line-height: 60px;
  }
  .header {
    font-size: 30px;
  }
  .main{
    @extend .flex-vertical;
    // position: relative;
    // overflow: auto;
  }
}
body {
  margin: 0px;
}

.flex-horizontal{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.flex-vertical{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.vertical-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.horizontal-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
