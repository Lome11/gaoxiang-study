<template>
  <!-- 遮罩 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-box">
          <div class="modal-header">
            <h3>☁️ 云同步设置 (GitHub Gist)</h3>
            <button class="close-btn" @click="close">✕</button>
          </div>
          <div class="modal-body">
            <div class="tip-box">
              <p>📌 <strong>如何使用：</strong></p>
              <ol>
                <li>前往 <a href="https://github.com/settings/tokens/new" target="_blank">GitHub → Settings → Tokens</a></li>
                <li>创建 Personal Access Token，勾选 <code>gist</code> 权限</li>
                <li>将 Token 粘贴到下方，点击「首次连接」</li>
                <li>之后每次打开页面，数据自动从云端加载</li>
              </ol>
            </div>

            <div class="form-group">
              <label>GitHub Personal Access Token</label>
              <input
                v-model="localToken"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                autocomplete="off"
              />
            </div>

            <div class="form-group">
              <label>Gist ID <span class="hint">（首次留空，系统自动创建）</span></label>
              <input
                v-model="localGistId"
                type="text"
                placeholder="自动填充，也可手动输入已有 Gist ID"
              />
            </div>

            <div class="btn-row">
              <button class="btn-primary" @click="handleSave">💾 保存配置</button>
              <button class="btn-success" :disabled="syncing" @click="handleConnect">
                {{ localGistId ? '🔄 立即同步' : '🚀 首次连接（创建Gist）' }}
              </button>
              <button class="btn-pull" :disabled="!localGistId || syncing" @click="handlePull">
                📥 从云端拉取
              </button>
            </div>

            <div v-if="syncMessage" class="sync-message" :class="syncStatus">
              {{ syncMessage }}
            </div>

            <div v-if="localGistId" class="gist-link">
              <span>当前 Gist：</span>
              <a :href="`https://gist.github.com/${localGistId}`" target="_blank">
                查看数据文件 ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStudyStore } from '../store/useStudyStore.js'
import { useToast } from '../composables/useToast.js'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])

const store = useStudyStore()
const { showToast } = useToast()

const localToken = ref(store.gistConfig.token)
const localGistId = ref(store.gistConfig.gistId)
const syncing = ref(false)

const syncMessage = ref('')
const syncStatus = ref('idle')

// 同步 store 状态到本地
watch(() => store.syncMessage.value, v => { syncMessage.value = v })
watch(() => store.syncStatus.value, v => { syncStatus.value = v })

function close() { emit('update:visible', false) }

function handleSave() {
  store.gistConfig.token = localToken.value.trim()
  store.gistConfig.gistId = localGistId.value.trim()
  store.saveGistConfig()
  showToast('配置已保存', 'success')
}

async function handleConnect() {
  store.gistConfig.token = localToken.value.trim()
  store.gistConfig.gistId = localGistId.value.trim()
  store.saveGistConfig()

  syncing.value = true
  const ok = await store.pushToGist()
  if (ok) {
    localGistId.value = store.gistConfig.gistId
    showToast('连接成功！数据已同步到云端 🎉', 'success')
  } else {
    showToast(store.syncMessage.value || '同步失败', 'error')
  }
  syncMessage.value = store.syncMessage.value
  syncStatus.value = store.syncStatus.value
  syncing.value = false
}

async function handlePull() {
  store.gistConfig.token = localToken.value.trim()
  store.gistConfig.gistId = localGistId.value.trim()
  syncing.value = true
  const ok = await store.pullFromGist()
  if (ok) {
    showToast('云端数据已拉取成功', 'success')
  } else {
    showToast(store.syncMessage.value || '拉取失败', 'error')
  }
  syncMessage.value = store.syncMessage.value
  syncStatus.value = store.syncStatus.value
  syncing.value = false
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 20px;
}

.modal-box {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 { margin: 0; font-size: 1.1rem; }

.close-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover { background: rgba(255,255,255,0.3); }

.modal-body { padding: 24px; }

.tip-box {
  background: #f0f4ff;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  line-height: 1.7;
}
.tip-box ol { padding-left: 18px; margin-top: 6px; }
.tip-box a { color: #667eea; }
.tip-box code {
  background: #e8edff;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.85rem;
}

.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  font-size: 0.9rem;
}
.hint { font-weight: normal; color: #999; font-size: 0.85rem; }
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s, transform 0.2s;
}
button:hover { opacity: 0.9; transform: translateY(-1px); }
button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-primary { background: #667eea; color: white; }
.btn-success { background: #4CAF50; color: white; }
.btn-pull    { background: #2196F3; color: white; }

.sync-message {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
}
.sync-message.success { background: #e8f5e9; color: #2e7d32; }
.sync-message.error   { background: #ffebee; color: #c62828; }
.sync-message.syncing { background: #fff8e1; color: #f57f17; }

.gist-link {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #666;
}
.gist-link a { color: #667eea; text-decoration: none; }
.gist-link a:hover { text-decoration: underline; }

/* 弹窗动画 */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
