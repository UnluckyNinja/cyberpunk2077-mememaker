<template>
  <div id="app">
    <el-container style="min-height: 100vh">
      <el-header class="header vertical-center">
        <div>{{$t('app.title')}}</div>
        <div class="language-radio">
          <el-radio-group v-model="locale" @change="changeLanguage">
            <el-radio-button label="en">English</el-radio-button>
            <el-radio-button label="zh-cn">中文</el-radio-button>
          </el-radio-group>
        </div>
      </el-header>
      <el-main class="main">
        <MemeMaker></MemeMaker>
      </el-main>
      <el-footer class="footer vertical-center">
        <div>{{$t('app.footer')}}</div>
      </el-footer>
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
export default class App extends Vue {
  // private locale: string = 'en';

  private get locale() {
    return this.$i18n.locale;
  }

  private set locale(lang: string) {
    this.$i18n.locale = lang;
  }

  public changeLanguage(lang: string) {
    this.locale = lang;
  }

  public mounted() {
    if (navigator.languages[0].includes('zh') || navigator.languages[1].includes('zh')) {
      this.changeLanguage('zh-cn');
    } else {
      this.changeLanguage('en');
    }
  }
}
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
    .language-radio {
      position: absolute;
      right: 20px;
    }
  }
  .header {
    font-size: 30px;
  }
  .footer {
  }
  .main {
    @extend .flex-vertical;
    // position: relative;
    // overflow: auto;
  }
}
body {
  margin: 0px;
}

.flex-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.flex-vertical {
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
