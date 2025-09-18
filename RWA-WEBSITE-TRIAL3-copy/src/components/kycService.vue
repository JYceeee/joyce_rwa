<template>
  <section class="kyc-page container">
    <!-- 顶部 -->
    <header class="topbar">
      <button class="back" @click="goProfile">← Back</button>
      <h1 class="title">KYC Verification</h1>
      <button class="btn light danger" @click="cancelKYC">Cancel Verification</button>
    </header>

    <!-- 进度 -->
    <ol class="steps">
      <li :class="{active: step===1, done: step>1}">1. Upload ID & auto-read</li>
      <!-- <li :class="{active: step===2, done: step>2}">2. Document</li> -->
      <li :class="{active: step===3, done: step>3}">2. Liveness</li>
      <li :class="{active: step===4, done: step>4}">3. Complete</li>
    </ol>

    <!-- Step 1：上传证件并自动识别（OCR 占位） -->
    <div v-if="step===1" class="modal">
      <div class="card">
        <h2>Upload your ID and auto-read info</h2>
        <form @submit.prevent="goDoc">
          <div class="grid">
            <label>Upload front image* <input type="file" accept="image/*" @change="onFile($event,'front')" required /></label>
            <label>Upload back image <input type="file" accept="image/*" @change="onFile($event,'back')" /></label>
            <label>Issuing country*
              <select v-model="form.country" required>
                <option value="" disabled>Select…</option>
                <option value="AU">Australia</option>
                <option value="US">United States</option>
                <option value="AR">Argentina</option>
              </select>
            </label>
            <label>ID type*
              <select v-model="form.docType" required>
                <option value="" disabled>Select…</option>
                <option value="passport">Passport</option>
                <option value="driver">Driver's license</option>
                <option value="idcard">ID card</option>
                <option value="residence">Residence permit</option>
              </select>
            </label>
          </div>

          <div class="actions" style="justify-content: flex-start; gap: 10px;">
            <button type="button" class="btn light" @click="extractFromId" :disabled="!form.fileFront">Auto-read from ID</button>
            <small class="hint">将使用 OCR/解析服务读取 first name, last name, DOB 等信息。</small>
          </div>

          <div class="grid" style="margin-top:12px;">
            <label>First name* <input v-model.trim="form.firstName" required readonly /></label>
            <label>Last name*  <input v-model.trim="form.lastName" required readonly /></label>
            <label>Date of birth*  <input v-model.trim="form.dob" required readonly /></label>
            <label>ID number  <input v-model.trim="form.docNumber" readonly /></label>
          </div>

          <div class="actions">
            <button type="button" class="btn light" @click="goProfile">Cancel</button>
            <button type="submit" class="btn orange" :disabled="!readyExtract">Continue</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Step 3：活体检测（占位，接第三方时替换） -->
    <div v-if="step===3" class="modal">
      <div class="card">
        <h2>Liveness detection</h2>
        <p>Center your face in the frame and follow the instruction.</p>
        <div class="face-ring"></div>

        <div class="camera-block">
          <video v-if="cameraEnabled" ref="videoEl" autoplay playsinline class="cam-preview"></video>
          <button v-else class="btn orange" @click="enableCamera">Enable Camera</button>
          <p v-if="camError" class="cam-error">{{ camError }}</p>
        </div>
        <small class="hint">接入 Sumsub/Persona/Onfido 时，把此区域替换为他们的组件，并在成功回调里调用 <code>complete()</code>。</small>
        <div class="actions">
          <button type="button" class="btn light" @click="prev">Back</button>
          <button class="btn orange" @click="complete">Finish</button>
        </div>
      </div>
    </div>

    <!-- Step 4：完成 -->
    <div v-if="step===4" class="modal">
      <div class="card success">
        <div class="bigcheck">✓</div>
        <h2>Your profile has been verified</h2>
        <p>You may close this page.</p>
        <div class="actions">
          <button class="btn orange" @click="goProfile">Back to Profile</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { setKycStatus, KYC_STATUS } from '/src/service/kycService'

