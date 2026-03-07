# 论文素材 · VitePress 站点

将当前目录下的 Markdown 文档部署为 VitePress 站点，兼容 **Web 浏览器** 与 **App 内浏览器**（如微信、钉钉、系统浏览器等）。

## 快速开始

```bash
# 安装依赖（若尚未安装）
npm install

# 本地开发
npm run docs:dev
```

浏览器访问 **http://localhost:5173**。

## 构建与预览

```bash
# 构建静态站点
npm run docs:build

# 本地预览构建结果
npm run docs:preview
```

构建产物在 `dist/` 目录，可部署到任意静态托管（如 GitHub Pages、Vercel、Netlify、Nginx 等）。

## GitHub Pages 部署

### 1. 使用 GitHub Actions（推荐）

仓库中已包含 `.github/workflows/deploy.yml`，按下列步骤即可用 GitHub Actions 自动部署到 GitHub Pages。

**步骤：**

1. **将本仓库推送到 GitHub**（若尚未推送）  
   - 在 GitHub 新建仓库，本地执行：
   ```bash
   git init
   git add .
   git commit -m "init: VitePress + GitHub Pages"
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```

2. **开启 GitHub Pages 并选择 Actions 源**  
   - 仓库 → **Settings** → **Pages**  
   - **Source** 选择 **GitHub Actions**（不要选 Branch）。

3. **触发部署**  
   - 推送代码到 `main` 分支会自动触发部署。  
   - 或：**Actions** 页选择 “Deploy to GitHub Pages” → **Run workflow**。

4. **访问站点**  
   - 项目站（仓库名非 `用户名.github.io`）：  
     `https://<用户名>.github.io/<仓库名>/`  
   - 用户/组织站（仓库名为 `用户名.github.io`）：  
     需把 workflow 里 `BASE_PATH` 改为 `'/'`，站点为 `https://<用户名>.github.io/`。

**自定义 base（可选）：**  
若使用自定义域名或用户站，在 `.github/workflows/deploy.yml` 的 “Build VitePress” 步骤中修改：

```yaml
env:
  BASE_PATH: '/'   # 用户/组织站或自定义域名
```

### 2. 本地构建后手动上传

```bash
# 项目站（替换 <仓库名> 为你的仓库名）
BASE_PATH=/<仓库名>/ npm run docs:build

# 将 dist/ 内容推送到 gh-pages 分支或上传到任意静态托管
```

## 移动端与 App 内兼容说明

- **viewport**：已设置 `width=device-width, initial-scale=1, maximum-scale=5`，适配手机与平板。
- **PWA/App 内**：已设置 `theme-color`、`apple-mobile-web-app-capable` 等，便于在 App WebView 中全屏或接近原生体验。
- **构建目标**：`esnext` + `chrome61`，兼顾现代浏览器与部分 App 内内核。

## 目录结构

- `index.md`：站点首页
- `1.开发方法.md` ~ `10.数据与集成.md`：正文文档（未移动原文件）
- `.vitepress/config.js`：站点与主题配置
- `public/logo.svg`：站点头部 Logo

## 修改内容

- 编辑对应 `.md` 文件即可，保存后开发服务器会热更新。
- 侧栏与导航在 `.vitepress/config.js` 的 `sidebar`、`nav` 中修改。
