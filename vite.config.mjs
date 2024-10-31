import { defineConfig } from 'vite';
import path from 'path'; // pathモジュールをインポート
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../docs', // 出力先ディレクトリを dist に設定
    emptyOutDir: true, // 出力先のディレクトリを毎回空にする
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        access: path.resolve(__dirname, 'src/access.html'),
        concept: path.resolve(__dirname, 'src/concept.html'),
        menu: path.resolve(__dirname, 'src/menu.html'),
        shopDetail: path.resolve(__dirname, 'src/shop-detail.html'),
        shop: path.resolve(__dirname, 'src/shop.html'),
      },
    },
    assetsDir: 'assets',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/js/main.js', dest: 'js/' }, // `js`フォルダをコピー
        { src: 'src/components/*', dest: 'components' }, // `components`フォルダをコピー
        { src: 'src/images/*', dest: 'assets/images' } // `images`フォルダをコピーして`assets/images`に配置
      ],
    }),
  ],
});
