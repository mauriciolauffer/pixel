import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import * as api from './services/api';
import { authClient } from './services/auth-client';
import { ref } from 'vue';

vi.mock('./services/api', () => ({
  fetchPixels: vi.fn(),
  updatePixel: vi.fn(),
}));

vi.mock('./services/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchPixels as any).mockResolvedValue([]);
    (authClient.useSession as any).mockReturnValue(ref({
      data: null,
      isPending: false,
    }));
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

  it('shows login section when not authenticated', () => {
    const wrapper = mountApp();
    expect(wrapper.findComponent({ name: 'Auth' }).exists()).toBe(true);
  });

  it('shows user info when authenticated', () => {
    (authClient.useSession as any).mockReturnValue(ref({
      data: { user: { name: 'Test User' } },
      isPending: false,
    }));
    const wrapper = mountApp();
    expect(wrapper.find('.user-info').text()).toContain('Logged in as Test User');
  });
});
