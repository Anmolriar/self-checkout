// src/types/environment.d.ts
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string;
        NODE_ENV: 'development' | 'production' | 'test';
        GOOGLE_CLOUD_PROJECT_ID: string;
        GOOGLE_CLOUD_KEY_PATH: string;
        // Add other environment variables here
      }
    }
  }
  
  // If this file has no imports/exports, add this line
  export {};