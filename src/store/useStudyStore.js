import { reactive, computed, ref } from 'vue'

// ========== 常量 ==========
// 默认内置章节（作为初始数据）
export const DEFAULT_CHAPTERS = [
  { key: 'project-management', name: '项目管理基础' },
  { key: 'scope',              name: '范围管理' },
  { key: 'time',               name: '时间管理' },
  { key: 'cost',               name: '成本管理' },
  { key: 'quality',            name: '质量管理' },
  { key: 'human-resource',     name: '人力资源管理' },
  { key: 'communication',      name: '沟通管理' },
  { key: 'risk',               name: '风险管理' },
  { key: 'procurement',        name: '采购管理' },
  { key: 'stakeholder',        name: '干系人管理' },
  { key: 'integration',        name: '整合管理' },
  { key: 'performance-domain', name: '项目绩效域' },
]

// 兼容旧代码使用的 CHAPTERS_META（从 studyData 动态派生，下方导出）
export let CHAPTERS_META = {}

// 考试日期：2026-05-23（距2026-03-23恰好61天）
export const EXAM_DATE = new Date(2026, 4, 23) // 2026年5月23日

export const STORAGE_KEY = 'gaoxiang_study_data'
export const GIST_CONFIG_KEY = 'gaoxiang_gist_config'

export const TYPE_COLORS = {
  '综合模拟': '#667eea',
  '章节模拟': '#4CAF50',
  '真题模拟': '#FF9800',
  '冲刺模拟': '#9C27B0',
}

// 根据章节列表创建空章节数据对象
function createEmptyChaptersFromList(chapterList) {
  const chapters = {}
  for (const { key, name } of chapterList) {
    chapters[key] = { name, total: 0, correct: 0, time: 0 }
  }
  return chapters
}

function createEmptyData() {
  return {
    records: [],
    mockExams: [],
    chapters: createEmptyChaptersFromList(DEFAULT_CHAPTERS),
    chapterList: DEFAULT_CHAPTERS.map(c => ({ ...c })), // 用户可编辑的章节列表
    lastUpdate: null,
  }
}

// ========== Gist API ==========
async function gistFetch(token, gistId, method = 'GET', body = null) {
  const url = gistId
    ? `https://api.github.com/gists/${gistId}`
    : 'https://api.github.com/gists'
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

const GIST_FILENAME = 'gaoxiang_study_data.json'

// ========== Store ==========
const studyData = reactive(createEmptyData())

// Gist 配置
const gistConfig = reactive({
  token: '',
  gistId: '',
})

// 同步状态
const syncStatus = ref('idle') // 'idle' | 'syncing' | 'success' | 'error'
const syncMessage = ref('')
const configSaved = ref(false)

// 从 localStorage 加载 Gist 配置
function loadGistConfig() {
  try {
    const raw = localStorage.getItem(GIST_CONFIG_KEY)
    if (raw) {
      const cfg = JSON.parse(raw)
      gistConfig.token = cfg.token || ''
      gistConfig.gistId = cfg.gistId || ''
    }
  } catch {}
}

// 保存 Gist 配置到 localStorage
function saveGistConfig() {
  localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify({
    token: gistConfig.token,
    gistId: gistConfig.gistId,
  }))
  configSaved.value = true
}

// 从 localStorage 加载数据
function loadLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      applyData(parsed)
    }
  } catch {}
}

// 应用数据到 store
function applyData(data) {
  studyData.records = data.records || []
  studyData.mockExams = data.mockExams || []
  studyData.lastUpdate = data.lastUpdate || null

  // 恢复用户章节列表（无则用默认）
  studyData.chapterList = (data.chapterList && data.chapterList.length)
    ? data.chapterList
    : DEFAULT_CHAPTERS.map(c => ({ ...c }))

  // 合并章节数据：保留用户章节列表对应的章节，同时保留历史数据（即使章节已删除的也不丢）
  const newChapters = {}
  // 先把旧 chapters 里的所有数据都搬过来（保留历史）
  if (data.chapters) {
    for (const [key, val] of Object.entries(data.chapters)) {
      newChapters[key] = { name: val.name || key, total: val.total || 0, correct: val.correct || 0, time: val.time || 0 }
    }
  }
  // 确保当前章节列表中每个章节都有记录
  for (const { key, name } of studyData.chapterList) {
    if (!newChapters[key]) {
      newChapters[key] = { name, total: 0, correct: 0, time: 0 }
    } else {
      newChapters[key].name = name // 名字以列表为准
    }
  }
  studyData.chapters = newChapters

  // 同步更新 CHAPTERS_META（供兼容使用）
  syncChaptersMeta()
}

