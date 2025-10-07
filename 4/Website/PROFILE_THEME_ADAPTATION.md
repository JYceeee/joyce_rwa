# Profile 页面主题适配配置

## 更新内容

### 1. 页面整体主题适配

#### 页面容器样式
```css
/* Profile 页面主题适配 */
.profile-page {
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}
```

### 2. 用户联系信息区域适配

#### 联系信息容器
```css
.user-contact-info {
  max-width: 1000px;
  margin: 20px 0;
  margin-left: 50px;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
}
```

#### 标签和文本样式
```css
.user-contact-info .label {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}
```

#### 联系项样式
```css
.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  transition: background-color 0.2s ease;
}

.contact-item:hover {
  background-color: var(--hover-bg);
  border-radius: 8px;
  margin: 0 -8px;
  padding-left: 8px;
  padding-right: 8px;
}
```

#### 联系标签和值样式
```css
.contact-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text);
  min-width: 80px;
  flex-shrink: 0;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.contact-value {
  color: var(--text);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: var(--bg-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  flex: 1;
  max-width: 200px;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  font-size: 13px;
  transition: all 0.2s ease;
}

.contact-value:hover {
  background: var(--hover-bg);
  border-color: var(--border-light);
}
```

### 3. 按钮样式适配

#### 小按钮样式
```css
.btn-small {
  background: var(--bg-secondary);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.btn-small:hover {
  background: var(--hover-bg);
}
```

### 4. 状态信息区域适配

#### 状态容器样式
```css
.status-section {
  max-width: 1000px;
  margin: 20px 0;
  margin-left: 50px;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
}
```

#### 状态标题和项目样式
```css
.status-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.status-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: var(--text);
}
```

## 主题变量映射

### 深色主题
```css
--bg: #0A0A1A                    /* 页面背景 */
--text: #FFFFFF                   /* 主要文字 */
--card-bg: #1a1a2e               /* 卡片背景 */
--border: #23234a                /* 边框颜色 */
--bg-secondary: #16213e          /* 次要背景 */
--hover-bg: #30304c              /* Hover 背景 */
--border-light: #3a3a5a          /* 浅色边框 */
--shadow: 0 8px 32px rgba(10,10,26,0.18) /* 阴影 */
```

### 浅色主题
```css
--bg: #FFFFFF                    /* 页面背景 */
--text: #1a1a2e                  /* 主要文字 */
--card-bg: #ffffff               /* 卡片背景 */
--border: #e5e7eb                /* 边框颜色 */
--bg-secondary: #f8fafc          /* 次要背景 */
--hover-bg: #f1f5f9              /* Hover 背景 */
--border-light: #e2e8f0          /* 浅色边框 */
--shadow: 0 8px 32px rgba(0,0,0,0.1) /* 阴影 */
```

## 适配效果对比

### 深色主题
- **页面背景**：深蓝色 (`#0A0A1A`)
- **卡片背景**：深灰色 (`#1a1a2e`)
- **文字颜色**：白色 (`#FFFFFF`)
- **边框颜色**：深蓝色 (`#23234a`)
- **特点**：现代科技感，适合深色环境

### 浅色主题
- **页面背景**：白色 (`#FFFFFF`)
- **卡片背景**：白色 (`#ffffff`)
- **文字颜色**：深色 (`#1a1a2e`)
- **边框颜色**：浅灰色 (`#e5e7eb`)
- **特点**：简洁明亮，适合明亮环境

## 交互效果

### Hover 状态
- **联系项 Hover**：使用 `var(--hover-bg)` 提供视觉反馈
- **按钮 Hover**：使用 `var(--hover-bg)` 增强交互体验
- **联系值 Hover**：使用 `var(--hover-bg)` 和 `var(--border-light)` 提供反馈

### 过渡动画
- **所有交互元素**：0.2s 的平滑过渡
- **颜色变化**：自动跟随主题切换
- **背景变化**：平滑的过渡效果

## 技术实现

### CSS 变量系统
- 使用 CSS 自定义属性实现主题切换
- 所有颜色和样式自动根据主题变化
- 保持设计一致性

### 响应式设计
- 适配所有屏幕尺寸
- 移动端和桌面端一致体验
- 保持布局的灵活性

### 性能优化
- 使用 CSS 变量减少重复代码
- 硬件加速的过渡效果
- 轻量级实现

## 使用方法

### 访问 Profile 页面
1. 导航到 `/profile` 路径
2. 页面会自动应用当前主题的样式

### 切换主题查看效果
1. 进入设置页面 `/settings`
2. 在"常规设置"中选择"浅色"或"深色"
3. 返回 Profile 页面查看样式变化

### 验证主题适配
- **深色主题**：深色背景，白色文字，深色卡片
- **浅色主题**：浅色背景，深色文字，浅色卡片
- **过渡效果**：所有元素都有平滑的过渡动画

## 兼容性

### 浏览器支持
- ✅ **Chrome**：完全支持 CSS 变量
- ✅ **Firefox**：完全支持 CSS 变量
- ✅ **Safari**：完全支持 CSS 变量
- ✅ **Edge**：完全支持 CSS 变量

### 设备支持
- ✅ **桌面端**：完美显示
- ✅ **平板端**：完美显示
- ✅ **移动端**：完美显示

## 预期效果

### 视觉一致性
- Profile 页面与整体网站主题保持一致
- 所有组件都正确适配主题变化
- 保持良好的视觉层次和可读性

### 用户体验
- 主题切换时所有元素平滑过渡
- 交互状态清晰明确
- 适应不同使用环境的需求

## 自定义选项

如果需要调整特定元素的样式，可以修改对应的主题变量：

### 调整卡片背景
```css
/* 在 useTheme.js 中修改 */
'--card-bg': '#your-color'
```

### 调整文字颜色
```css
/* 在 useTheme.js 中修改 */
'--text': '#your-color'
```

### 调整边框颜色
```css
/* 在 useTheme.js 中修改 */
'--border': '#your-color'
```
