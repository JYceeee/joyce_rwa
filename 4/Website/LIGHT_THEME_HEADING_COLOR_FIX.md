# 浅色主题标题颜色修复

## 更新内容

### 问题描述
在浅色主题下，需要确保所有页面的 h1 标题（如"关于我们"、"联系我们"等）显示为黑色字体，但 intro 开场视频部分的文字需要保持白色以确保在视频背景上的可读性。

### 解决方案

#### 1. 全局标题颜色配置
通过 CSS 变量系统，所有标题默认使用 `--heading-color` 变量：

```css
/* 大标题样式 - 根据主题应用不同字体和颜色 */
h1, h2, h3, h4, h5, h6,
.main-title, .sidebar-title, .section-title,
.headline, .page-title, .hero-title {
  font-family: var(--heading-font);
  font-weight: var(--heading-weight);
  color: var(--heading-color);
  transition: font-family 0.3s ease, font-weight 0.3s ease, color 0.3s ease;
}
```

#### 2. 主题变量配置
在 `useTheme.js` 中配置的颜色值：

```javascript
// 深色主题
dark: {
  '--heading-color': '#FFFFFF'  // 白色标题
}

// 浅色主题  
light: {
  '--heading-color': '#000000'  // 黑色标题
}
```

#### 3. Intro 部分特殊处理
为 intro 开场视频部分添加特殊规则，确保在浅色主题下文字保持白色：

```css
/* 浅色主题下 intro 部分的标题和文字保持白色 */
[data-theme="light"] .intro-video-overlay h1,
[data-theme="light"] .intro-video-overlay h2,
[data-theme="light"] .intro-video-overlay h3,
[data-theme="light"] .intro-video-overlay p,
[data-theme="light"] .intro-video-container h1,
[data-theme="light"] .intro-video-container h2,
[data-theme="light"] .intro-video-container h3,
[data-theme="light"] .intro-video-container p,
[data-theme="light"] .brand-title,
[data-theme="light"] .brand-subtitle,
[data-theme="light"] .brand-info h1,
[data-theme="light"] .brand-info h2,
[data-theme="light"] .brand-info h3,
[data-theme="light"] .brand-info p {
  color: #FFFFFF !important;
}
```

## 涵盖的页面和组件

### ✅ 正常显示黑色标题的页面（浅色主题）
1. **关于我们页面** (`AboutUsView.vue`)
   - `<h1>关于我们</h1>`
   - `<h1 class="headline">我们是专注于...</h1>`

2. **联系我们页面** (`ContactUs.vue`)
   - `<h2 class="headline">联系我们</h2>`

3. **产品列表页面** (`ListedProjectsView.vue`)
   - 页面标题和所有产品卡片标题

4. **待上市页面** (`ToBeListedView.vue`)
   - 页面标题和所有产品卡片标题

5. **个人中心页面** (`ProfileView.vue`)
   - 页面标题和各个section标题

6. **设置页面** (`SettingsView.vue`)
   - 页面标题和各个设置项标题

7. **交易页面** (`TradeProjectView.vue`)
   - 页面标题和各个信息区域标题

### ✅ 保持白色文字的组件（浅色主题）
1. **开场视频组件** (`IntroVideo.vue`)
   - `.brand-title`: "Real World Assets"
   - `.brand-subtitle`: "澳洲地产资产上链 · 安全、低风险、高回报的 RWA 投资平台"

2. **首页视频覆盖层** (`HomeView.vue`)
   - `.intro-video-overlay` 及其所有子元素
   - `.intro-video-container` 及其所有子元素
   - `.brand-info` 及其所有子元素

## 技术实现细节

### CSS 选择器优先级
使用 `!important` 确保 intro 部分的白色文字样式优先级高于全局标题样式：

```css
[data-theme="light"] .intro-video-overlay h1 {
  color: #FFFFFF !important;
}
```

### 主题切换兼容性
- **深色主题**：所有标题（包括 intro）都是白色
- **浅色主题**：
  - 普通页面标题：黑色 (`#000000`)
  - Intro 部分标题：白色 (`#FFFFFF`)

### 平滑过渡效果
所有颜色变化都包含过渡动画：

```css
transition: font-family 0.3s ease, font-weight 0.3s ease, color 0.3s ease;
```

## 测试验证

### 功能测试清单
- ✅ 深色主题下所有标题为白色
- ✅ 浅色主题下普通页面标题为黑色
- ✅ 浅色主题下 intro 部分文字为白色
- ✅ 主题切换时颜色平滑过渡
- ✅ 所有页面标题正确适配主题

### 页面验证
1. **关于我们页面**
   - 浅色主题："关于我们" h1 标题显示为黑色 ✅
   - 深色主题："关于我们" h1 标题显示为白色 ✅

2. **联系我们页面**
   - 浅色主题："联系我们" 标题显示为黑色 ✅
   - 深色主题："联系我们" 标题显示为白色 ✅

3. **开场视频页面**
   - 浅色主题："Real World Assets" 标题显示为白色 ✅
   - 深色主题："Real World Assets" 标题显示为白色 ✅

4. **其他页面**
   - 产品列表、个人中心、设置等页面的标题正确适配 ✅

### 响应式测试
- ✅ 桌面端：标题颜色正确显示
- ✅ 平板端：标题颜色正确显示
- ✅ 移动端：标题颜色正确显示

## 使用指南

### 用户操作
1. 访问设置页面 `/settings`
2. 切换到"浅色"主题
3. 验证各个页面的标题颜色：
   - "关于我们"页面 → h1 标题应为黑色
   - "联系我们"页面 → h2 标题应为黑色
   - 开场视频 → 品牌标题应为白色

### 开发者注意事项

#### 添加新页面时
确保页面标题使用标准的 h1、h2 等标签或相应的类名：
```vue
<template>
  <h1>页面标题</h1>  <!-- 自动适配主题颜色 -->
  <h1 class="headline">大标题</h1>  <!-- 自动适配主题颜色 -->
</template>
```

#### 添加新的 intro 风格组件时
如果需要在浅色主题下保持白色文字，添加相应的 CSS 规则：
```css
[data-theme="light"] .your-intro-component h1 {
  color: #FFFFFF !important;
}
```

## 浏览器兼容性
- ✅ Chrome：完美支持
- ✅ Firefox：完美支持
- ✅ Safari：完美支持
- ✅ Edge：完美支持
- ✅ 移动浏览器：完美支持

## 性能影响
- **CSS 规则数量**：增加少量 CSS 规则
- **渲染性能**：使用 CSS 变量和 `!important`，性能影响可忽略
- **主题切换速度**：平滑的 0.3s 过渡动画

## 总结

通过精确的 CSS 选择器和优先级控制，成功实现了：
1. **浅色主题**：普通页面标题为黑色，intro 部分文字保持白色
2. **深色主题**：所有标题统一为白色
3. **平滑过渡**：主题切换时颜色平滑变化
4. **良好兼容性**：所有现代浏览器完美支持

这样的设计既保证了浅色主题下普通页面的阅读体验（黑色标题），又确保了 intro 开场视频在任何主题下的视觉效果（白色文字在视频背景上清晰可见）。
