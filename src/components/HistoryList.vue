<template>
  <div class="history-container">
    <!-- 学习记录历史 -->
    <div v-if="recentRecords.length > 0" class="card history-card">
      <h4>📋 最近学习记录</h4>
      <div
        v-for="record in recentRecords"
        :key="record.originalIndex"
        class="history-item"
      >
        <div class="history-info">
          <div>
            <strong>{{ chaptersName(record.chapter) }}</strong>
            · 做题{{ record.questionsDone }}题，正确{{ record.correctAnswers }}题
          </div>
          <div class="history-date">{{ record.date }}</div>
        </div>
        <button class="delete-btn" @click="$emit('delete-record', record.originalIndex)">删除</button>
      </div>
    </div>

    <!-- 模拟考试历史 -->
    <div v-if="recentMockExams.length > 0" class="card history-card">
      <h4>📋 最近模拟考试</h4>
      <div
        v-for="exam in recentMockExams"
        :key="exam.originalIndex"
        class="history-item"
      >
        <div class="history-info">
          <div>
            <strong>{{ exam.type }}</strong>
            · 分数 <span class="score-val">{{ exam.score }}</span> 分
            <span v-if="exam.notes"> · {{ exam.notes }}</span>
          </div>
          <div class="history-date">{{ exam.date }}</div>
        </div>
        <button class="delete-btn" @click="$emit('delete-mock', exam.originalIndex)">删除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CHAPTERS_META } from '../store/useStudyStore.js'

defineProps({
  recentRecords: Array,
  recentMockExams: Array,
})

defineEmits(['delete-record', 'delete-mock'])

function chaptersName(key) {
  return CHAPTERS_META[key] || key
}
</script>

<style scoped>
.history-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  grid-column: 1 / -1;
}

.history-card {
  max-height: 380px;
  overflow-y: auto;
}

.history-card h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 0.95rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  font-size: 0.88rem;
}

.history-info { flex: 1; }
.history-date { color: #999; font-size: 0.82rem; margin-top: 3px; }
.score-val { color: #667eea; font-weight: bold; }

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
  transition: background 0.2s;
}
.delete-btn:hover { background: #d32f2f; }

@media (max-width: 900px) {
  .history-container { grid-template-columns: 1fr; }
}
</style>
