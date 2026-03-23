<template>
  <div class="action-bar">
    <button class="btn-export" @click="handleExport">💾 导出数据</button>
    <button class="btn-import" @click="triggerImport">📥 导入数据</button>
    <button class="btn-reset" @click="handleReset">🔄 重置数据</button>
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleImport"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast.js'

const emit = defineEmits(['export', 'import', 'reset'])
const { showToast } = useToast()
const fileInputRef = ref(null)

function handleExport() {
  emit('export')
}

function triggerImport() {
  fileInputRef.value?.click()
}

function handleImport(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = event => {
    try {
      const data = JSON.parse(event.target.result)
      if (!data.records || !data.chapters) {
        showToast('❌ 数据格式不正确', 'error')
        return
      }
      emit('import', data)
      showToast('✅ 数据导入成功！', 'success')
    } catch (err) {
      showToast('❌ 导入失败：' + err.message, 'error')
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

function handleReset() {
  const input = window.prompt(
    '⚠️ 确定要重置所有数据吗？此操作不可撤销！\n\n请输入 "我确认重置" 来确认：'
  )
  if (input === '我确认重置') {
    emit('reset')
    showToast('🔄 数据已重置！', 'info')
  } else if (input !== null) {
    showToast('❌ 输入不正确，未进行重置', 'warning')
  }
}
</script>

<style scoped>
.action-bar {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  margin-top: 10px;
}

button {
  padding: 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s, transform 0.2s;
}
button:hover { opacity: 0.9; transform: translateY(-2px); }

.btn-export { background: #4CAF50; }
.btn-import { background: #2196F3; }
.btn-reset  { background: #f44336; }

@media (max-width: 600px) {
  .action-bar { grid-template-columns: 1fr; }
}
</style>
