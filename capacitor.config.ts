import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hsementor.app',
  appName: 'HSE Mentor',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: { allowMixedContent: false }
};

export default config;