// 同步 CHAPTERS_META 为当前章节列表
function syncChaptersMeta() {
  // 清空再重建
  for (const key of Object.keys(CHAPTERS_META)) delete CHAPTERS_META[key]
  for (const { key, name } of studyData.chapterList) {
    CHAPTERS_META[key] = name
  }
}

// 保存到 localStorage
function saveLocal() {
  studyData.lastUpdate = new Date().toLocaleString('zh-CN')
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...studyData }))
}

// 从 Gist 拉取数据
async function pullFromGist() {
  if (!gistConfig.token || !gistConfig.gistId) return false
  syncStatus.value = 'syncing'
  syncMessage.value = '正在从云端加载数据...'
  try {
    const gist = await gistFetch(gistConfig.token, gistConfig.gistId)
    const content = gist.files?.[GIST_FILENAME]?.content
    if (content) {
      const parsed = JSON.parse(content)
      applyData(parsed)
      saveLocal()
      syncStatus.value = 'success'
      syncMessage.value = '云端数据已加载'
      return true
    }
  } catch (e) {
    syncStatus.value = 'error'
    syncMessage.value = '拉取失败：' + e.message
  }
  return false
}

// 推送数据到 Gist
async function pushToGist() {
  if (!gistConfig.token) return false
  syncStatus.value = 'syncing'
  syncMessage.value = '正在同步到云端...'
  try {
    const fileContent = JSON.stringify({ ...studyData }, null, 2)
    const body = {
      description: '软考高项备考学习数据',
      public: false,
      files: { [GIST_FILENAME]: { content: fileContent } },
    }
    if (gistConfig.gistId) {
      // 更新已有 Gist
      await gistFetch(gistConfig.token, gistConfig.gistId, 'PATCH', body)
    } else {
      // 创建新 Gist
      const result = await gistFetch(gistConfig.token, null, 'POST', body)
      gistConfig.gistId = result.id
      saveGistConfig()
    }
    syncStatus.value = 'success'
    syncMessage.value = '已同步到云端 ✓'
    setTimeout(() => { syncStatus.value = 'idle' }, 3000)
    return true
  } catch (e) {
    syncStatus.value = 'error'
    syncMessage.value = '同步失败：' + e.message
    return false
  }
}

// 保存并同步
async function saveAndSync() {
  saveLocal()
  await pushToGist()
}

// ========== 业务逻辑 ==========

// 添加学习记录
async function addRecord(record) {
  const { chapter, date, questionsDone, correctAnswers, studyTime } = record

  if (!studyData.chapters[chapter]) return

  studyData.records.push({
    date,
    chapter,
    questionsDone,
    correctAnswers,
    studyTime,
    accuracy: questionsDone > 0
      ? Number((correctAnswers / questionsDone * 100).toFixed(1))
      : 0,
  })

  studyData.chapters[chapter].total += questionsDone
  studyData.chapters[chapter].correct += correctAnswers
  studyData.chapters[chapter].time += studyTime

  await saveAndSync()
}

// 删除学习记录
async function deleteRecord(index) {
  const record = studyData.records[index]
  if (!record) return

  studyData.chapters[record.chapter].total -= record.questionsDone
  studyData.chapters[record.chapter].correct -= record.correctAnswers
  studyData.chapters[record.chapter].time -= record.studyTime

  studyData.records.splice(index, 1)
  await saveAndSync()
}

// 添加模拟考试记录
async function addMockRecord(exam) {
  studyData.mockExams.push({
    date: exam.date,
    score: exam.score,
    type: exam.type,
    notes: exam.notes || '',
  })
  await saveAndSync()
}

// 删除模拟考试记录
async function deleteMockRecord(index) {
  studyData.mockExams.splice(index, 1)
  await saveAndSync()
}

// 添加自定义章节
async function addChapter(name) {
  name = name.trim()
  if (!name) return { ok: false, msg: '章节名不能为空' }
  // 检查重名
  if (studyData.chapterList.some(c => c.name === name)) {
    return { ok: false, msg: '已存在同名章节' }
  }
  // 生成唯一 key
  const key = 'custom_' + Date.now()
  studyData.chapterList.push({ key, name })
  studyData.chapters[key] = { name, total: 0, correct: 0, time: 0 }
  syncChaptersMeta()
  await saveAndSync()
  return { ok: true }
}

// 删除章节（只从列表移除，不删除历史数据）
async function removeChapter(key) {
  const idx = studyData.chapterList.findIndex(c => c.key === key)
  if (idx === -1) return
  studyData.chapterList.splice(idx, 1)
  // 注意：不从 studyData.chapters 删除，历史数据保留
  syncChaptersMeta()
  await saveAndSync()
}

