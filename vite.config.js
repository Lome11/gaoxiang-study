import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 部署到 GitHub Pages 时，base 设置为仓库名
  // 例如仓库名为 gaoxiang-vue，则 base = '/gaoxiang-vue/'
  // 如果部署到自定义域名或根路径，改为 '/'
  base: '/gaoxiang-study/',
})
