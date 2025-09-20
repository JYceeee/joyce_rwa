<template>
  <section class="container">
    <h1 class="headline">{{ model?.name || 'Project Detail' }}</h1>
    <div class="detail-grid">
      <article class="card">
        <h3>{{ model?.introTitle || 'Introduction' }}</h3>
        <p>{{ model?.introContent || '暂无介绍信息。' }}</p>
      </article>

      <article class="card">
        <h3>Financial Dashboard</h3>
        <div class="metrics">
          <div class="metric">
            <div class="label">Current Elara Price</div>
            <div class="value">{{ model?.metrics?.currentElaraPrice || '-' }}</div>
          </div>
          <div class="metric">
            <div class="label">Collateral Property Value</div>
            <div class="value">{{ model?.metrics?.collateralPropertyValue || '-' }}</div>
          </div>
          <div class="metric">
            <div class="label">Rental Income</div>
            <div class="value">{{ model?.metrics?.rentalIncome || '-' }}</div>
          </div>
          <div class="metric">
            <div class="label">Target Loan Yield</div>
            <div class="value">{{ model?.metrics?.targetLoanYield || '-' }}</div>
          </div>
        </div>
      </article>
    </div>
  </section>
  
</template>

<script>
export default { 
  name: 'DetailPage',
  props: { product: { type: Object, default: null } },
  computed: {
    model(){
      if (this.product) return this.product
      try {
        const cache = sessionStorage.getItem('lastProduct')
        if (cache) return JSON.parse(cache)
      } catch(e) {}
      return null
    }
  }
}
</script>

<style scoped>
.detail-grid{ display:grid; gap:16px; grid-template-columns: 1fr }
@media(min-width:900px){ .detail-grid{ grid-template-columns: 1.2fr 1fr } }
.metrics{ display:grid; gap:10px }
.metric{ display:flex; align-items:center; justify-content:space-between; border:1px solid var(--border); border-radius:12px; padding:10px 12px; background:#fff }
.label{ color:var(--muted); font-size:14px }
.value{ font-weight:700 }
</style>


