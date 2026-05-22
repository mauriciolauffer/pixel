import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import * as api from './services/api';

vi.mock('./services/api', () => ({
  fetchPixels: vi.fn(),
  updatePixel: vi.fn(),
}));

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchPixels as any).mockResolvedValue([]);
  });

  const mountApp = () => {
    return mount(App, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });
  };

  it('renders the title', () => {
    const wrapper = mountApp();
    expect(wrapper.find('h1').text()).toBe('Million Pixel Billboard');
  });

  it('shows editor when a pixel is clicked', async () => {
    const wrapper = mountApp();
    // Wait for initial load
    await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Billboard' }).exists()).toBe(true));

    const billboard = wrapper.findComponent({ name: 'Billboard' });
    await billboard.vm.$emit('pixel-click', 123);

    expect(wrapper.find('.editor').exists()).toBe(true);
    expect(wrapper.find('.editor h3').text()).toContain('Edit Pixel #123');
  });

  it('validates link before update', async () => {
    const wrapper = mountApp();
    window.alert = vi.fn();

    await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Billboard' }).exists()).toBe(true));
    const billboard = wrapper.findComponent({ name: 'Billboard' });
    await billboard.vm.$emit('pixel-click', 123);

    await wrapper.find('input[type="text"]').setValue('invalid-link');
    await wrapper.find('button').trigger('click');

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Invalid link'));
    expect(api.updatePixel).not.toHaveBeenCalled();
  });
});
