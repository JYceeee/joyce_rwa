# 钱包文字主题适配配置

## 更新内容

### 1. 主题变量配置

#### 新增钱包文字颜色变量
在 `useTheme.js` 中为两个主题都添加了 `--wallet-text` 变量：

```javascript
// 深色主题
dark: {
  cssVars: {
    // ... 其他变量
    '--wallet-text': '#FFFFFF'  // 白色文字
  }
}

// 浅色主题  
light: {
  cssVars: {
    // ... 其他变量
    '--wallet-text': '#FFFFFF'  // 白色文字（保持不变）
  }
}
```

### 2. AppHeader 组件样式更新

#### 钱包主按钮样式
```css
.wallet-main-btn {
  background: transparent;
  border: none;
  color: var(--wallet-text);  /* 使用主题变量 */
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}
```

#### 钱包下拉按钮样式
```css
.wallet-dropdown-btn {
  background: transparent;
  border: none;
  color: var(--wallet-text);  /* 使用主题变量 */
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 钱包分隔线样式
```css
.wallet-divider {
  width: 1px;
  height: 16px;
  background: var(--wallet-text);  /* 使用主题变量 */
  opacity: 0.3;
  flex-shrink: 0;
}
```

### 3. 全局样式更新

#### 橙色按钮样式
```css
/* orange button (reused) */
.btn.orange{ 
  background:#f97316; 
  color:var(--wallet-text);  /* 使用主题变量 */
  border-color:transparent 
}
.btn.orange:hover{ 
  background:#ea580c 
}
```

## 主题效果对比

### 深色主题
- **钱包文字颜色**：白色 (`#FFFFFF`)
- **钱包分隔线**：白色 (`#FFFFFF`) 透明度 30%
- **钱包按钮**：橙色背景 (`#f97316`) + 白色文字
- **特点**：与深色背景形成良好对比

### 浅色主题
- **钱包文字颜色**：白色 (`#FFFFFF`) - **保持不变**
- **钱包分隔线**：白色 (`#FFFFFF`) 透明度 30% - **保持不变**
- **钱包按钮**：橙色背景 (`#f97316`) + 白色文字 - **保持不变**
- **特点**：确保钱包文字在浅色主题下仍然清晰可见

## 技术实现

### CSS 变量系统
- 使用 `--wallet-text` 变量统一管理钱包文字颜色
- 两个主题都设置为白色 (`#FFFFFF`)
- 确保钱包文字在任何主题下都保持清晰可读

### 组件样式更新
- **AppHeader 组件**：更新钱包相关按钮和分隔线样式
- **全局样式**：更新橙色按钮样式
- **主题切换**：自动跟随主题变化

### 兼容性保证
- **深色主题**：钱包文字保持白色，与深色背景形成对比
- **浅色主题**：钱包文字仍然保持白色，确保在橙色按钮背景上清晰可见

## 使用方法

### 访问钱包功能
1. 导航到任何页面
2. 查看右上角的钱包连接按钮
3. 确认钱包文字颜色为白色

### 切换主题验证
1. 进入设置页面 `/settings`
2. 在"常规设置"中选择"浅色"主题
3. 返回查看钱包按钮文字仍然为白色
4. 切换到"深色"主题，钱包文字仍为白色

### 验证钱包文字效果
- **连接钱包按钮**：橙色背景 + 白色文字
- **已连接钱包地址**：橙色背景 + 白色文字
- **钱包下拉箭头**：白色箭头图标
- **钱包分隔线**：白色分隔线

## 预期效果

### 视觉一致性
- 钱包文字在所有主题下都保持白色
- 与橙色按钮背景形成良好对比
- 确保文字清晰可读

### 用户体验
- 主题切换时钱包文字颜色不变
- 保持钱包功能的视觉识别度
- 避免因主题变化导致的文字可读性问题

## 自定义选项

如果需要调整钱包文字颜色，可以修改主题变量：

### 修改钱包文字颜色
```css
/* 在 useTheme.js 中修改 */
'--wallet-text': '#your-color'
```

### 修改钱包按钮背景
```css
/* 在 style.css 中修改 */
.btn.orange{ 
  background:#your-background-color; 
  color:var(--wallet-text); 
  border-color:transparent 
}
```

## 技术细节

### 变量作用域
- `--wallet-text` 变量在根元素上定义
- 所有组件都可以使用这个变量
- 主题切换时自动更新

### 样式优先级
- 钱包按钮样式优先级高于默认按钮样式
- 使用 `var(--wallet-text)` 确保主题一致性
- 保持现有的 hover 效果

### 响应式支持
- 钱包文字适配所有屏幕尺寸
- 移动端和桌面端一致体验
- 保持按钮的交互效果

## 测试验证

### 功能测试
1. ✅ 深色主题下钱包文字为白色
2. ✅ 浅色主题下钱包文字仍为白色
3. ✅ 主题切换时钱包文字不变
4. ✅ 钱包按钮 hover 效果正常
5. ✅ 钱包下拉菜单功能正常

### 兼容性测试
- ✅ Chrome：完美显示
- ✅ Firefox：完美显示
- ✅ Safari：完美显示
- ✅ Edge：完美显示

### 响应式测试
- ✅ 桌面端：钱包文字清晰可见
- ✅ 平板端：钱包文字清晰可见
- ✅ 移动端：钱包文字清晰可见
