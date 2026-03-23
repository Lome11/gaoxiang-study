<template>
  <section class="card">
    <h2>📈 模拟考试成绩趋势</h2>
    <div class="chart-wrap">
      <canvas v-show="hasData" ref="canvasRef"></canvas>
      <div v-if="!hasData" class="empty-hint">
        <div class="empty-icon">📊</div>
        <h3>暂无模拟考试数据</h3>
        <p>请在下方添加模拟考试记录以查看成绩趋势</p>
      </div>
    </div>

    <div v-if="stats" class="mock-stats">
      <div class="stat-item">
        <div class="stat-label">考试次数</div>
        <div class="stat-value purple">{{ stats.count }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">平均分数</div>
        <div class="stat-value green">{{ stats.avg }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">最高分数</div>
        <div class="stat-value orange">{{ stats.max }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">最新分数</div>
        <div class="stat-value blue">{{ stats.latest }}</div>
      </div>
      <div v-if="stats.trend" class="stat-item full">
        <div class="stat-label">成绩趋势</div>
        <div class="stat-value trend">{{ stats.trend }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  chartData: Object,
  stats: Object,
})

const canvasRef = ref(null)
let chartInstance = null

const hasData = computed(() => props.chartData?.labels?.length > 0)

function buildChart() {
  if (!canvasRef.value) return
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }
  if (!hasData.value) return

  const { labels = [], scores = [], colors = [], exams = [] } = props.chartData || {}

  chartInstance = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '模拟考试成绩',
          data: scores,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102,126,234,0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: '考试日期' } },
        y: {
          title: { display: true, text: '分数' },
          min: 0,
          max: 100,
          ticks: { callback: v => v + '分' },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const exam = exams[ctx.dataIndex]
              let text = `${exam.score}分`
              if (exam.type) text += ` (${exam.type})`
              if (exam.notes) text += ` - ${exam.notes}`
              return text
            },
            afterLabel: ctx => {
              const score = exams[ctx.dataIndex].score
              if (score >= 75) return '🎉 优秀！继续保持！'
              if (score >= 60) return '👍 合格，还有提升空间'
              if (score >= 45) return '⚠️ 需要加强复习'
              return '❌ 需要重点复习'
            },
          },
        },
      },
    },
  })
}

onMounted(buildChart)
watch(() => props.chartData, buildChart, { deep: true })
onBeforeUnmount(() => { if (chartInstance) chartInstance.destroy() })
</script>

<style scoped>
.chart-wrap {
  position: relative;
  height: 280px;
  width: 100%;
}

.empty-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  gap: 8px;
}
.empty-icon { font-size: 2.5rem; }
.empty-hint h3 { margin: 0; font-size: 1rem; color: #666; }
.empty-hint p { margin: 0; font-size: 0.9rem; }

.mock-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item.full { grid-column: 1 / -1; }

.stat-label { font-size: 0.8rem; color: #666; margin-bottom: 4px; }

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
}

.stat-value.purple { color: #9C27B0; }
.stat-value.green  { color: #4CAF50; }
.stat-value.orange { color: #FF9800; }
.stat-value.blue   { color: #667eea; }
.stat-value.trend  { font-size: 1.1rem; color: #333; }

@media (max-width: 600px) {
  .mock-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
