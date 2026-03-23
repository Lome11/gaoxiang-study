<template>
  <section class="card mock-progress-card">
    <h2>🎯 模拟考试进度</h2>

    <!-- 无数据提示 -->
    <div v-if="progress.count === 0" class="empty-tip">
      暂无模拟考试记录，去「今日学习记录」下方录入吧～
    </div>

    <div v-else>
      <!-- 汇总统计行 -->
      <div class="mock-stats-row">
        <div class="stat-box">
          <div class="stat-val">{{ progress.count }}</div>
          <div class="stat-lbl">总场次</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">{{ progress.totalQuestions }}</div>
          <div class="stat-lbl">累计做题数</div>
        </div>
        <div class="stat-box">
          <div class="stat-val accent">{{ progress.avgScore }}</div>
          <div class="stat-lbl">平均分</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" :class="accClass">{{ progress.avgAccuracy }}%</div>
          <div class="stat-lbl">平均正确率</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" :class="passClass">{{ progress.passRate }}%</div>
          <div class="stat-lbl">及格率（≥60）</div>
        </div>
      </div>

      <!-- 正确率进度条 -->
      <div class="acc-bar-wrap">
        <div class="acc-bar-label">
          <span>综合正确率</span>
          <span>{{ progress.avgAccuracy }}%</span>
        </div>
        <div class="acc-bar-bg">
          <div
            class="acc-bar-fill"
            :style="{ width: Math.min(progress.avgAccuracy, 100) + '%', background: barColor }"
          ></div>
        </div>
      </div>

      <!-- 按类型分组 -->
      <div class="type-grid">
        <div
          v-for="ts in progress.typeStats"
          :key="ts.type"
          class="type-item"
          :style="{ borderLeftColor: typeColor(ts.type) }"
        >
          <span class="type-name">{{ ts.type }}</span>
          <span class="type-count">{{ ts.count }} 场</span>
          <span class="type-score">均分 {{ ts.avgScore }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { TYPE_COLORS } from '../store/useStudyStore.js'

const props = defineProps({
  progress: {
    type: Object,
    required: true,
  },
})

const barColor = computed(() => {
  const acc = parseFloat(props.progress.avgAccuracy)
  if (acc >= 80) return '#4CAF50'
  if (acc >= 60) return '#FFC107'
  return '#f44336'
})

const accClass = computed(() => {
  const acc = parseFloat(props.progress.avgAccuracy)
  if (acc >= 80) return 'green'
  if (acc >= 60) return 'yellow'
  return 'red'
})

const passClass = computed(() => {
  const r = parseFloat(props.progress.passRate)
  if (r >= 80) return 'green'
  if (r >= 50) return 'yellow'
  return 'red'
})

function typeColor(type) {
  return TYPE_COLORS[type] || '#999'
}
</script>

<style scoped>
/* 占满2列 */
.mock-progress-card {
  grid-column: 1 / -1;
}

.empty-tip {
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 0.95rem;
}

/* 汇总统计 */
.mock-stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-box {
  flex: 1;
  min-width: 100px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px 10px;
  text-align: center;
}

.stat-val {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1.2;
}
.stat-val.accent { color: #764ba2; }
.stat-val.green  { color: #4CAF50; }
.stat-val.yellow { color: #e07800; }
.stat-val.red    { color: #f44336; }

.stat-lbl {
  font-size: 0.82rem;
  color: #888;
  margin-top: 6px;
}

/* 正确率进度条 */
.acc-bar-wrap {
  margin-bottom: 18px;
}

.acc-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #555;
  margin-bottom: 6px;
}

.acc-bar-bg {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.acc-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
  min-width: 2px;
}

/* 按类型分组 */
.type-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  border-left: 4px solid #ccc;
  border-radius: 6px;
  padding: 10px 16px;
  flex: 1;
  min-width: 160px;
}

.type-name {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  flex: 1;
}

.type-count {
  font-size: 0.85rem;
  color: #666;
}

.type-score {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: bold;
}
</style>
