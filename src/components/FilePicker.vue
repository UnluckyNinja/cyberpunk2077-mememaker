<template>
  <el-upload
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
      <br>你也可以复制图片，然后点击正文区域并粘贴（CTRL+V）
    </div>
  </el-upload>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class FilePicker extends Vue {
  private target: string = '';
  private image = new Image();

  // 处理粘贴逻辑
  public pasteImage(event: ClipboardEvent) {
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
    this.loadImage(imageFile);
  }
  public changeImage(file: any, fileList: any) {
    if (!file || !file.raw) {
      return;
    }
    this.loadImage(file.raw);
    return false;
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
        resolve(true);
      });
    });
    this.image.src = URL.createObjectURL(file);
    promise.then(() => {
      this.$emit('image-load', this.image);
    });
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .content {
  }
}
</style>
