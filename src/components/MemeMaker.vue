<template>
  <div
    class="maker"
    v-loading.fullscreen="processing"
    :element-loading-text="$t('steps.processing')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-customClass="loading-overlay"
    @paste="onPaste"
  >
    <!-- <transition name="editor-transition"> -->
    <!-- file chooser -->
    <div class="mememaker filepicker vertical-center" v-show="currentStep === 0" key="0">
      <!-- v-if 保证上一步再次读取文件时自动刷新 -->
      <FilePicker ref="filePicker" v-if="currentStep === 0" @image-load="imageLoad"></FilePicker>
    </div>
    <!-- editor div -->
    <KonvaEditor
      class="mememaker editor flex-vertical"
      ref="editor"
      :image="image"
      v-show="currentStep === 1"
      key="1"
    ></KonvaEditor>
    <!-- @TODO canvas copy -->
    <div class="mememaker result vertical-center" v-show="currentStep === 2" key="2">
      <el-image
        style="align-self: center"
        v-if="outputImage !== ''"
        :src="outputImage"
        fit="contain"
      ></el-image>
      <div></div>
      <div>
        <a style="height" :href="outputImage" download>
          <el-button type="success">{{$t('steps.button.save')}}</el-button>
        </a>
      </div>
    </div>
    <!-- </transition> -->
    <div class="flex-horizontal">
      <el-button
        type="primary"
        @click="previous"
        :loading="processing"
        :disabled="currentStep <= 0"
      >{{$t('steps.button.previous')}}</el-button>
      <el-button
        type="primary"
        @click="next"
        :loading="processing"
        :disabled="currentStep >= 2 || !this.image"
      >{{$t('steps.button.next')}}</el-button>
    </div>
    <!-- eleme steps -->
    <el-steps class="step" :active="currentStep" finish-status="success" align-center>
      <el-step :title="$t('steps.step1')"></el-step>
      <el-step :title="$t('steps.step2')"></el-step>
      <el-step :title="$t('steps.step3')"></el-step>
    </el-steps>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  HttpRequestOptions,
  ElUploadInternalFileDetail,
  FileListItem,
} from 'element-ui/types/upload';
import FilePicker from './FilePicker.vue';
import KonvaEditor from './KonvaEditor.vue';

@Component({
  components: {
    FilePicker,
    KonvaEditor,
  },
})
export default class MemeMaker extends Vue {
  private currentStep = 0;
  private image: HTMLImageElement | null = null;
  private outputImage: string = '';
  private processing = false;

  public openImage() {
    const newwin = window.open('about:blank', '_blank');
    if (newwin) {
      newwin.document.write(`<img src="${this.outputImage}"></img>`);
    }
  }

  public onPaste(e: ClipboardEvent) {
    (this.$refs.filePicker as FilePicker).pasteImage(e);
  }

  public get editor() {
    return this.$refs.editor as KonvaEditor;
  }

  public get nextStep() {
    return this.currentStep + 1;
  }
  public get previousStep() {
    return this.currentStep - 1;
  }

  public next() {
    this.processing = true;
    // 渲染结果
    if (this.nextStep === 2) {
      this.editor.renderImage().then((src) => {
        this.outputImage = src;
        this.currentStep++;
        this.processing = false;
      });
      return;
    }
    if (this.currentStep < 2) {
      this.currentStep++;
    }
    this.processing = false;
  }

  public previous() {
    this.processing = true;

    if (this.previousStep === 1) {
      // 生成图片后点上一步时修正比例
      Promise.resolve().then(() => {
        this.editor.resizeCanvas();
        this.processing = false;
      });
      this.currentStep--;
      return;
    }
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    this.processing = false;
  }

  public imageLoad(image: HTMLImageElement) {
    this.image = image;
    this.next();
  }

}
</script>

<style lang="scss" scoped>
.maker {
  & > * {
    margin: 10px;
  }

  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  .mememaker {
    flex-grow: 1;
    &.editor,
    &.result {
      & > * {
        margin: 10px;
      }
      text-align: center;
    }
  }
}
</style>
