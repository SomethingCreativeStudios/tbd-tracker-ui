declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}


interface ImportMetaEnv {
  readonly VUE_APP_WEBSOCKET_PATH: string;
  readonly VUE_APP_USERNAME: string;
  readonly VUE_APP_PASSWORD: string;
  readonly VUE_APP_WEBSOCKET_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}