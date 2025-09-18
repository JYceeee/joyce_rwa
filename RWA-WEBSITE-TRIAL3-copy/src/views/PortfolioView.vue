<template>
  <div class="pf-page">
    <!-- 顶部操作按钮行（靠上，整行排满） -->
    <div class="pf-topbar">
      <div class="pf-actions">
        <button v-for="a in actions" :key="a.text" class="pf-pill">
          <span class="pf-pill-ico">{{ a.icon }}</span>
          <span>{{ a.text }}</span>
        </button>
      </div>
      <button class="pf-add">
        <span class="pf-add-ico">＋</span>
        Add an account
      </button>
    </div>

    <div class="pf-body">
      <!-- 侧栏：Accounts -->
      <aside class="pf-sidebar">
        <div class="pf-side-head">
          <h2>Accounts</h2>
          <div class="pf-side-tools">
            <span class="gear">⚙️</span>
            <span class="plus">＋</span>
          </div>
        </div>

        <div class="pf-acc-group">
          <button class="pf-acc-title" @click="accGroupOpen = !accGroupOpen">
            <span>Decentralized</span>
            <span class="caret" :class="{open: accGroupOpen}">▾</span>
          </button>

        <div v-show="accGroupOpen" class="pf-acc-item">
            <div class="pf-addr" :title="fullAddress">
              {{ shortAddress || '—' }}
            </div>
          </div>
        </div>
      </aside>

      <!-- 主区域 -->
      <main class="pf-main">
        <div class="pf-hero">
          <!-- <div class="pf-balance">
            $0.00
            <button class="pf-eye" title="toggle visibility">👁️</button>
          </div> -->
          <!-- <div class="pf-change">$0.00 (0.00%)</div> -->
          <div class="pf-balance">
            <!-- 原生币余额（链上） -->
            {{ nativeBalanceDisplay }} {{ nativeSymbol }}
            <button class="pf-eye" title="toggle visibility">👁️</button>
          </div>
          <!-- 如果坚持“只来自 MetaMask”，这行涨跌和法币可移除
          <div class="pf-change" style="display:none"></div> -->
        </div>

        <!-- Tabs -->
        <nav class="pf-tabs">
          <button
            v-for="t in tabs"
            :key="t"
            class="pf-tab"
            :class="{active: activeTab===t}"
            @click="activeTab=t"
          >{{ t }}</button>
        </nav>

        <!-- 工具条/筛选 -->
        <div class="pf-toolbar" v-if="activeTab==='Tokens'">
          <button class="pf-chip">
            <div class="pf-chain-badges">
              <span class="pf-badge eth">Ξ</span>
              <span class="pf-badge op">O</span>
              <span class="pf-badge arb">A</span>
              <span class="pf-badge more">+5</span>
            </div>
            <span class="pf-chip-text">8 Networks</span>
            <span class="pf-chip-caret">▾</span>
          </button>

          <button class="pf-chip">
            <span class="pf-chip-text">More</span>
            <span class="pf-chip-caret">▾</span>
          </button>

          <button class="pf-chip pf-chip-ghost">
            <span class="gift">🎁</span>
            No airdrops
          </button>
        </div>

        <!-- 内容：空状态 -->
        <div class="pf-empty" v-if="activeTab==='Tokens'">
          <div class="pf-empty-ico">🌱</div>
          <div class="pf-empty-title">No Tokens to Show</div>
          <button class="pf-cta">Token Marketplace</button>
        </div>

        <!-- 其它 Tab 占位 -->
        <div v-if="activeTab!=='Tokens'" class="pf-placeholder">
          <div class="pf-card">This is the {{ activeTab }} dashboard area.</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWallet } from '/src/composables/useWallet'

const actions = [
  // { icon: '#', text: '###' },
  { text: 'Buy' },
  { text: 'Swap' },
  { text: 'Bridge' },
  { text: 'Send' },
  { text: 'Sell' },
  { text: 'Stake' },
]
const tabs = ['Tokens', 'NFTs', 'DeFi', 'Transactions', 'Spending Caps']
const activeTab = ref('Tokens')
const accGroupOpen = ref(true)
const { fullAddress, shortAddress, connected } = useWallet()
</script>

