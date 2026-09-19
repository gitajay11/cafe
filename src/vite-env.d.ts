/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** HTTPS endpoint that accepts the reservation JSON POST. Optional. */
  readonly VITE_RESERVATION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
