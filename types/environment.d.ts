declare global {
    namespace NodeJS {
        interface ProcessEnv {
        PORT?: string;
        NODE_ENV?: 'development' | 'production' | 'test';
        // Add other env vars your app uses
        }
    }
}

export {};