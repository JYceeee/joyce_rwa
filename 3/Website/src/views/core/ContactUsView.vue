<template>
  <div class="container">
    <div class="contact-page">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="headline">Contact Us</h1>
        <p class="subline">We are here to help you with your RWA investment journey</p>
      </header>

      <!-- 联系内容 -->
      <div class="contact-content">
        <div class="contact-grid">
          
          <!-- 联系信息 -->
          <div class="contact-info">
            <h2>Get in Touch</h2>
            <p class="info-description">Choose your preferred way to reach us</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">📧</div>
                <div class="method-details">
                  <h4>Email Support</h4>
                  <p>support@mortgagerwa.com</p>
                  <p>business@mortgagerwa.com</p>
                  <span class="response-time">Response within 24 hours</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">📞</div>
                <div class="method-details">
                  <h4>Phone Support</h4>
                  <p>+61 2 1234 5678</p>
                  <p>Monday to Friday 9:00-18:00 (AEST)</p>
                  <span class="response-time">Immediate assistance</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">📍</div>
                <div class="method-details">
                  <h4>Office Address</h4>
                  <p>Level 15, 123 George Street</p>
                  <p>Sydney NSW 2000, Australia</p>
                  <span class="response-time">Visit by appointment</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">💬</div>
                <div class="method-details">
                  <h4>Live Chat</h4>
                  <p>24/7 Online Support</p>
                  <p>Average Response Time < 5 minutes</p>
                  <span class="response-time">Real-time support</span>
                </div>
              </div>
            </div>

            <!-- 社交媒体链接 -->
            <div class="social-section">
              <h3>Follow Us</h3>
              <p>Stay updated with our latest news and updates</p>
              <div class="social-links">
                <a href="#" class="social-link" title="Twitter">
                  <span class="social-icon">🐦</span>
                  <span class="social-label">Twitter</span>
                </a>
                <a href="#" class="social-link" title="LinkedIn">
                  <span class="social-icon">💼</span>
                  <span class="social-label">LinkedIn</span>
                </a>
                <a href="#" class="social-link" title="Facebook">
                  <span class="social-icon">📘</span>
                  <span class="social-label">Facebook</span>
                </a>
                <a href="#" class="social-link" title="GitHub">
                  <span class="social-icon">🐙</span>
                  <span class="social-label">GitHub</span>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 联系表单 -->
          <div class="contact-form">
            <h2>Send us a Message</h2>
            <p class="form-description">Fill out the form below and we'll get back to you as soon as possible</p>
            
            <form @submit.prevent="submitForm" class="form-container">
              <div class="form-fields">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      v-model="form.name" 
                      required
                      placeholder="Enter your full name"
                      :class="{ 'error': errors.name }"
                    >
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                  </div>

                  <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="form.email" 
                      required
                      placeholder="Enter your email address"
                      :class="{ 'error': errors.email }"
                    >
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      v-model="form.phone"
                      placeholder="Enter your phone number"
                    >
                  </div>

                  <div class="form-group">
                    <label for="subject">Subject *</label>
                    <select 
                      id="subject" 
                      v-model="form.subject" 
                      required
                      :class="{ 'error': errors.subject }"
                    >
                      <option value="">Please select a subject</option>
                      <option value="investor">I am an Investor / Interested in Investing</option>
                      <option value="asset_holder">I am an Asset Holder / Property Owner</option>
                      <option value="general">General Consultation</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="media">Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                    <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="message">Message *</label>
                  <textarea 
                    id="message" 
                    v-model="form.message" 
                    rows="6" 
                    required
                    placeholder="Please describe your inquiry in detail..."
                    :class="{ 'error': errors.message }"
                  ></textarea>
                  <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
                  <div class="character-count">{{ form.message.length }}/1000</div>
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="form-submit">
                <button type="submit" class="btn primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="loading-spinner"></span>
                  {{ isSubmitting ? 'Sending Message...' : 'Send Message' }}
                </button>
                <p class="form-note">
                  By submitting this form, you agree to our 
                  <a href="/terms" target="_blank">Terms of Service</a> and 
                  <a href="/privacy" target="_blank">Privacy Policy</a>
                </p>
              </div>
            </form>

            <!-- 成功消息 -->
            <div v-if="submitSuccess" class="success-message">
              <div class="success-icon">✅</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>

        <!-- FAQ 部分 -->
        <div class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-item">
              <h4>How do I start investing?</h4>
              <p>Simply connect your wallet, complete KYC verification, and browse our available projects. You can start with as little as $100 AUD.</p>
            </div>
            <div class="faq-item">
              <h4>What are the investment returns?</h4>
              <p>Our RWA projects typically offer 8-15% annual returns with monthly interest payments. Returns vary by project risk and duration.</p>
            </div>
            <div class="faq-item">
              <h4>Is my investment secure?</h4>
              <p>Yes, all investments are backed by real estate assets and protected by smart contracts. We also provide comprehensive insurance coverage.</p>
            </div>
            <div class="faq-item">
              <h4>How do I withdraw my funds?</h4>
              <p>You can withdraw your funds at any time through our platform. Withdrawals are processed within 1-3 business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactUsView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      submitSuccess: false
    }
  },
  methods: {
    async submitForm() {
      // 清除之前的错误
      this.errors = {}
      
      // 验证表单
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true
      
      try {
        // 这里可以添加实际的表单提交逻辑
        // 例如调用API发送邮件
        await this.sendContactForm()
        
        // 显示成功消息
        this.submitSuccess = true
        
        // 重置表单
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
        
        // 3秒后隐藏成功消息
        setTimeout(() => {
          this.submitSuccess = false
        }, 5000)
        
      } catch (error) {
        console.error('Failed to submit form:', error)
        alert('Failed to send message. Please try again or contact us directly.')
      } finally {
        this.isSubmitting = false
      }
    },
    
    validateForm() {
      let isValid = true
      
      // 验证姓名
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required'
        isValid = false
      } else if (this.form.name.trim().length < 2) {
        this.errors.name = 'Name must be at least 2 characters'
        isValid = false
      }
      
      // 验证邮箱
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      // 验证主题
      if (!this.form.subject) {
        this.errors.subject = 'Please select a subject'
        isValid = false
      }
      
      // 验证消息
      if (!this.form.message.trim()) {
        this.errors.message = 'Message is required'
        isValid = false
      } else if (this.form.message.trim().length < 10) {
        this.errors.message = 'Message must be at least 10 characters'
        isValid = false
      } else if (this.form.message.length > 1000) {
        this.errors.message = 'Message must be less than 1000 characters'
        isValid = false
      }
      
      return isValid
    },
    
    async sendContactForm() {
      // 模拟API调用
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 这里应该调用实际的API
          console.log('Contact form submitted:', this.form)
          resolve()
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 40px 20px;
}

