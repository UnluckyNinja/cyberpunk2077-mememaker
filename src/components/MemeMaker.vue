<template>
  <div class="wrapper" @paste="pasteImage">
    <div class="flex-horizontal">
      <el-button type="primary" @click="previous" :disabled="currentStep <= 0">上一步</el-button>
      <el-button type="primary" @click="next" :disabled="currentStep >= 2">下一步</el-button>
    </div>
    <!-- <transition name="editor-transition"> -->
    <!-- file chooser -->
    <div class="mememaker filepicker vertical-center" v-show="currentStep == 0" key="0">
      <el-upload
        v-if="currentStep == 0"
        drag
        action="nowhere"
        accept="image/*"
        :limit="1"
        :auto-upload="false"
        :show-file-list="true"
        :on-change="changeImage"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
          或在正文区域粘贴（CTRL+V）
        </div>
      </el-upload>
    </div>
    <!-- editor div -->
    <div class="mememaker editor flex-column" v-show="currentStep == 1" key="1">
      <el-radio-group v-model="logo" @change="changeLogo">
        <el-radio border label="zh">中文</el-radio>
        <el-radio border label="en">English</el-radio>
      </el-radio-group>
      <!-- konva stage -->
      <v-stage class="horizontal-center" ref="stage" :config="{width: 100, height: 100}">
        <v-layer>
          <v-image
            v-if="finishedLoadImage"
            :config="{width:image.naturalWidth, height: image.naturalHeight, image: image}"
          ></v-image>
        </v-layer>
        <v-layer ref="logoLayer"></v-layer>
      </v-stage>
    </div>
    <!-- @TODO canvas copy -->
    <div class="mememaker result horizontal-center" v-show="currentStep == 2" key="2">
      <el-image
        style="width: fit-content; height: fit-content"
        v-if="outputImage"
        :src="outputImage.src"
        fit="none"
      ></el-image>
    </div>
    <!-- </transition> -->
    <!-- eleme steps -->
    <el-steps class="step" :active="currentStep" finish-status="success" align-center>
      <el-step title="选择图片"></el-step>
      <el-step title="沙雕炼成"></el-step>
      <el-step title="复制图片"></el-step>
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
import Konva from 'konva';

@Component({
  components: {},
})
export default class MemeMaker extends Vue {
  private target: string = '';
  private currentStep = 0;
  private image = new Image();
  private finishedLoadImage = false;
  private logo = 'en';
  private outputImage = null;

  public get stage() {
    const stage = this.$refs.stage as any;
    return stage.getNode() as Konva.Stage;
  }
  public get logoLayer() {
    const layer = this.$refs.logoLayer as any;
    return layer.getNode() as Konva.Layer;
  }

  public next() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }

    if (this.currentStep === 1) {
      this.changeLogo(this.logo);
    }

    // 渲染结果
    if (this.currentStep === 2) {
      this.clearTransform();
      this.stage.toImage({
        callback: (img: any) => {
          this.outputImage = img;
        },
      });
    }
  }

  public clearTransform() {
    this.stage.find('Transformer').each((it) => {
      it.destroy();
    });
  }

  public mounted() {
    this.stage.on('click tap', (e) => {

      if (!e.target.hasName('logo')) {
        this.clearTransform();
        this.logoLayer.draw();
        return;
      }

      this.stage.find('Transformer').each((it) => { it.destroy(); });

      const tr = new Konva.Transformer();
      this.logoLayer.add(tr as any);
      tr.attachTo(e.target);
      this.logoLayer.draw();
    });
  }

  public previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  // 处理粘贴逻辑
  public async pasteImage(event: ClipboardEvent) {
    let image;
    for (const item of event!.clipboardData!.items) {
      if (item && item.type.startsWith('image')) {
        image = item; // 将第一个找到的图片作为背景
        break;
      }
    }
    if (!image) {
      return; // 没找到直接返回
    }
    const imageFile = image.getAsFile();
    if (!imageFile) {
      const elemeThis: any = this;
      elemeThis.$message({
        showClose: true,
        message:
          '图片文件错误，如果从QQ聊天中复制，请对双击图片后的大图右键复制',
        type: 'error',
      });
      return; // QQ聊天直接右键复制时为null
    }
    await this.loadImage(imageFile);
    this.next();
  }
  public async changeImage(file: any, fileList: any) {
    if (!file || !file.raw) {
      return;
    }
    await this.loadImage(file.raw);
    this.next();
    return true;
  }

  // 添加图像到konva
  public async loadImage(file: File) {
    if (this.image.src !== '') {
      URL.revokeObjectURL(this.image.src);
      this.image.removeAttribute('src');
    }
    // 只有加载完成时才能添加到konva
    const promise = new Promise((resolve, reject) => {
      return this.image.addEventListener('load', () => {
        let stage = this.$refs.stage as any;
        stage = stage.getNode();
        stage.width(this.image.naturalWidth);
        stage.height(this.image.naturalHeight);
        this.finishedLoadImage = true;
        this.stage.draw();
        resolve(true);
      });
    });
    this.image.src = URL.createObjectURL(file);
    return promise;
  }

  public changeLogo(value: string) {
    if (value === 'zh') {
      this.loadLogo(require('@/assets/cyberpunk_zh.png'));
    } else if (value === 'en') {
      this.loadLogo(require('@/assets/cyberpunk_en.png'));
    }
  }

  public loadLogo(url: string) {
    const image = new Image();
    image.addEventListener('load', () => {
      const ratio = this.stage.width() * 0.8 / image.naturalWidth;
      const logo = new Konva.Image({
        name: 'logo',
        image,
        draggable: true,
        x: (this.stage.width() - image.naturalWidth * ratio) / 2,
        y: (this.stage.height() - image.naturalHeight * ratio) * 0.9,
      });
      logo.scale({ x: ratio, y: ratio });
      logo.transformsEnabled();
      this.logoLayer.removeChildren();
      this.logoLayer.add(logo);
      this.logoLayer.draw();
    });
    image.src = url;
  }

}
</script>

<style lang="scss" scoped>
.wrapper {
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  .mememaker {
    flex-grow: 1;
    &.editor,
    &.result {
      margin: 20px;
      & > * {
        margin: 10px;
      }
      // border: 1px solid grey;
      text-align: center;
    }
  }
}
</style>
