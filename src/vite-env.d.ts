/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT?: string;
  readonly VITE_DEFAULT_CAMERA_FACING?: 'user' | 'environment';
  readonly VITE_CAPTURE_RESOLUTION_WIDTH?: string;
  readonly VITE_CAPTURE_RESOLUTION_HEIGHT?: string;
  readonly VITE_PHOTOS_TO_CAPTURE?: string;
  readonly VITE_COUNTDOWN_SECONDS?: string;
  readonly VITE_PHOTOS_TO_SELECT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
