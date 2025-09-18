<template>
  <div>
    <h1 class="headline">Property Loans</h1>

    <!-- 筛选栏 -->
    <div class="filters" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 6px;">
      <input v-model="filters.q" class="input" placeholder="Search code/name" style="max-width:220px;height:38px" />

      <select v-model="filters.type" class="input" style="max-width:160px;height:38px">
        <option value="">All Types</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>

      <select v-model="filters.region" class="input" style="max-width:160px;height:38px">
        <option value="">All Regions</option>
        <option value="CBD">CBD</option>
        <option value="Suburban">Suburban</option>
      </select>

      <select v-model="filters.risk" class="input" style="max-width:160px;height:38px">
        <option value="">All Risk</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select v-model.number="filters.minYield" class="input" style="max-width:180px;height:38px">
        <option :value="0">Min Yield: Any</option>
        <option :value="5">≥ 5%</option>
        <option :value="6">≥ 6%</option>
        <option :value="7">≥ 7%</option>
      </select>

      <button class="btn" @click="resetFilters">Reset</button>
    </div>

    <div class="loan-grid">
      <article
        v-for="p in filteredProducts"
        :key="p.code"
        class="loan-card"
      >
        <img :src="p.image" class="loan-img" :alt="p.code" />
        <h3>{{ p.code }}</h3>
        <p>{{ p.subtitle }}</p>
        <div class="loan-actions">
          <a href="#" class="btn small primary">Buy</a>
          <a href="#" class="btn small orange">Sell</a>
          <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Detail</a>
        </div>
      </article>
    </div>
  </div>
  
</template>

<script>
export default { 
  name: 'ProjectsView',
  data(){
    return {
      filters: { q: '', type: '', region: '', risk: '', minYield: 0 },
      products: [
        {
          code: 'TYMU',
          name: 'TYMU Property Loan',
          image: '/pics/TYMU.png',
          subtitle: 'Prime Residential Mortgage Backed Loan',
          type: 'residential',
          region: 'Suburban',
          risk: 'low',
          targetYield: 6.5,
          metrics: {
            currentElaraPrice: 'A$1.00',
            collateralPropertyValue: 'A$1,250,000',
            rentalIncome: 'A$4,500 / month',
            targetLoanYield: '6.5% p.a.'
          }
        },
        {
          code: 'SQNB',
          name: 'SQNB Property Loan',
          image: '/pics/SQNB.png',
          subtitle: 'Commercial Mortgage Loan',
          type: 'commercial',
          region: 'CBD',
          risk: 'medium',
          targetYield: 7.2,
          metrics: {
            currentElaraPrice: 'A$1.02',
            collateralPropertyValue: 'A$2,400,000',
            rentalIncome: 'A$12,800 / month',
            targetLoanYield: '7.2% p.a.'
          }
        },
        {
          code: 'LZYT',
          name: 'LZYT Property Loan',
          image: '/pics/LZYT.png',
          subtitle: 'Suburban Residential Loan',
          type: 'residential',
          region: 'Suburban',
          risk: 'medium',
          targetYield: 6.9,
          metrics: {
            currentElaraPrice: 'A$0.98',
            collateralPropertyValue: 'A$980,000',
            rentalIncome: 'A$3,600 / month',
            targetLoanYield: '6.9% p.a.'
          }
        },
        {
          code: 'YYD',
          name: 'YYD Property Loan',
          image: '/pics/YYD.png',
          subtitle: 'CBD Apartment Mortgage',
          type: 'residential',
          region: 'CBD',
          risk: 'low',
          targetYield: 6.1,
          metrics: {
            currentElaraPrice: 'A$1.05',
            collateralPropertyValue: 'A$1,650,000',
            rentalIncome: 'A$5,700 / month',
            targetLoanYield: '6.1% p.a.'
          }
        }
      ]
    }
  },
  computed: {
    filteredProducts(){
      const q = this.filters.q.trim().toLowerCase()
      return this.products.filter(p => {
        const matchQ = !q || p.code.toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q)
        const matchType = !this.filters.type || p.type === this.filters.type
        const matchRegion = !this.filters.region || p.region === this.filters.region
        const matchRisk = !this.filters.risk || p.risk === this.filters.risk
        const matchYield = !this.filters.minYield || (p.targetYield || 0) >= this.filters.minYield
        return matchQ && matchType && matchRegion && matchRisk && matchYield
      })
    }
  },
  methods: {
    resetFilters(){ this.filters = { q: '', type: '', region: '', risk: '', minYield: 0 } },
    openDetail(code){
      const product = this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      this.$router.push({ name: 'detail', params: { code } })
    }
  }
}
</script>

<style scoped>
.h3 {
  color:black;
}
</style>