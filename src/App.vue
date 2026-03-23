<template>
  <div class="page-bg">
    <div class="container">
      <!-- 顶部 Header -->
      <AppHeader
        :daysLeft="daysLeft"
        :streakDays="streakDays"
        :totalHours="totalHours"
        :syncStatus="syncStatus"
        @open-sync="showSyncModal = true"
      />

      <main class="main-content">
        <!-- 概览 -->
        <SummaryCard
          :totalDays="totalDays"
          :totalQuestions="totalQuestions"
          :avgAccuracy="avgAccuracy"
          :weakestChapter="weakestChapter"
          :totalHours="totalHours"
        />

        <!-- 章节进度 -->
        <ChapterProgress :chapters="sortedChapters" />

        <!-- 录入表单 -->
        <RecordForm
          @add-record="handleAddRecord"
          @add-mock="handleAddMock"
        />

        <!-- 每日曲线 -->
        <DailyChart :chartData="dailyChartData" />

        <!-- 正确率分析 -->
        <AccuracyChart :chartData="accuracyChartData" />

        <!-- 模拟考试趋势 -->
        <MockScoreChart
          :chartData="mockChartData"
          :stats="mockStats"
        />

        <!-- 弱点识别 -->
        <WeaknessCard :weaknesses="weaknesses" />

        <!-- 历史记录 -->
        <HistoryList
          :recentRecords="recentRecords"
          :recentMockExams="recentMockExams"
          @delete-record="handleDeleteRecord"
          @delete-mock="handleDeleteMock"
        />

        <!-- 操作栏 -->
        <ActionBar
          @export="handleExport"
          @import="handleImport"
          @reset="handleReset"
        />
      </main>

      <footer class="app-footer">
        <p>数据已加密存储于 GitHub Gist · 最后更新：{{ studyData.lastUpdate || '从未' }}</p>
        <p>提示：点击顶部「☁️ 云同步」按钮配置 GitHub Token，即可跨设备同步数据</p>
      </footer>
    </div>

    <!-- 云同步弹窗 -->
    <SyncModal v-model:visible="showSyncModal" />

    <!-- Toast 通知 -->
    <ToastNotify />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStudyStore } from './store/useStudyStore.js'
import { useToast } from './composables/useToast.js'

import AppHeader      from './components/AppHeader.vue'
import SyncModal      from './components/SyncModal.vue'
import SummaryCard    from './components/SummaryCard.vue'
import ChapterProgress from './components/ChapterProgress.vue'
import RecordForm     from './components/RecordForm.vue'
import DailyChart     from './components/DailyChart.vue'
import AccuracyChart  from './components/AccuracyChart.vue'
import MockScoreChart from './components/MockScoreChart.vue'
import WeaknessCard   from './components/WeaknessCard.vue'
import HistoryList    from './components/HistoryList.vue'
import ActionBar      from './components/ActionBar.vue'
import ToastNotify    from './components/ToastNotify.vue'

const store = useStudyStore()
const { showToast } = useToast()

const {
  studyData,
  syncStatus,
  daysLeft,
  streakDays,
  totalHours,
  totalDays,
  totalQuestions,
  avgAccuracy,
  weakestChapter,
  sortedChapters,
  weaknesses,
  dailyChartData,
  accuracyChartData,
  mockChartData,
  mockStats,
  recentRecords,
  recentMockExams,
  addRecord,
  deleteRecord,
  addMockRecord,
  deleteMockRecord,
  resetData,
  importData,
} = store

const showSyncModal = ref(false)

async function handleAddRecord(payload) {
  await addRecord(payload)
}

async function handleAddMock(payload) {
  await addMockRecord(payload)
}

async function handleDeleteRecord(index) {
  if (window.confirm('确定要删除这条记录吗？')) {
    await deleteRecord(index)
    showToast('记录已删除', 'info')
  }
}

async function handleDeleteMock(index) {
  if (window.confirm('确定要删除这条模拟考试记录吗？')) {
    await deleteMockRecord(index)
    showToast('模拟考试记录已删除', 'info')
  }
}

function handleExport() {
  const data = JSON.stringify({ ...studyData }, null, 2)
  const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data)
  const a = document.createElement('a')
  a.href = uri
  a.download = `软考高项学习数据_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  showToast('💾 数据已导出为JSON文件！', 'success')
}

async function handleImport(data) {
  await importData(data)
}

async function handleReset() {
  await resetData()
}
</script>

<style>
/* 全局重置 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Microsoft YaHei', 'PingFang SC', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  min-width: 1200px; /* 页面整体最小宽度 */
}

.page-bg {
  min-height: 100vh;
  min-width: 1200px;
}

.container {
  min-width: 1200px;
  width: 100%;        /* 宽时自动撑满 */
  max-width: 100%;    /* 不限制最大宽 */
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  box-sizing: border-box;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  padding: 28px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  border: 1px solid #eaeaea;
}

.card h2 {
  color: #333;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
  font-size: 1.1rem;
}

.app-footer {
  text-align: center;
  padding: 18px 20px;
  color: #888;
  border-top: 1px solid #eaeaea;
  font-size: 0.88rem;
  line-height: 1.8;
}
</style>
