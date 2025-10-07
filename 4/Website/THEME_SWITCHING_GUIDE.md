# 主题切换功能使用指南

## 功能概述

网站现在支持深色和浅色主题切换功能。用户可以在设置页面中切换主题，主题选择会自动保存到本地存储中。

## 如何使用

### 1. 访问设置页面
- 导航到 `/settings` 路径
- 或者在网站中寻找"设置"链接

### 2. 切换主题
- 在设置页面的"常规"部分找到"主题"设置项
- 点击下拉菜单选择：
  - **深色** - 默认深色主题
  - **浅色** - 浅色主题
- 选择后主题会立即切换

### 3. 主题特性
- ✅ 实时切换，无需刷新页面
- ✅ 平滑过渡动画
- ✅ 自动保存到本地存储
- ✅ 页面刷新后保持选择
- ✅ 响应式设计，支持桌面和移动端

## 技术实现

### 文件结构
```
src/
├── composables/
│   └── useTheme.js          # 主题管理 composable
├── views/settings/
│   └── SettingsView.vue     # 设置页面
├── assets/
│   └── style.css           # 全局样式和主题变量
└── main.js                 # 应用入口，初始化主题
```

### 主题变量
系统使用 CSS 自定义属性（CSS Variables）来管理主题颜色：

**深色主题：**
- 背景：深蓝色 (#0A0A1A)
- 文字：白色 (#FFFFFF)
- 品牌色：深蓝 (#181830)

**浅色主题：**
- 背景：白色 (#FFFFFF)
- 文字：深色 (#1a1a2e)
- 品牌色：橙色 (#f59e0b)

### 核心功能

1. **主题状态管理** (`useTheme.js`)
   - 管理当前主题状态
   - 提供主题切换方法
   - 处理本地存储

2. **主题应用** (`main.js`)
   - 应用启动时初始化主题
   - 从本地存储加载保存的主题

3. **UI 集成** (`SettingsView.vue`)
   - 主题选择下拉菜单
   - 实时主题切换响应

## 开发说明

### 添加新的主题颜色
在 `useTheme.js` 中的 `themes` 对象中添加新的颜色变量：

```javascript
const themes = {
  dark: {
    cssVars: {
      '--your-new-color': '#your-color-value'
    }
  },
  light: {
    cssVars: {
      '--your-new-color': '#your-light-color-value'
    }
  }
}
```

### 在组件中使用主题变量
```css
.my-component {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}
```

### 添加新主题
1. 在 `useTheme.js` 的 `themes` 对象中添加新主题
2. 在 `SettingsView.vue` 的选项列表中添加新选项
3. 确保所有主题变量都有对应的颜色值

## 测试

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:5173/settings`
3. 切换主题下拉菜单
4. 验证页面颜色变化
5. 刷新页面验证主题持久化

## 浏览器兼容性

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

主题切换功能使用现代 CSS 特性，需要支持 CSS 自定义属性的浏览器。
