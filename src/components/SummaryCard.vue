<template>
  <section class="card summary-card">
    <h2>📊 学习进度概览</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">总学习天数</div>
        <div class="summary-value">{{ totalDays }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总做题数</div>
        <div class="summary-value">{{ totalQuestions }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">平均正确率</div>
        <div class="summary-value">{{ avgAccuracy }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">最弱章节</div>
        <div class="summary-value weak">{{ weakestChapter }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总学习时长</div>
        <div class="summary-value">{{ formatStudyTime(totalHours) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { formatStudyTime } from '../store/useStudyStore.js'

defineProps({
  totalDays: Number,
  totalQuestions: Number,
  avgAccuracy: String,
  weakestChapter: String,
  totalHours: Number,
})
</script>

<style scoped>
.summary-card { grid-column: 1 / -1; }

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.summary-item {
  text-align: center;
  padding: 20px 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  margin: 10px 0;
  word-break: break-all;
}

.summary-value.weak {
  font-size: 1rem;
  line-height: 1.4;
}

.summary-label {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .summary-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 600px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
