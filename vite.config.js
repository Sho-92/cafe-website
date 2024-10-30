import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../docs', // 出力先ディレクトリを dist に設定
  },
});
