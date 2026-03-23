<template>
  <section class="card">
    <h2>📈 各章节学习进度</h2>
    <div class="progress-grid">
      <!-- 普通章节 -->
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

      <!-- 模拟考试进度：占2列宽 -->
      <div class="progress-item mock-item">
        <!-- 无数据 -->
        <template v-if="mock.count === 0">
          <h3 class="mock-title">🎯 模拟考试</h3>
          <div class="empty-tip">暂无模拟考试记录</div>
        </template>

        <!-- 有数据 -->
        <template v-else>
          <div class="mock-body">
            <!-- 左：汇总统计 -->
            <div class="mock-stats">
              <div class="mock-stat-item">
                <span class="mock-val">{{ mock.count }}</span>
                <span class="mock-lbl">总场次</span>
              </div>
              <div class="mock-stat-item">
                <span class="mock-val">{{ mock.totalQuestions }}</span>
                <span class="mock-lbl">累计做题</span>
              </div>
              <div class="mock-stat-item">
                <span class="mock-val" :class="scoreClass">{{ mock.avgScore }}</span>
                <span class="mock-lbl">平均分</span>
              </div>
              <div class="mock-stat-item">
                <span class="mock-val" :class="accClass">{{ mock.avgAccuracy }}%</span>
                <span class="mock-lbl">正确率</span>
              </div>
              <div class="mock-stat-item">
                <span class="mock-val" :class="passClass">{{ mock.passRate }}%</span>
                <span class="mock-lbl">及格率</span>
              </div>
            </div>

            <!-- 右：进度条 + 类型分组 -->
            <div class="mock-right">
              <div class="mock-bar-wrap">
                <div class="mock-bar-bg">
                  <div
                    class="mock-bar-fill"
                    :style="{ width: Math.min(mock.avgAccuracy, 100) + '%', background: barFill }"
                  ></div>
                </div>
                <span class="mock-bar-pct">正确率 {{ mock.avgAccuracy }}%</span>
              </div>
              <div class="type-list">
                <span
                  v-for="ts in mock.typeStats"
                  :key="ts.type"
                  class="type-tag"
                  :style="{ borderColor: typeColor(ts.type), color: typeColor(ts.type) }"
                >
                  {{ ts.type }} {{ ts.count }}场 均{{ ts.avgScore }}分
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { formatStudyTime, TYPE_COLORS } from '../store/useStudyStore.js'

const props = defineProps({
  chapters: Array,
  mock: {
    type: Object,
    default: () => ({ count: 0, totalQuestions: 0, avgScore: '0', avgAccuracy: '0', passRate: '0', typeStats: [] }),
  },
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

function typeColor(type) {
  return TYPE_COLORS[type] || '#999'
}

const barFill = computed(() => barColor(parseFloat(props.mock.avgAccuracy)))

const scoreClass = computed(() => {
  const s = parseFloat(props.mock.avgScore)
  if (s >= 80) return 'c-green'
  if (s >= 60) return 'c-yellow'
  return 'c-red'
})

const accClass = computed(() => {
  const a = parseFloat(props.mock.avgAccuracy)
  if (a >= 80) return 'c-green'
  if (a >= 60) return 'c-yellow'
  return 'c-red'
})

const passClass = computed(() => {
  const r = parseFloat(props.mock.passRate)
  if (r >= 80) return 'c-green'
  if (r >= 50) return 'c-yellow'
  return 'c-red'
})
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

/* 模拟考试格子：占2列 */
.mock-item {
  grid-column: span 2;
  border-left-color: #9C27B0;
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

/* 模拟考试内部布局 */
.mock-title {
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.empty-tip {
  color: #aaa;
  font-size: 0.88rem;
  padding: 8px 0;
}

.mock-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧统计数字 */
.mock-stats {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.mock-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 58px;
}

.mock-val {
  font-size: 1.5rem;
  font-weight: bold;
  color: #9C27B0;
  line-height: 1.2;
}

.mock-lbl {
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
  text-align: center;
}

.c-green  { color: #4CAF50 !important; }
.c-yellow { color: #e07800 !important; }
.c-red    { color: #f44336 !important; }

/* 右侧：进度条 + 类型标签 */
.mock-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.mock-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mock-bar-bg {
  flex: 1;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.mock-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
  min-width: 2px;
}

.mock-bar-pct {
  font-size: 0.82rem;
  color: #555;
  white-space: nowrap;
}

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-tag {
  font-size: 0.8rem;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid;
  background: white;
  white-space: nowrap;
}
</style>