<style scoped>
/* —— 这里保持你原来的样式 —— */
:root { --bg:#f6f7fb; --panel:#fff; --text:#0b1020; --muted:#6b7280; --muted-2:#9aa3b2; --border:#e6e8ef; --shadow:0 6px 20px rgba(15,23,42,.06); --primary:#3b82f6; --primary-ink:#1e40af; --danger:#ef4444; }
.pf-page{background:var(--bg);min-height:100vh;color:var(--text);}
.pf-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;position:sticky;top:0;z-index:10;background:var(--bg);}
.pf-actions{display:flex;gap:12px;flex-wrap:wrap;}
.pf-pill{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;}
.pf-pill-ico{width:22px;height:22px;display:grid;place-items:center;border-radius:999px;background:#f1f5ff;}
.pf-pill:hover{transform:translateY(-1px)}
.pf-add{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;}
.pf-add-ico{font-size:18px;line-height:1}
.pf-body{display:grid;grid-template-columns:280px 1fr;gap:16px;padding:0 20px 24px;}
.pf-sidebar{background:var(--panel);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow);padding:16px;}
.pf-side-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.pf-side-head h2{font-size:20px;font-weight:800;}
.pf-side-tools{display:flex;gap:10px;color:var(--muted)}
.pf-acc-group{margin-top:8px;}
.pf-acc-title{width:100%;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;padding:10px 8px;border-radius:10px;cursor:pointer;font-weight:600}
.caret{transition:.2s transform ease}
.caret.open{transform:rotate(180deg)}
.pf-acc-item{display:flex;align-items:center;gap:10px;margin-top:8px;padding:8px;border-radius:10px;background:#fafbff}
.pf-avatar{width:28px;height:28px;border-radius:50%;background:radial-gradient(100% 100% at 25% 25%,#ffd79a 0%,#ff9e6e 40%,#ff7b7b 100%);box-shadow: inset 0 0 0 2px #fff;}
.pf-addr{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;color:#334155}
.pf-main{background:var(--panel);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow);padding:16px 18px;}
.pf-hero{padding:8px 4px 12px;border-bottom:1px solid var(--border)}
.pf-balance{font-size:56px;font-weight:900;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;}
.pf-eye{border:none;background:transparent;cursor:pointer;font-size:20px}
.pf-change{color:var(--danger);font-weight:600;margin-top:4px}
.pf-tabs{display:flex;gap:32px;margin-top:8px;}
.pf-tab{appearance:none;background:none;border:none;cursor:pointer;padding:14px 0;font-weight:700;color:var(--muted);position:relative;}
.pf-tab.active{color:var(--primary)}
.pf-tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--primary);border-radius:3px;}
.pf-toolbar{display:flex;gap:14px;align-items:center;padding:16px 0;}
.pf-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--border);background:#fff;border-radius:999px;box-shadow:var(--shadow);font-weight:600;cursor:pointer;}
.pf-chip-ghost{background:#0f172a;color:#cbd5e1;border-color:#0f172a}
.pf-chip-text{white-space:nowrap}
.pf-chain-badges{display:flex;align-items:center;margin-left:-4px}
.pf-badge{width:24px;height:24px;border-radius:999px;display:grid;place-items:center;background:#eef2ff;margin-left:-6px;border:2px solid #fff;font-size:12px}
.pf-badge.eth{background:#dbeafe}
.pf-badge.op{background:#ffe4e6}
.pf-badge.arb{background:#dcfce7}
.pf-badge.more{background:#e2e8f0}
.pf-chip-caret{color:var(--muted-2)}
.pf-empty{display:grid;place-items:center;padding:48px 0 56px;text-align:center;gap:16px}
.pf-empty-ico{font-size:40px}
.pf-empty-title{font-weight:800;font-size:20px}
.pf-cta{padding:12px 18px;border-radius:12px;background:#111827;color:#fff;border:1px solid #111827;box-shadow:var(--shadow);cursor:pointer}
.pf-cta:hover{opacity:.9}
.pf-placeholder{padding:18px}
.pf-card{border:1px solid var(--border);border-radius:12px;padding:16px;background:#fff;color:var(--muted)}
@media (max-width:1024px){.pf-body{grid-template-columns:1fr}.pf-sidebar{order:2}.pf-main{order:1}}
</style>