export default {
  name: 'KycServicePage',
  data(){
    return {
      step: 1,
      form: {
        firstName:'', lastName:'', dob:'', email:'', phone:'',
        country:'', docType:'', docNumber:'',
        fileFront:null, fileBack:null,
      },
      cameraEnabled:false,
      camError:'',
    }
  },
  computed:{
    // 驾照/ID卡一般需要反面
    needsBack(){ return this.form.docType==='driver' || this.form.docType==='idcard' }
    ,readyExtract(){ return !!(this.form.firstName && this.form.lastName && this.form.dob) }
  },
  methods:{
    goProfile(){ this.$router.push('/profile') },
    prev(){ this.step = Math.max(1, this.step - 1) },

    goDoc(){
      // Step1 完成后直接进入活体（原 Step2 已移除）
      this.step = 3
    },
    onFile(e, pos){
      const f = e.target.files?.[0]
      if (!f) return
      if (pos==='front') this.form.fileFront = f
      else this.form.fileBack = f
    },
    async extractFromId(){
      // 占位：实际应上传至后端/第三方 OCR，解析并回填
      // 这里做一个本地 demo：根据文件名简单模拟解析
      try{
        const name = (this.form.fileFront?.name || '').toLowerCase()
        if (name.includes('john')) this.form.firstName = 'John'
        if (name.includes('doe')) this.form.lastName = 'Doe'
        if (name.match(/1990|90/)) this.form.dob = '1990-01-01'
        if (!this.form.firstName) this.form.firstName = 'GivenName'
        if (!this.form.lastName) this.form.lastName = 'FamilyName'
        if (!this.form.dob) this.form.dob = '1990-01-01'
      }catch{}
    },
    // goLiveness 删除：直接由 goDoc 切换到 Step3
    complete(){
      // 第三方成功回调时应写入最终状态；此处做 demo：直接标记为 VERIFIED
      setKycStatus(KYC_STATUS.VERIFIED)
      this.step = 4
    },
    async enableCamera(){
      this.camError = ''
      try{
        const stream = await navigator.mediaDevices.getUserMedia({ video:true })
        this.cameraEnabled = true
        this.$nextTick(()=>{ if(this.$refs.videoEl) this.$refs.videoEl.srcObject = stream })
      }catch(e){
        this.camError = '无法访问摄像头，请检查浏览器权限设置。'
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 920px; margin: 0 auto; padding: 20px 16px 64px; }
.topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
.back { border:0; background:transparent; cursor:pointer; color:#334155; }
.title { font-size:20px; font-weight:700; }
.steps { display:flex; gap:12px; list-style:none; padding:12px 0 24px; margin:0; flex-wrap:wrap; }
.steps li { padding:6px 10px; border-radius:999px; background:#f1f5f9; color:#334155; font-size:12px; }
.steps li.active { background:#dbeafe; color:#1e40af; }
.steps li.done { background:#e8f7ec; color:#17683a; }

.modal { position:fixed; inset:0; background:rgba(15,23,42,.45); display:grid; place-items:center; z-index:50; }
.card { width:min(720px, 92vw); background:#fff; border-radius:16px; padding:20px; box-shadow:0 20px 60px rgba(15,23,42,.2); }
.card.success { text-align:center; padding:40px 24px; }
.bigcheck { font-size:52px; color:#16a34a; margin-bottom:8px; }
.grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:12px; }
.grid label { display:flex; flex-direction:column; gap:6px; font-size:14px; color:#334155; }
.grid input, .grid select { height:40px; border:1px solid #e2e8f0; border-radius:8px; padding:0 12px; }
.actions { display:flex; justify-content:flex-end; gap:10px; margin-top:16px; }
.btn { border:1px solid transparent; border-radius:10px; padding:8px 14px; cursor:pointer; font-weight:600; }
.btn.orange { background:#ea7a2e; color:#fff; }
.btn.light { background:#f1f5f9; color:#0f172a; border-color:#e2e8f0; }
.face-ring { width:220px; height:220px; border-radius:999px; margin:18px auto; border:10px solid #e2e8f0; background:#eee; }
.hint { display:block; margin-top:8px; color:#64748b; }
</style>
