import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
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

  it('renders the title', () => {
    const wrapper = mount(App);
    expect(wrapper.find('h1').text()).toBe('Million Pixel Billboard');
  });

  it('loads pixels on mount', () => {
    mount(App);
    expect(api.fetchPixels).toHaveBeenCalled();
  });

  it('shows editor when a pixel is clicked', async () => {
    const wrapper = mount(App);
    // Find the Billboard component and emit a pixel-click
    const billboard = wrapper.findComponent({ name: 'Billboard' });
    await (billboard.vm as any).$emit('pixel-click', 123);

    expect(wrapper.find('.editor').exists()).toBe(true);
    expect(wrapper.find('.editor h3').text()).toContain('Edit Pixel #123');
  });

  it('calls updatePixel and reloads on update', async () => {
    (api.updatePixel as any).mockResolvedValue({ success: true });
    const wrapper = mount(App);
    const billboard = wrapper.findComponent({ name: 'Billboard' });
    await (billboard.vm as any).$emit('pixel-click', 456);

    await wrapper.find('button').trigger('click'); // The "Update" button

    expect(api.updatePixel).toHaveBeenCalledWith(expect.objectContaining({ id: 456 }));
    expect(api.fetchPixels).toHaveBeenCalledTimes(2); // Initial + after update
  });
});
