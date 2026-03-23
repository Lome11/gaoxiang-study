<template>
  <section class="card">
    <h2>📈 各章节学习进度</h2>
    <div class="progress-grid">
      <div
        v-for="ch in chapters"
        :key="ch.key"
        class="progress-item"
      >
        <h3>{{ ch.name }}</h3>
        <div class="stats-row">
          <span>做题: {{ ch.total }}</span>
          <span>正确率: {{ ch.accuracy !== null ? ch.accuracy + '%' : '-' }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: completion(ch) + '%',
              background: barColor(ch.accuracy)
            }"
          ></div>
        </div>
        <div class="stats-row">
          <span>时长: {{ formatStudyTime(ch.time) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { formatStudyTime } from '../store/useStudyStore.js'

defineProps({
  chapters: Array,
})

function completion(ch) {
  return ch.total > 0 ? Math.min((ch.total / 50) * 100, 100) : 0
}

function barColor(accuracy) {
  if (accuracy === null || accuracy === 0) return '#ccc'
  if (accuracy >= 80) return '#4CAF50'
  if (accuracy >= 60) return '#FFC107'
  return '#f44336'
}
</script>

<style scoped>
.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.progress-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.progress-item h3 {
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  margin: 6px 0;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
  min-width: 2px;
}
</style>