// 重置所有数据
async function resetData() {
  const empty = createEmptyData()
  studyData.records = empty.records
  studyData.mockExams = empty.mockExams
  studyData.chapters = empty.chapters
  studyData.chapterList = empty.chapterList
  studyData.lastUpdate = null
  syncChaptersMeta()
  await saveAndSync()
}

// 导入数据
async function importData(json) {
  applyData(json)
  await saveAndSync()
}

// ========== 计算属性 ==========

const daysLeft = computed(() => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const exam = new Date(EXAM_DATE)
  exam.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((exam - now) / (1000 * 60 * 60 * 24)))
})

const streakDays = computed(() => {
  const records = studyData.records
  if (records.length === 0) return 0
  const uniqueDates = [...new Set(records.map(r => r.date))].sort().reverse()
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i])
    d.setHours(0, 0, 0, 0)
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    expected.setHours(0, 0, 0, 0)
    if (i === 0 && d.getTime() !== today.getTime()) break
    if (d.getTime() === expected.getTime()) streak++
    else break
  }
  return streak
})

const totalHours = computed(() =>
  Object.values(studyData.chapters).reduce((s, c) => s + c.time, 0)
)

const MOCK_TOTAL_QUESTIONS = 75 // 每次模拟考试固定75道题

const totalDays = computed(() =>
  new Set(studyData.records.map(r => r.date)).size
)

// 总做题数 = 章节做题数 + 模拟考试题数（每次75题）
const totalQuestions = computed(() =>
  studyData.records.reduce((s, r) => s + r.questionsDone, 0)
  + studyData.mockExams.length * MOCK_TOTAL_QUESTIONS
)

// 平均正确率 = (章节答对数 + 模拟答对数) / 总题数
const avgAccuracy = computed(() => {
  const chapterTotal = studyData.records.reduce((s, r) => s + r.questionsDone, 0)
  const chapterCorrect = studyData.records.reduce((s, r) => s + r.correctAnswers, 0)
  // 模拟：分数即正确率(0-100)，反推答对数 = score/100 * 75
  const mockTotal = studyData.mockExams.length * MOCK_TOTAL_QUESTIONS
  const mockCorrect = studyData.mockExams.reduce((s, e) => s + (e.score / 100 * MOCK_TOTAL_QUESTIONS), 0)
  const total = chapterTotal + mockTotal
  if (total === 0) return '0%'
  return ((chapterCorrect + mockCorrect) / total * 100).toFixed(1) + '%'
})

const weakestChapter = computed(() => {
  let name = '-'
  let lowest = 101
  for (const ch of Object.values(studyData.chapters)) {
    if (ch.total > 0) {
      const acc = ch.correct / ch.total * 100
      if (acc < lowest) { lowest = acc; name = ch.name }
    }
  }
  return name
})

// 章节列表（只含当前 chapterList 中的章节，排序：正确率高 → 低，0题的放最后）
const sortedChapters = computed(() => {
  return studyData.chapterList
    .map(({ key, name }) => {
      const ch = studyData.chapters[key] || { total: 0, correct: 0, time: 0 }
      return {
        key,
        name,
        total: ch.total,
        correct: ch.correct,
        time: ch.time,
        accuracy: ch.total > 0 ? Number((ch.correct / ch.total * 100).toFixed(1)) : null,
      }
    })
    .sort((a, b) => {
      if (a.accuracy === null && b.accuracy === null) return 0
      if (a.accuracy === null) return 1
      if (b.accuracy === null) return -1
      return b.accuracy - a.accuracy
    })
})

