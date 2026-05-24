<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import Billboard from './components/Billboard.vue';
import Auth from './components/Auth.vue';
import { fetchPixels, updatePixel } from './services/api';
import { authClient } from './services/auth-client';

const queryClient = useQueryClient();
// @ts-ignore - Better Auth Vue types can be tricky
const session = authClient.useSession();
const user = computed(() => session.value?.data?.user);

const { data: pixels, isLoading } = useQuery({
  queryKey: ['pixels'],
  queryFn: fetchPixels,
  refetchInterval: 5000,
});

const mutation = useMutation({
  mutationFn: updatePixel,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['pixels'] });
  },
});

const selectedPixelId = ref<number | null>(null);
const color = ref('#ff0000');
const link = ref('');

const sanitizeLink = (url: string) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch (e) {
    return '';
  }
};

const handlePixelClick = (id: number) => {
  if (!user.value) {
    alert('Please login to edit pixels.');
    return;
  }
  selectedPixelId.value = id;
  const existing = pixels.value?.find(p => p.id === id);
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

  const sanitizedLink = sanitizeLink(link.value);
  if (link.value && !sanitizedLink) {
    alert('Invalid link. Only http and https are allowed.');
    return;
  }

  mutation.mutate({
    id: selectedPixelId.value,
    color: color.value,
    link: sanitizedLink
  });
  selectedPixelId.value = null;
};

const handleLogout = async () => {
  await authClient.signOut();
};
</script>

<template>
  <div class="app">
    <header>
      <h1>Million Pixel Billboard</h1>
      <div v-if="user" class="user-info">
        Logged in as {{ user.name }}
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </header>

    <div v-if="!user" class="auth-section">
      <Auth />
    </div>

    <div v-if="isLoading">Loading pixels...</div>
    <div v-else>
      <div v-if="selectedPixelId !== null" class="editor">
        <h3>Edit Pixel #{{ selectedPixelId }}</h3>
        <div class="input-group">
          <label>Color:</label>
          <input type="color" v-model="color" />
        </div>
        <div class="input-group">
          <label>Link URL:</label>
          <input type="text" v-model="link" placeholder="https://..." />
        </div>
        <div class="actions">
          <button @click="handleUpdate" :disabled="mutation.isPending.value">
            {{ mutation.isPending.value ? 'Updating...' : 'Update' }}
          </button>
          <button @click="selectedPixelId = null">Cancel</button>
        </div>
      </div>
      <Billboard :pixels="pixels ?? []" @pixel-click="handlePixelClick" />
    </div>
  </div>
</template>

<style>
.app {
  text-align: center;
  padding: 20px;
  font-family: sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.user-info {
  font-size: 14px;
}
.logout-btn {
  margin-left: 10px;
  padding: 4px 8px;
}
.auth-section {
  margin-bottom: 40px;
}
.editor {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  display: inline-block;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.input-group {
  margin: 10px 0;
  text-align: left;
}
.input-group label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
}
.input-group input[type="text"] {
  width: 250px;
  padding: 5px;
}
.actions {
  margin-top: 15px;
}
.actions button {
  margin: 0 5px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
