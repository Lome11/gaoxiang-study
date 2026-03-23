<template>
  <header class="app-header">
    <div class="header-main">
      <p class="subtitle">每日学习进度可视化</p>
    </div>

    <div class="countdown-stats">
      <div class="countdown-item">
        <span>⏳ 距离考试</span>
        <span class="countdown-value">{{ daysLeft }}</span>
        <span>天</span>
      </div>
      <div class="countdown-item">
        <span>🔥 连续学习</span>
        <span class="countdown-value">{{ streakDays }}</span>
        <span>天</span>
      </div>
      <div class="countdown-item">
        <span>⏱️ 总投入</span>
        <span class="countdown-value">{{ formatStudyTime(totalHours) }}</span>
      </div>
      <!-- 同步状态 -->
      <div class="countdown-item sync-item" @click="$emit('openSync')">
        <span class="sync-dot" :class="syncStatus"></span>
        <span class="sync-text">{{ syncStatusText }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { formatStudyTime } from '../store/useStudyStore.js'

const props = defineProps({
  daysLeft: Number,
  streakDays: Number,
  totalHours: Number,
  syncStatus: String,
})

defineEmits(['openSync'])

const syncStatusText = computed(() => {
  switch (props.syncStatus) {
    case 'syncing': return '同步中...'
    case 'success': return '已同步 ✓'
    case 'error': return '同步失败'
    default: return '☁️ 云同步'
  }
})
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 18px;
}

.countdown-stats {
  display: flex;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
  font-size: 0.95rem;
}

.countdown-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.countdown-value {
  font-weight: bold;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 10px;
  border-radius: 4px;
}

.sync-item {
  cursor: pointer;
  padding: 4px 12px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
  transition: background 0.2s;
}
.sync-item:hover {
  background: rgba(255,255,255,0.25);
}

.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}
.sync-dot.idle    { background: rgba(255,255,255,0.6); }
.sync-dot.syncing { background: #FFC107; animation: pulse 1s infinite; }
.sync-dot.success { background: #4CAF50; }
.sync-dot.error   { background: #f44336; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 600px) {
  h1 { font-size: 1.5rem; }
  .countdown-stats { gap: 12px; }
}
</style>
