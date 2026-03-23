<template>
  <section class="card">
    <h2>🎯 章节正确率分析</h2>
    <div class="chart-wrap">
      <canvas ref="canvasRef"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  chartData: Object,
})

const canvasRef = ref(null)
let chartInstance = null

function barColor(acc) {
  if (acc >= 80) return '#4CAF50'
  if (acc >= 60) return '#FFC107'
  return '#F44336'
}
function borderColor(acc) {
  if (acc >= 80) return '#388E3C'
  if (acc >= 60) return '#FFA000'
  return '#D32F2F'
}

function buildChart() {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  const { labels = [], accuracy = [], total = [] } = props.chartData || {}

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '正确率(%)',
          data: accuracy,
          backgroundColor: accuracy.map(barColor),
          borderColor: accuracy.map(borderColor),
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: '做题数量',
          data: total,
          type: 'line',
          borderColor: '#667eea',
          backgroundColor: 'rgba(102,126,234,0.1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: '章节' } },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: '正确率(%)' },
          min: 0,
          max: 100,
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: '做题数量' },
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
</style>
