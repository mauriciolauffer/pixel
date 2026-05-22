<script lang="ts">
export default {
  name: 'Billboard'
}
</script>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { type Pixel, BILLBOARD_WIDTH, BILLBOARD_HEIGHT } from '@pixel/shared';

const props = defineProps<{
  pixels: Pixel[];
}>();

const emit = defineEmits<{
  (e: 'pixel-click', id: number): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

// Zoom and Pan state
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const lastMouseX = ref(0);
const lastMouseY = ref(0);

// Offscreen canvas for caching the board
let offscreenCanvas: HTMLCanvasElement | null = null;

const initOffscreen = () => {
  offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = BILLBOARD_WIDTH;
  offscreenCanvas.height = BILLBOARD_HEIGHT;
};

const drawOffscreen = () => {
  if (!offscreenCanvas) return;
  const ctx = offscreenCanvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, BILLBOARD_WIDTH, BILLBOARD_HEIGHT);

  props.pixels.forEach((pixel) => {
    const x = pixel.id % BILLBOARD_WIDTH;
    const y = Math.floor(pixel.id / BILLBOARD_WIDTH);
    ctx.fillStyle = pixel.color;
    ctx.fillRect(x, y, 1, 1);
  });
};

const render = () => {
  const canvas = canvasRef.value;
  if (!canvas || !offscreenCanvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(offsetX.value, offsetY.value);
  ctx.scale(scale.value, scale.value);
  ctx.drawImage(offscreenCanvas, 0, 0);
  ctx.restore();
};

onMounted(() => {
  initOffscreen();
  drawOffscreen();
  render();

  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  render();
};

watch(() => props.pixels, () => {
  drawOffscreen();
  render();
}, { deep: true });

// Zoom logic
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  const newScale = Math.min(Math.max(scale.value + delta, 0.1), 50);

  // Zoom towards mouse position
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const worldX = (mouseX - offsetX.value) / scale.value;
  const worldY = (mouseY - offsetY.value) / scale.value;

  scale.value = newScale;
  offsetX.value = mouseX - worldX * scale.value;
  offsetY.value = mouseY - worldY * scale.value;

  render();
};

// Pan logic
const handleMouseDown = (e: MouseEvent) => {
  if (e.button === 2) {
    isDragging.value = true;
    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    offsetX.value += e.clientX - lastMouseX.value;
    offsetY.value += e.clientY - lastMouseY.value;
    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
    render();
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleClick = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const worldX = Math.floor((mouseX - offsetX.value) / scale.value);
  const worldY = Math.floor((mouseY - offsetY.value) / scale.value);

  if (worldX >= 0 && worldX < BILLBOARD_WIDTH && worldY >= 0 && worldY < BILLBOARD_HEIGHT) {
    const id = worldY * BILLBOARD_WIDTH + worldX;
    emit('pixel-click', id);
  }
};

const preventContextMenu = (e: MouseEvent) => e.preventDefault();
</script>

<template>
  <div ref="containerRef" class="billboard-container">
    <canvas
      ref="canvasRef"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @click="handleClick"
      @contextmenu="preventContextMenu"
    ></canvas>
    <div class="controls">
      Zoom: {{ scale.toFixed(1) }}x (Use scroll to zoom, Right-click to pan)
    </div>
  </div>
</template>

<style scoped>
.billboard-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #eee;
  overflow: hidden;
  border: 1px solid #ccc;
}
canvas {
  display: block;
  image-rendering: pixelated;
  cursor: crosshair;
}
.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255,255,255,0.8);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}
</style>