// 弱点章节（做题数>10，正确率<60%）
const weaknesses = computed(() =>
  sortedChapters.value
    .filter(ch => ch.total > 10 && ch.accuracy !== null && ch.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
)

// 每日数据（给图表用）
const dailyChartData = computed(() => {
  const daily = {}
  studyData.records.forEach(r => {
    if (!daily[r.date]) daily[r.date] = { questions: 0, correct: 0, time: 0 }
    daily[r.date].questions += r.questionsDone
    daily[r.date].correct += r.correctAnswers
    daily[r.date].time += r.studyTime
  })
  const dates = Object.keys(daily).sort()
  return {
    labels: dates,
    questions: dates.map(d => daily[d].questions),
    accuracy: dates.map(d =>
      daily[d].questions > 0
        ? Number((daily[d].correct / daily[d].questions * 100).toFixed(1))
        : 0
    ),
  }
})

// 章节正确率图表数据（只含当前 chapterList 中的章节）
const accuracyChartData = computed(() => {
  const items = studyData.chapterList.map(({ key, name }) => {
    const ch = studyData.chapters[key] || { total: 0, correct: 0 }
    return {
      name,
      accuracy: ch.total > 0 ? Number((ch.correct / ch.total * 100).toFixed(1)) : 0,
      total: ch.total,
    }
  })
  items.sort((a, b) => a.accuracy - b.accuracy)
  return {
    labels: items.map(i => i.name),
    accuracy: items.map(i => i.accuracy),
    total: items.map(i => i.total),
  }
})

// 模拟考试图表数据
const mockChartData = computed(() => {
  const sorted = [...studyData.mockExams].sort((a, b) => a.date.localeCompare(b.date))
  return {
    exams: sorted,
    labels: sorted.map(e => e.date),
    scores: sorted.map(e => e.score),
    colors: sorted.map(e => TYPE_COLORS[e.type] || '#999'),
  }
})

// 模拟考试统计
const mockStats = computed(() => {
  const exams = studyData.mockExams
  if (exams.length === 0) return null
  const scores = exams.map(e => e.score)
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length
  const max = Math.max(...scores)
  const sorted = [...exams].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0].score
  let trend = ''
  if (sorted.length >= 2) {
    const diff = sorted[0].score - sorted[1].score
    if (diff > 5) trend = '📈 大幅提升'
    else if (diff > 0) trend = '↗️ 小幅提升'
    else if (diff < -5) trend = '📉 大幅下降'
    else if (diff < 0) trend = '↘️ 小幅下降'
    else trend = '➡️ 保持稳定'
  }
  return { count: exams.length, avg: avg.toFixed(1), max: max.toFixed(1), latest: latest.toFixed(1), trend }
})

// 最近学习记录（最近5条，倒序）
const recentRecords = computed(() =>
  [...studyData.records]
    .map((r, i) => ({ ...r, originalIndex: i }))
    .reverse()
    .slice(0, 5)
)

// 最近模拟考试（最近5条，倒序）
const recentMockExams = computed(() =>
  [...studyData.mockExams]
    .map((e, i) => ({ ...e, originalIndex: i }))
    .reverse()
    .slice(0, 5)
)

// 模拟考试进度汇总（给进度卡用）
const mockProgress = computed(() => {
  const exams = studyData.mockExams
  const count = exams.length
  const totalQ = count * MOCK_TOTAL_QUESTIONS
  const totalCorrect = exams.reduce((s, e) => s + (e.score / 100 * MOCK_TOTAL_QUESTIONS), 0)
  const avgScore = count > 0 ? (exams.reduce((s, e) => s + e.score, 0) / count) : 0
  const avgAcc = totalQ > 0 ? (totalCorrect / totalQ * 100) : 0
  // 按类型分组统计
  const byType = {}
  for (const e of exams) {
    if (!byType[e.type]) byType[e.type] = { count: 0, totalScore: 0 }
    byType[e.type].count++
    byType[e.type].totalScore += e.score
  }
  const typeStats = Object.entries(byType).map(([type, s]) => ({
    type,
    count: s.count,
    avgScore: (s.totalScore / s.count).toFixed(1),
  }))
  return {
    count,
    totalQuestions: totalQ,
    avgScore: avgScore.toFixed(1),
    avgAccuracy: avgAcc.toFixed(1),
    typeStats,
    passRate: count > 0
      ? ((exams.filter(e => e.score >= 60).length / count) * 100).toFixed(0)
      : '0',
  }
})

// ========== 工具函数 ==========
export function formatStudyTime(hours) {
  if (hours === 0) return '0h'
  if (hours < 0.1) return `${Math.round(hours * 60)}分钟`
  if (Math.abs(hours - Math.round(hours)) < 0.01) return `${Math.round(hours)}h`
  const rounded = Math.round(hours * 10) / 10
  const whole = Math.floor(rounded)
  const mins = Math.round((rounded - whole) * 60)
  if (whole === 0) return `${mins}分钟`
  if (mins === 0) return `${whole}h`
  return `${whole}h ${mins}分钟`
}

export function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ========== 初始化 ==========
function init() {
  loadGistConfig()
  loadLocalData()
  // 确保 CHAPTERS_META 与 chapterList 同步
  syncChaptersMeta()
}
init()

// ========== 导出 ==========
export function useStudyStore() {
  return {
    // 数据
    studyData,
    gistConfig,
    syncStatus,
    syncMessage,
    configSaved,

    // 计算属性
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
    mockProgress,

    // 方法
    loadGistConfig,
    saveGistConfig,
    pullFromGist,
    pushToGist,
    addRecord,
    deleteRecord,
    addMockRecord,
    deleteMockRecord,
    addChapter,
    removeChapter,
    resetData,
    importData,
  }
}
