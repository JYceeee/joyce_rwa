<template>
  <div class="container">
    <div class="page-header">
      <h1>Contact Us</h1>
      <p class="page-subtitle">We are happy to help you</p>
    </div>

    <div class="contact-content">
      <div class="contact-grid">
        <div class="contact-info">
          <h2>Contact Information</h2>
          <div class="contact-methods">
            <div class="contact-method">
              <div class="method-icon">📧</div>
              <div class="method-details">
                <h4>Email</h4>
                <p>support@mortgagerwa.com</p>
                <p>business@mortgagerwa.com</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">📞</div>
              <div class="method-details">
                <h4>Phone</h4>
                <p>+61 2 1234 5678</p>
                <p>Monday to Friday 9:00-18:00</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">📍</div>
              <div class="method-details">
                <h4>Address</h4>
                <p>123 George Street</p>
                <p>Sydney NSW 2000, Australia</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">💬</div>
              <div class="method-details">
                <h4>Online Customer Service</h4>
                <p>24/7 Online Support</p>
                <p>Average Response Time < 5 minutes</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <h3>Follow Us</h3>
            <div class="social-icons">
              <a href="#" class="social-icon">🐦</a>
              <a href="#" class="social-icon">💼</a>
              <a href="#" class="social-icon">📘</a>
              <a href="#" class="social-icon">🐙</a>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2>Send Message</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>

            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" v-model="form.phone">
            </div>

            <div class="form-group">
              <label for="subject">Subject *</label>
              <select id="subject" v-model="form.subject" required>
                <option value="">Please select a subject</option>
                <option value="general">General Consultation</option>
                <option value="technical">Technical Support</option>
                <option value="business">Business Cooperation</option>
                <option value="investment">Investment Consultation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Message Content *</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>

            <button type="submit" class="btn primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>

      <div class="faq-section">
        <h2>FAQ</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h4>How to start investing?</h4>
            <p>First, you need to register an account and complete the KYC certification, then connect your digital wallet, and you can start browsing and investing in real estate tokens.</p>
          </div>
          <div class="faq-item">
            <h4>Is there a minimum investment amount?</h4>
            <p>The minimum investment amount for individual investors is 100 Australian dollars, and the minimum investment requirements for institutional investors and corporate clients are different.</p>
          </div>
          <div class="faq-item">
            <h4>How to withdraw investment returns？</h4>
            <p>You can view the investment returns on the investment portfolio page, and withdraw the returns to your bank account through the wallet function.</p>
          </div>
          <div class="faq-item">
            <h4>Is the platform safe?</h4>
            <p>We use bank-level security measures, including multiple encryption, cold wallet storage, etc., to ensure the security of user assets.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true
      
      // 模拟表单提交
      setTimeout(() => {
        alert('Message sent successfully! We will reply to you soon.')
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
        this.isSubmitting = false
      }, 2000)
    }
  }
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

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-info h2,
.contact-form h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #ffffff;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 20px;
}

.method-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141426;
  border-radius: 8px;
  flex-shrink: 0;
}

.method-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
}

.method-details p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
}

.social-links h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.social-icon:hover {
  background: #2a2a4a;
  transform: translateY(-2px);
}

.contact-form {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 40px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ffffff;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  background: #141426;
  color: #ffffff;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: #f97316;
  color: white;
  border: 1px solid #f97316;
}

.btn.primary:hover:not(:disabled) {
  background: #ea580c;
  border-color: #ea580c;
}

.btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.faq-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #ffffff;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 24px;
}

.faq-item h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.faq-item p {
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .contact-method {
    flex-direction: column;
    text-align: center;
  }
}
</style>
