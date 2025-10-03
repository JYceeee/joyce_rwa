<template>
  <div class="container">
    <div class="page-header">
      <h1>About Us</h1>
      <p class="page-subtitle">Innovative technology company dedicated to revolutionizing real estate investment</p>
    </div>

    <div class="about-content">
      <!-- 项目背景与愿景部分 -->
      <div class="background-vision-section">
        <h2>Background</h2>
        <!-- <div class="vision-content"> -->
          <div class="vision-text">
            <p class="vision-intro">
              <strong>RWAT dealmaker</strong>
              (stand for Real World Assets Tokenization deal maker) 
              is the creator of the real world assets tokenization project, 
              meaning that this platform is committed to protecting the investment safety of RWAT investors, 
              organizing legally compliant, low-risk, high-return and high-quality asset. 
              For example, residential mortgage loans with a mortgage rate of less than 70% and a rate of approximately 9% in Australia. 
              This platform aims to promote the transaction between investors and asset holders.
            </p>
            
            <p class="vision-intro">
              The underlying assets displayed on this platform are protected by the laws of the country where they are located, 
              and the funds can freely enter and exit that country. 
              If investors require, 
              the project transaction structure can be isolated and entrusted by a third-party institution to hold the underlying assets and funds.
            </p>
            
            <p class="vision-intro">
              In addition to facilitating transactions between investors and RWAT underlying asset holders, 
              this platform can also integrate the cooperation of all institutions in the RWA tokenization chain, 
              including professional RWA tokenization technology service companies and licensed issuers and exchanges of RWAT in various countries, 
              to achieve the successful issuance of RWA tokenization legally, efficiently, at low cost, and publicly or privately.
            </p>
          </div>
          <!-- <div class="vision-image">
            <div class="image-placeholder">🚀</div>
          </div> -->
        <!-- </div> -->
      </div>

      <div class="mission-section">
        <div class="mission-text">
          <h2>Our Mission</h2>
          <p>We are committed to revolutionizing traditional real estate investment through blockchain technology, allowing everyone to participate in high-quality real estate investment, and share the growth红利 of the real estate market.</p>
          <p>Through tokenization technology, we will break down traditional real estate investment that requires a large amount of capital into small, tradable units, allowing ordinary investors to enjoy stable returns from real estate investment.</p>
        </div>
        <div class="mission-image">
          <div class="image-placeholder">🏢</div>
        </div>
      </div>

      <div class="values-section">
        <h2>Core Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🔒</div>
            <h3>Security First</h3>
            <p>Use the most advanced encryption technology and multiple security measures to ensure the security of user assets and transactions.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🌐</div>
            <h3>Transparent and Open</h3>
            <p>All transaction records are stored on the chain, project information is completely transparent, allowing investors to invest clearly and clearly.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🚀</div>
            <h3>Continuous Innovation</h3>
            <p>Continuously explore new technologies, optimize user experience, and provide better services for investors.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>User-Centered</h3>
            <p>Provide professional,贴心 services, helping users achieve wealth增值。</p>
          </div>
        </div>
      </div>

      <div class="team-section">
        <h2>Core Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">👨‍💼</div>
            <h4>张明</h4>
            <p class="member-title"></p>
            <p class="member-bio">拥有15年金融科技经验，曾在多家知名金融机构担任高管职务。</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👩‍💻</div>
            <h4>李华</h4>
            <p class="member-title">CFO</p>
            <p class="member-bio">区块链技术专家，在分布式系统和智能合约开发方面有丰富经验。</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👨‍💼</div>
            <h4>王强</h4>
            <p class="member-title">CMO</p>
            <p class="member-bio">房地产行业资深专家，对市场趋势和投资机会有深刻洞察。</p>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2>Company Data</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">2023</div>
            <div class="stat-label">Year of Establishment</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">Team Members</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">$50M+</div>
            <div class="stat-label">Managed Assets</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1,200+</div>
            <div class="stat-label">Active Users</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUsView'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  color: var(--dark-text);
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.background-vision-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #ffffff;
  text-align: center;
}

.vision-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: start;
}

.vision-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vision-intro {
  color: #94a3b8;
  line-height: 1.8;
  font-size: 1.1rem;
  margin: 0;
  text-align: justify;
}

.vision-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mission-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.mission-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
}

.mission-text p {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 16px;
}

.mission-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-placeholder {
  font-size: 8rem;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  padding: 60px;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.values-section h2,
.team-section h2,
.stats-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #ffffff;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.value-card {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: transform 0.2s ease;
}

.value-card:hover {
  transform: translateY(-4px);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.value-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.value-card p {
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.team-member {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
}

.member-avatar {
  font-size: 4rem;
  margin-bottom: 20px;
}

.team-member h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.member-title {
  color: #f97316;
  font-weight: 500;
  margin-bottom: 12px;
}

.member-bio {
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-item {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 8px;
}

.stat-label {
  color: #94a3b8;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .background-vision-section h2 {
    font-size: 2rem;
  }
  
  .vision-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .mission-section {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .values-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
