<template>
  <div class="container">
    <div class="page-header">
      <h1>Learning Center</h1>
      <p class="page-subtitle">Learn how to start your real estate tokenization investment journey</p>
    </div>

    <div class="tutorials-content">
      <div class="tutorial-categories">
        <div class="category-card">
          <div class="category-icon">🚀</div>
          <h3>Newcomer's Guide</h3>
          <p>Learn how to start your real estate tokenization investment journey</p>
          <ul>
            <li><a href="#">What is real estate tokenization?</a></li>
            <li><a href="#">How to create a wallet?</a></li>
            <li><a href="#">First investment guide</a></li>
          </ul>
        </div>

        <div class="category-card">
          <div class="category-icon">💡</div>
          <h3>Investment Strategy</h3>
          <p>Learn professional investment strategies and techniques</p>
          <ul>
            <li><a href="#">Portfolio building</a></li>
            <li><a href="#">Risk management strategy</a></li>
            <li><a href="#">Market analysis techniques</a></li>
          </ul>
        </div>

        <div class="category-card">
          <div class="category-icon">🔧</div>
          <h3>Platform Usage</h3>
          <p>Learn how to use the platform's features</p>
          <ul>
            <li><a href="#">Transaction operation guide</a></li>
            <li><a href="#">Portfolio management</a></li>
            <li><a href="#">Security settings guide</a></li>
          </ul>
        </div>
      </div>

      <div class="featured-tutorials">
        <h2>Featured Tutorials</h2>
        <div class="tutorial-list">
          <div class="tutorial-item">
            <div class="tutorial-thumbnail">📹</div>
            <div class="tutorial-info">
              <h3>5-Minute Quick Start Guide</h3>
              <p>Through this short video tutorial, quickly understand the basic functions and usage of the platform.</p>
              <div class="tutorial-meta">
                <span class="duration">5 minutes</span>
                <span class="level">Beginner</span>
              </div>
            </div>
          </div>

          <div class="tutorial-item">
            <div class="tutorial-thumbnail">📹</div>
            <div class="tutorial-info">
              <h3>How to choose good investment projects</h3>
              <p>Learn how to analyze project data, identify good investment opportunities, and reduce investment risk.</p>
              <div class="tutorial-meta">
                <span class="duration">15 minutes</span>
                <span class="level">Intermediate</span>
              </div>
            </div>
          </div>

          <div class="tutorial-item">
            <div class="tutorial-thumbnail">📹</div>
            <div class="tutorial-info">
              <h3>Advanced trading strategies</h3>
              <p>Learn advanced trading techniques, including the use of professional trading tools such as limit orders and stop loss orders.</p>
              <div class="tutorial-meta">
                <span class="duration">25 minutes</span>
                <span class="level">Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TutorialsView'
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

.tutorials-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.tutorial-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.category-card {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.category-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.category-card p {
  color: #94a3b8;
  margin-bottom: 20px;
}

.category-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.category-card li {
  margin-bottom: 8px;
}

.category-card a {
  color: #f97316;
  text-decoration: none;
  transition: color 0.2s ease;
}

.category-card a:hover {
  color: #ea580c;
}

.featured-tutorials h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #ffffff;
}

.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tutorial-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s ease;
}

.tutorial-item:hover {
  transform: translateY(-2px);
}

.tutorial-thumbnail {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141426;
  border-radius: 8px;
  flex-shrink: 0;
}

.tutorial-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.tutorial-info p {
  color: #94a3b8;
  margin-bottom: 12px;
  line-height: 1.5;
}

.tutorial-meta {
  display: flex;
  gap: 16px;
}

.tutorial-meta span {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.duration {
  background: #1e40af;
  color: #dbeafe;
}

.level {
  background: #059669;
  color: #d1fae5;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .tutorial-categories {
    grid-template-columns: 1fr;
  }
  
  .tutorial-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
