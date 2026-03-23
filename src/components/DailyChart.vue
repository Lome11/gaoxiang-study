<template>
  <section class="card">
    <h2>📅 每日学习曲线</h2>
    <div class="chart-wrap">
      <canvas ref="canvasRef"></canvas>
      <div v-if="!hasData" class="empty-hint">
        <div class="empty-icon">📅</div>
        <p>暂无学习数据</p>
        <small>添加学习记录后，图表将自动显示</small>
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
})

const canvasRef = ref(null)
let chartInstance = null

const hasData = computed(() => props.chartData?.labels?.length > 0)

function buildChart() {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  const { labels = [], questions = [], accuracy = [] } = props.chartData || {}

  chartInstance = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '每日做题数',
          data: questions,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102,126,234,0.1)',
          borderWidth: 2,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: '每日正确率(%)',
          data: accuracy,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76,175,80,0.08)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { title: { display: true, text: '日期' } },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: '题目数量' },
          min: 0,
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: '正确率(%)' },
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
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
small { font-size: 0.85rem; }
</style>
