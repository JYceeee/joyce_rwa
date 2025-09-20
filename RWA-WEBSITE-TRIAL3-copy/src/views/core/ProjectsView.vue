<template>
  <div class="container">
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
          <a href="#" class="btn small orange" @click.prevent="openTrade(p.code)" >Trade</a>
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
    },
    openTrade(code){
      const product = this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      this.$router.push({ name: 'tradeProject', params: { code } })
    }
  }
}
</script>

<style scoped>
:root{
  --orange:#f59e0b;
}

.container {
  background: #0a0a1a;
  min-height: 100vh;
  padding: 20px;
}

/* 标题深色主题 */
.headline {
  color: #ffffff !important;
  margin-bottom: 24px;
}

/* 筛选栏深色主题 */
.filters {
  background: transparent;
  padding: 16px;
  border-radius: 0;
  border: none;
  margin-bottom: 24px;
}

.filters .input {
  background: #141426;
  border: 1px solid #374151;
  color: #ffffff;
}

.filters .input::placeholder {
  color: #9ca3af;
}

.filters .btn {
  background: #374151;
  border: 1px solid #4b5563;
  color: #ffffff;
}

.filters .btn:hover {
  background: #4b5563;
}

/* 项目网格深色主题 */
.loan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 项目卡片深色主题 */
.loan-card {
  background: #1d1d36;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.loan-card:hover {
  border-color: #4b5563;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.loan-card h3 {
  color: #ffffff !important;
  font-size: 18px;
  font-weight: 700;
  margin: 12px 0 8px 0;
}

.loan-card p {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 16px;
}

.loan-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* 按钮深色主题 */
.loan-actions {
  display: flex;
  gap: 12px;
}

.btn.small {
  color: #ffffff !important;
  background: #1f2937;
  border: 1px solid #374151;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn.small:hover {
  background: #374151;
  border-color: #4b5563;
}

.btn.small.orange {
  color: #ffffff !important;
  background: #f97316;
  border-color: #f97316;
}

.btn.small.orange:hover {
  background: #ea580c;
  border-color: #ea580c;
  opacity: 1;
}
</style>