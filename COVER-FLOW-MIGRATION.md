# 第三屏视频 Cover Flow 移植说明

来源：https://github.com/opc8838-hub/cover-flow-showcase

参考源码：`src/CoverFlow.tsx`、`src/styles.css`。原组件使用 React 和 CSS 3D，图片卡片在中心放大、两侧倾斜；支持鼠标水平移动、滚轮、循环切换和自动居中。此次将该交互适配为现有视频数据及播放弹窗，并保留当前页面配色和上下居中的排版。

## 文件位置

项目目录：`B:\2026作品集网站`

| 文件 | 作用 |
| --- | --- |
| `src/components/VideoCoverFlow.jsx` | 新组件：循环位移、滚轮/鼠标切换、自动居中、分页点、键盘、触摸拖动和视频预览 |
| `src/components/VideoCoverFlow.css` | 独立样式：立体卡片、倒影、透明舞台、两侧渐隐及移动端尺寸 |
| `src/App.jsx` | 导入新组件；`WorksVideoShowcase` 替换原环形动画并接入播放弹窗 |
| `public/videos/aigc-01.mp4` 至 `aigc-07.mp4` | 复用已有视频，无需重新复制素材 |
| `public/videos/posters/` | 复用已有封面 |
| `third-party/cover-flow-showcase-LICENSE.txt` | 原项目 MIT 许可与来源；发布副本位于 `public/third-party/` |
| `migration-backups/before-cover-flow/` | 本次移植前的 App.jsx、styles.css 备份 |

## 依赖

使用项目已有的 React、React DOM、Vite。新增组件为 JSX，不需要 TypeScript、Framer Motion、GSAP、Three.js 或其他新依赖。`package.json` 和锁文件未修改。

## 已完成的移植步骤

1. 将上游 TypeScript 的循环位置计算和居中缓动适配为 `VideoCoverFlow.jsx`；保留滚轮灵敏度 `/230`、鼠标移动灵敏度 `/165`、侧转角 `62deg` 和居中系数 `0.145`，居中系数按帧间隔校正。
2. 将图片展示改为 `<video muted loop playsInline>`，配合现有 poster；仅居中视频自动预览，离开屏幕、页面切到后台或打开播放弹窗时暂停。
3. 用独立 CSS 类名隔离样式；舞台、横向视频比例和粉色配色适配当前作品集，不导入上游的全局 body、hero 样式。
4. 在 App.jsx 中引入组件，通过 `items={orbitShowcaseVideos}` 接入七个视频，通过 `onSelect` 打开原视频弹窗；侧面卡片第一次点击先居中，居中卡片点击播放。
5. 增加左右按钮、分页点、方向键、触摸拖动及拖动后点击抑制。滚轮仅在卡片舞台范围内用于切换，在外部照常滚动网页；Ctrl+滚轮保留浏览器缩放。
6. 保留 MIT 原许可，并将发布副本放入 public，构建时一起进入 dist。

## 启动和构建

在 PowerShell 中运行：

```powershell
Set-Location 'B:\2026作品集网站'
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173 --strictPort
```

打开 http://127.0.0.1:4173/ ，点击“视觉展示”。预览服务已启动时不要重复运行。

构建命令（此电脑无需依赖 npm 命令在 PATH 中）：

```powershell
node node_modules/vite/bin/vite.js build
```

已安装完整 npm 的环境也可以使用 `npm run dev`、`npm run build`。

## 后续调节

- 视频顺序、标题和素材路径：App.jsx 中的 `orbitShowcaseVideos`。
- 卡片尺寸、舞台高度、倒影和颜色：VideoCoverFlow.css。
- 滚轮速度：VideoCoverFlow.jsx 的 `/230`，分母增大则更慢。
- 鼠标速度：`/165`，分母增大则更慢。
- 居中柔和程度：`.145`，减小会延长停靠时间。
- 侧面倾角：`-62`；卡片间距为桌面首张 `450`、后续 `175`。

## 回退

将 `migration-backups/before-cover-flow/App.jsx` 恢复到 `src/App.jsx` 即可重新接回旧环形交互。若同时需要恢复此前样式，可将备份 styles.css 恢复到 src/styles.css。恢复后重新构建。备份是本次移植开始时的状态，后续另有修改时应先比较差异。
