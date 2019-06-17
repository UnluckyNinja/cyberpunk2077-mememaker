<template>
  <div class="wrapper">
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Konva from 'konva';
import { Shape } from 'konva/types/Shape';

@Component({
  components: {
  },
})
export default class KonvaEditor extends Vue {

  public get stage() {
    const stage = this.$refs.stage as any;
    return stage.getNode() as Konva.Stage;
  }
  public get logoLayer() {
    const layer = this.$refs.logoLayer as any;
    return layer.getNode() as Konva.Layer;
  }
  @Prop() private image !: HTMLImageElement;
  private finishedLoadImage = false;
  private logo = 'en';

  private oldImageURL: string = '';

  public mounted() {
    this.stage.on('click tap', (e) => {
      if (!e.target.hasName('logo')) {
        this.clearTransform();
        this.logoLayer.draw();
        return;
      }

      this.clearTransform();

      this.addTransformTo(e.target as Shape);
      this.logoLayer.draw();
    });
  }

  @Watch('image')
  public onImageChange() {
    this.changeLogo(this.logo);

    let stage = this.$refs.stage as any;
    stage = stage.getNode();
    this.resizeCanvas();
    this.finishedLoadImage = true;
  }

  public resizeCanvas(): void {
    let stage = this.$refs.stage as any;
    stage = stage.getNode();
    let ratio = this.$el.clientWidth / this.image.naturalWidth;
    if (ratio > 1) {
      ratio = 1;
    }

    stage.width(this.image.naturalWidth * ratio);
    stage.height(this.image.naturalHeight * ratio);
    stage.scale({ x: ratio, y: ratio });

    stage.draw();
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
      // decide the scale factor of logo, down to (fraction) of background's width
      const ratio = this.stage.width() / this.stage.scaleX() * 0.9 / image.naturalWidth;
      const logo = new Konva.Image({
        name: 'logo',
        image,
        draggable: true,
        x: (this.stage.width() / this.stage.scaleX() - image.naturalWidth * ratio) / 2,
        y: (this.stage.height() / this.stage.scaleY() - image.naturalHeight * ratio) * 0.9,
      });
      logo.scale({ x: ratio, y: ratio });
      this.logoLayer.removeChildren();
      this.logoLayer.add(logo);
      this.addTransformTo(logo);
      this.logoLayer.draw();
    });
    image.src = url;
  }

  public clearTransform() {
    this.stage.find('Transformer').each((it) => {
      it.destroy();
    });
  }

  public addTransformTo(shape: Shape) {
      const tr = new Konva.Transformer();
      shape.getLayer().add(tr);
      tr.attachTo(shape);
  }

  public renderImage(): Promise<string> {
    if (this.oldImageURL !== '') {
      URL.revokeObjectURL(this.oldImageURL);
      this.oldImageURL = '';
    }
    this.clearTransform();
    this.stage.scale({ x: 1, y: 1 });
    this.stage.size({ width: this.image.naturalWidth, height: this.image.naturalHeight });
    this.stage.draw();
    const promise = new Promise<string>((resolve) => {
      const canvas = this.stage.toCanvas({
        callback: () => {
          // never get called but enforced argument, ask Konva devs.
        },
      });
      canvas.toBlob((blob: any) => {
        const src = URL.createObjectURL(blob);
        this.oldImageURL = src;
        resolve(src);
      });
    });
    return promise;
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  & > * {
    margin: 10px;
  }
  .content {
  }
}
</style>
