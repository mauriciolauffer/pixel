<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Billboard from './components/Billboard.vue';
import { fetchPixels, updatePixel, type Pixel } from './services/api';

const pixels = ref<Pixel[]>([]);
const selectedPixelId = ref<number | null>(null);
const color = ref('#ff0000');
const link = ref('https://example.com');

const loadPixels = async () => {
  try {
    pixels.value = await fetchPixels();
  } catch (e) {
    console.error(e);
  }
};

const handlePixelClick = (id: number) => {
  selectedPixelId.value = id;
  const existing = pixels.value.find(p => p.id === id);
  if (existing) {
    color.value = existing.color;
    link.value = existing.link;
  } else {
    color.value = '#ff0000';
    link.value = '';
  }
};

const handleUpdate = async () => {
  if (selectedPixelId.value === null) return;
  try {
    await updatePixel({
      id: selectedPixelId.value,
      color: color.value,
      link: link.value
    });
    await loadPixels();
    selectedPixelId.value = null;
  } catch (e) {
    alert('Failed to update pixel');
  }
};

onMounted(() => {
  loadPixels();
});
</script>

<template>
  <div class="app">
    <h1>Million Pixel Billboard</h1>
    <div v-if="selectedPixelId !== null" class="editor">
      <h3>Edit Pixel #{{ selectedPixelId }}</h3>
      <input type="color" v-model="color" />
      <input type="text" v-model="link" placeholder="Link URL" />
      <button @click="handleUpdate">Update</button>
      <button @click="selectedPixelId = null">Cancel</button>
    </div>
    <Billboard :pixels="pixels" @pixel-click="handlePixelClick" />
  </div>
</template>

<style>
.app {
  text-align: center;
  padding: 20px;
}
.editor {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  display: inline-block;
}
</style>
