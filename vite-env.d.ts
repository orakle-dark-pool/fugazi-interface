/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMON_POOL_ID: string;
  readonly VITE_AUTH_POOL_ID: string;
  readonly VITE_NOTICE_POOL_ID: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_LOGIN_ID: string;
  readonly VITE_PASSWORD: string;
  // 여기에 더 많은 환경 변수를 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
