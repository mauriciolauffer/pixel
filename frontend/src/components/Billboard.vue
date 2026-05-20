<script lang="ts">
export default {
  name: 'Billboard'
}
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface Pixel {
  id: number;
  color: string;
  link: string;
}

const props = defineProps<{
  pixels: Pixel[];
}>();

const emit = defineEmits<{
  (e: 'pixel-click', id: number): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const WIDTH = 1000;
const HEIGHT = 1000;
const PIXEL_SIZE = 1;

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Fill with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  props.pixels.forEach((pixel) => {
    const x = pixel.id % WIDTH;
    const y = Math.floor(pixel.id / WIDTH);
    ctx.fillStyle = pixel.color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
  });
};

onMounted(() => {
  draw();
});

watch(() => props.pixels, () => {
  draw();
}, { deep: true });

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / PIXEL_SIZE);
  const y = Math.floor((event.clientY - rect.top) / PIXEL_SIZE);

  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    const id = y * WIDTH + x;
    emit('pixel-click', id);
  }
};
</script>

<template>
  <div class="billboard-container">
    <canvas
      ref="canvasRef"
      :width="WIDTH"
      :height="HEIGHT"
      @click="handleCanvasClick"
    ></canvas>
  </div>
</template>

<style scoped>
.billboard-container {
  overflow: auto;
  border: 1px solid #ccc;
  width: 1000px;
  height: 1000px;
  margin: 0 auto;
}
canvas {
  image-rendering: pixelated;
  cursor: crosshair;
}
</style>