.contact-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.headline {
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subline {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 联系内容 */
.contact-content {
  margin-bottom: 80px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

/* 联系信息 */
.contact-info h2 {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 8px;
}

.info-description {
  color: #94a3b8;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.contact-methods {
  margin-bottom: 50px;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.method-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.method-details h4 {
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.method-details p {
  color: #e2e8f0;
  margin-bottom: 4px;
  line-height: 1.5;
}

.response-time {
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 社交媒体 */
.social-section {
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.social-section h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.social-section p {
  color: #94a3b8;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.2rem;
}

.social-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 联系表单 */
.contact-form {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
}

.contact-form h2 {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 8px;
}

.form-description {
  color: #94a3b8;
  margin-bottom: 32px;
  line-height: 1.6;
}

.form-fields {
  margin-bottom: 32px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #64748b;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 4px;
}

.character-count {
  color: #64748b;
  font-size: 0.8rem;
  text-align: right;
  margin-top: 4px;
}

.form-submit {
  text-align: center;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-note {
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 16px;
  line-height: 1.5;
}

.form-note a {
  color: #667eea;
  text-decoration: none;
}

.form-note a:hover {
  text-decoration: underline;
}

/* 成功消息 */
.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-top: 24px;
}

.success-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.success-message h3 {
  color: #10b981;
  margin-bottom: 8px;
}

.success-message p {
  color: #e2e8f0;
  line-height: 1.5;
}

/* FAQ 部分 */
.faq-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
}

.faq-section h2 {
  font-size: 2rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
}

.faq-item h4 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.faq-item p {
  color: #94a3b8;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .headline {
    font-size: 2rem;
  }
  
  .contact-form {
    padding: 24px;
  }
  
  .contact-method {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 20px 16px;
  }
  
  .headline {
    font-size: 1.8rem;
  }
  
  .contact-form {
    padding: 20px;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>

