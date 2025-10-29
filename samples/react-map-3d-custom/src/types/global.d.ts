declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      VITE_API_KEY: string;
    }
  }
}

// If you are using modules, you can export an empty object to make this a module.
export {};