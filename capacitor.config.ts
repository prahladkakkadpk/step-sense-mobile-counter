
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.4f70cf0c0f0c493cb85b54cee365eb05',
  appName: 'Step Counter',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://4f70cf0c-0f0c-493c-b85b-54cee365eb05.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
