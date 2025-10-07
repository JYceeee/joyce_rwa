# WalletView浅色主题更新

## 更新内容

为WalletView.vue页面的代币管理界面添加了浅色主题支持，确保在浅色主题下界面元素有适当的颜色对比度和视觉效果。

## 修改的文件

### WalletView.vue
**位置**: `Website/src/views/core/WalletView.vue`
**行数**: 1996-2022, 1972-2022

## 具体更新

### 1. 自定义代币输入区域样式
**位置**: 第1996-2022行

**深色主题样式** (保持不变):
```css
.mm-custom{
  margin-top:12px;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 18px 20px 12px 20px;
  background: #1d1d36;
}
.mm-input{
  height:36px;
  border:1px solid #2a2a4a;
  border-radius:10px;
  padding:0 10px;
  outline:none;
  background:#1d1d36;
  color:#ffffff;
}
.mm-input::placeholder{
  color:#94a3b8;
}
```

**新增浅色主题样式**:
```css
[data-theme="light"] .mm-custom{
  border: 1px solid #d1d5db;
  background: #ffffff;
}
[data-theme="light"] .mm-input{
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #000000;
}
[data-theme="light"] .mm-input::placeholder{
  color: #6b7280;
}
```

### 2. 代币列表样式
**位置**: 第1972-2022行

**深色主题样式** (保持不变):
```css
.mm-tokenlist{
  margin-top:8px;
  border:1px solid #2a2a4a;
  border-radius:16px;
  overflow:hidden;
  background:#1d1d36;
}
.mm-token{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 16px;
  border-bottom:1px solid #2a2a4a;
  color:#ffffff;
}
.mm-token-icon{
  width:36px;
  height:36px;
  border-radius:50%;
  background:#2a2a4a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  color:#FFFFFF;
}
```

**新增浅色主题样式**:
```css
[data-theme="light"] .mm-tokenlist{
  border: 1px solid #d1d5db;
  background: #ffffff;
}
[data-theme="light"] .mm-token{
  border-bottom: 1px solid #e5e7eb;
  color: #000000;
}
[data-theme="light"] .mm-token-icon{
  background: #f3f4f6;
  color: #374151;
}
[data-theme="light"] .mm-token-title{
  color: #000000;
}
[data-theme="light"] .mm-dim{
  color: #6b7280;
}
[data-theme="light"] .mm-token-amount{
  color: #6b7280;
}
[data-theme="light"] .mm-token-sub{
  color: #000000;
}
[data-theme="light"] .mm-token-footer{
  color: #6b7280;
}
[data-theme="light"] .mm-tip{
  color: #6b7280;
}
```

## 颜色说明

### 浅色主题颜色方案
- **背景色**: `#ffffff` (纯白色)
- **边框色**: `#d1d5db` (浅灰色)
- **分割线**: `#e5e7eb` (更浅的灰色)
- **主文字**: `#000000` (黑色)
- **次要文字**: `#6b7280` (中灰色)
- **图标背景**: `#f3f4f6` (浅灰背景)
- **占位符文字**: `#6b7280` (中灰色)

## 影响的界面元素

### 1. 合约地址输入区域
- ✅ 整体容器背景和边框
- ✅ 输入框背景、边框和文字
- ✅ 占位符文字颜色

### 2. 代币列表区域
- ✅ 列表容器背景和边框
- ✅ 代币卡片背景和分割线
- ✅ 代币图标背景和文字
- ✅ 代币名称和金额文字
- ✅ 次要信息文字颜色

### 3. 按钮样式
- ✅ 按钮已经使用主题变量，自动适应主题切换

## 兼容性

- 与现有的主题切换系统完全兼容
- 保持深色主题的原有样式不变
- 确保在浅色主题下有良好的可读性和对比度
- 支持所有现有的交互功能
