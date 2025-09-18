<template>
  <section class="container">
    <header class="td-top">
      <h1 class="headline">Token details</h1>
      <div class="td-actions">
        <button class="btn" @click="menuOpen = !menuOpen">⋮</button>
        <div v-if="menuOpen" class="td-menu">
          <button class="td-item" @click="openInExplorer">View Asset in explorer</button>
          <button class="td-item" @click="hideToken">Hide {{ symbol }}</button>
          <button class="td-item danger" @click="deleteToken">Delete from my wallet</button>
        </div>
      </div>
    </header>

    <div class="td-grid">
      <article class="card">
        <h3>Overview</h3>
        <div class="kv"><span class="k">Network name</span><span class="v">{{ networkLabel }}</span></div>
        <div class="kv"><span class="k">Contract address</span><span class="v addr">{{ address }}</span></div>
        <div class="kv"><span class="k">Token decimal</span><span class="v">{{ decimals ?? '-' }}</span></div>
        <div class="kv"><span class="k">Spending caps</span><span class="v">—</span></div>
        <div class="kv"><span class="k">Token import date</span><span class="v">{{ importDate || '-' }}</span></div>
        <div class="kv"><span class="k">Token import source</span><span class="v">{{ importSource || 'metamask' }}</span></div>
      </article>

      <article class="card">
        <h3>Your activity</h3>
        <p class="muted">Activity list placeholder.</p>
      </article>
    </div>
  </section>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useWallet } from '/src/composables/useWallet'
import { ethers } from 'ethers'

export default {
  name: 'TokenDetailView',
  props: { address: { type: String, required: true } },
  setup(props){
    const { chainId, networkLabel } = useWallet()
    const symbol = ref('')
    const name = ref('')
    const decimals = ref(null)
    const menuOpen = ref(false)

    const provider = new ethers.BrowserProvider(window.ethereum, 'any')
    const ERC20_ABI = [
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)'
    ]

    onMounted(async () => {
      try {
        const c = new ethers.Contract(props.address, ERC20_ABI, provider)
        decimals.value = await c.decimals()
        symbol.value = await c.symbol()
        name.value = await c.name()
      } catch {}
      // try get import date from custom tokens store
      try {
        const raw = sessionStorage.getItem(`customTokens:${chainId.value}`)
        const list = raw ? JSON.parse(raw) : []
        const found = Array.isArray(list) ? list.find(x => (x.address || '').toLowerCase() === props.address.toLowerCase()) : null
        if (found && found.addedAt) {
          importDate.value = new Date(found.addedAt).toLocaleString()
          importSource.value = found.source || 'ImportFromUs'
        }
      } catch {}
    })

    function openInExplorer(){
      const cid = Number(chainId.value)
      const base = cid === 1 ? 'https://etherscan.io' : cid === 11155111 ? 'https://sepolia.etherscan.io' : ''
      const url = base ? `${base}/token/${props.address}` : `https://etherscan.io/token/${props.address}`
      window.open(url, '_blank')
    }

    function hideToken(){
      try {
        const key = `hiddenTokens:${chainId.value}`
        const raw = sessionStorage.getItem(key)
        const list = raw ? JSON.parse(raw) : []
        const set = new Set((Array.isArray(list) ? list : []).map(x => String(x).toLowerCase()))
        set.add(props.address.toLowerCase())
        sessionStorage.setItem(key, JSON.stringify(Array.from(set)))
        alert('Hidden successfully')
        window.history.back()
      } catch { alert('Hide failed') }
    }

    function deleteToken(){
      try {
        const key = `customTokens:${chainId.value}`
        const raw = sessionStorage.getItem(key)
        const list = raw ? JSON.parse(raw) : []
        const next = Array.isArray(list) ? list.filter(x => (x.address || '').toLowerCase() !== props.address.toLowerCase()) : []
        sessionStorage.setItem(key, JSON.stringify(next))
        alert('Deleted from custom tokens')
        window.history.back()
      } catch { alert('Delete failed') }
    }

    const importDate = ref('')
    const importSource = ref('')
    return { networkLabel, address: props.address, symbol, name, decimals, importDate, importSource, menuOpen, openInExplorer, hideToken, deleteToken }
  }
}
</script>

<style scoped>

/* Dark Navy / Almost Black background */
.container {
  background: #0A0A1A;
  min-height: 100vh;
  padding: 0 0 40px 0;
}
.td-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.headline {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}
.td-actions {
  position: relative;
}
.td-actions .btn {
  border: none;
  border-radius: 10px;
  height: 32px;
  background: #181830;
  color: #fff;
  font-size: 1.3rem;
}
.td-menu {
  position: absolute;
  right: 0;
  top: 36px;
  background: #181830;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(10,10,26,0.18);
  padding: 6px;
  z-index: 20;
  min-width: 200px;
}
.td-item {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  color: #fff;
  font-weight: 500;
  transition: background 0.2s;
}
.td-item:hover {
  background: #23234a;
}
.td-item.danger {
  color: #EAAB8D;
}
.td-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}
@media(min-width:900px){ .td-grid{ grid-template-columns:1.2fr 1fr } }
.card {
  background: rgba(20, 20, 40, 0.98);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(10,10,26,0.18);
  padding: 28px 24px;
  color: #e3e8f0;
  border: none;
}
.card h3 {
  color: #fff;
  margin: 2px 4px 18px;
  font-size: 1.3rem;
}
.kv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 10px 16px;
  margin: 8px 0;
  background: rgba(30, 30, 60, 0.85);
}
.kv .k {
  color: #8ca0c3;
}
.kv .v.addr {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #7dc4ff;
}
.muted {
  color: #8ca0c3;
}
/* Orange accent for buttons */
.btn-accent {
  background: #EAAB8D;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  padding: 10px 18px;
  box-shadow: 0 2px 8px rgba(234,171,141,0.18);
  transition: background 0.2s;
}
.btn-accent:hover {
  background: #e48c5a;
}
/* Blue-tinted photo style */
.card img, .card .photo {
  filter: brightness(0.95) contrast(1.05) hue-rotate(-20deg) saturate(1.2);
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(60,120,200,0.18);
}
</style>

