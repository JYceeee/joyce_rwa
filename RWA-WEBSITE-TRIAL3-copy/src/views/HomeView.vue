<template>
  <section class="container hero">
    <div class="grid">
      <div>
        <h1 class="headline">Invest in RWA Property<br />Loans with Daily Returns</h1>
        <p class="sub">
          Access verified Real World Assets (RWA) — mortgage-backed loans, tokenized for secure and transparent investing.
        </p>

        <form class="email-row" @submit.prevent="notify('Thanks! We will be in touch.')">
          <input class="input" id="email" name="email" type="email" placeholder="Enter your email" required />
          <button class="btn primary" type="submit">Get started</button>
        </form>

        <p class="foot">By continuing, you agree to our Terms and acknowledge our 
          <a href="/src/components/privacypolicy.vue">Privacy Policy.</a></p>
      </div>

      <div class="cards" aria-label="Highlights">
        <article class="card" aria-labelledby="listing-title">
          <h3 id="listing-title">New Listing</h3>
          <ul class="list">
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>AM-004 • Sydney CBD Apartment Loan</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Loan Size: $2,500,000</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Est. Yield (IRR): 8.2%</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Term: 24 months</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Status: Open for investment</span></li>
          </ul>
        </article>

        <article class="card" aria-labelledby="news-title">
          <h3 id="news-title">News</h3>
          <ul class="list">
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Daily accrual smart contract upgraded to V2 (more efficient gas usage).</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>New partnership with XYZ Audit for RWA loan verification.</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Join over 4,000+ approvals already growing with Mortgage RWA.</span></li>
            <li class="li"><span class="check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span>Upcoming listing: Melbourne Office Loan AM-005.</span></li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <header class="faq-header">
        <h2 class="faq-heading">Frequently asked questions</h2>
        <p class="faq-sub">Everything you need to know about the product and billing.</p>
      </header>

      <div class="faq-grid">
        <article class="faq-item"><div class="faq-icon">♡</div><h3 class="faq-title">Is there a free trial available?</h3><p class="faq-desc">Yes, you can try us for free for 30 days.</p></article>
        <article class="faq-item"><div class="faq-icon">⇄</div><h3 class="faq-title">Can I change my plan later?</h3><p class="faq-desc">Of course—pricing scales with your company.</p></article>
        <article class="faq-item"><div class="faq-icon">◎</div><h3 class="faq-title">What is your cancellation policy?</h3><p class="faq-desc">Cancel anytime and we’ll refund the difference already paid.</p></article>
        <article class="faq-item"><div class="faq-icon">▣</div><h3 class="faq-title">Can info be added to an invoice?</h3><p class="faq-desc">For now, add info to the workspace name.</p></article>
        <article class="faq-item"><div class="faq-icon">⧉</div><h3 class="faq-title">How does billing work?</h3><p class="faq-desc">Plans are per workspace, not per account.</p></article>
        <article class="faq-item"><div class="faq-icon">✉</div><h3 class="faq-title">How do I change my account email?</h3><p class="faq-desc">Use account settings from a computer.</p></article>
      </div>

      <div class="faq-cta">
        <div class="faq-cta-avatars" aria-hidden="true">
          <span class="avatar">A</span><span class="avatar">B</span><span class="avatar">C</span>
        </div>
        <h3 class="faq-cta-title">Still have questions?</h3>
        <p class="faq-cta-sub">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
        <a href="#" class="btn primary">Get in touch</a>
      </div>
    </div>
  </section>

  <section class="section wallet">
    <div class="container wallet-grid">
      <div class="wallet-visual">
        <img src="/icons/mobile-app-preview.png" alt="Mortgage RWA Wallet mobile preview" class="wallet-phone" />
      </div>
      <div class="wallet-copy">
        <span class="badge">New</span>
        <h2 class="wallet-title">Mortgage RWA Wallet</h2>
        <p class="wallet-sub">Manage your RWA assets in one place:<strong>Receiving Payment</strong>、<strong>Transfering</strong>、<strong>Exchanging</strong>、<strong>Buying</strong>in one safe wallet</p>
        <ul class="wallet-feats"><li>Non-custodial, self-held private keys</li><li>Daily income details and notifications</li><li>Fiat channels (compliant available regions)</li><li>Multi-chain support (EVM first)</li></ul>
        <div class="store-row">
          <a class="store-btn ios" href="#"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M16.365 1.43c.03 1.09-.4 1.9-1.01 2.63-.68.83-1.83 1.47-2.96 1.38-.13-1.04.35-2 .95-2.66.74-.83 1.99-1.46 3.02-1.35zM20.77 17.38c-.53 1.23-.8 1.77-1.5 2.86-1 1.53-2.41 3.43-4.17 3.45-1.56.02-1.97-1.01-4.1-1.01-2.13 0-2.59 1-4.14 1.03-1.77.03-3.13-1.65-4.14-3.17C.7 18.15-.52 14.34.9 11.5c1.01-2.01 2.82-3.29 4.96-3.32 1.54-.03 2.99 1.04 4.1 1.04 1.1 0 2.9-1.28 4.89-1.09.83.04 3.17.34 4.67 2.56-3.99 2.23-3.35 8.09 1.25 9.69z" fill="currentColor"/></svg><span>App Store</span></a>
          <a class="store-btn and" href="#"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M3.6 1.8l12.3 9-12.3 9c-.37-.21-.6-.6-.6-1.07V2.87c0-.47.23-.86.6-1.07zm13.78 9L18 9.34 6.36 1.8l10.02 11zm0 0L6.36 22.2 18 14.66l-.62-.82zM19.1 13.88l2.9-1.88-2.9-1.88c-.2-.13-.46-.07-.6.13l-1.2 1.75 1.2 1.75c.14.2.4.26.6.13z" fill="currentColor"/></svg><span>Google Play</span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView',
  emits: ['notify'],
  methods: { notify(msg){ this.$emit('notify', msg) } }
}
</script>

<style scoped>
.faq-grid {
  background: #141426;
  border-radius: 16px;
  padding: 32px 24px;
}
.faq-item {
  background: #0A0A19;
  border-radius: 12px;
  padding: 18px 16px;
}
.faq-cta {
  background: #141426;
  border-radius: 16px;
  padding: 28px 20px;
}
.wallet-grid {
  background: #141426;
  border-radius: 16px;
  padding: 32px 24px;
}
.section.wallet {
  background: #0A0A19;
}
</style>
