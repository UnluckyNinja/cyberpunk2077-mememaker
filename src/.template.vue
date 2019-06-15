<template>
  <div class="wrapper">
    <div class="content" @click="dosth">example</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class EditMe extends Vue {
  private target: string = "";

  private dosth(): void {
    console.log("clicked");
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  

  .content {
    
  }
}
</style>
