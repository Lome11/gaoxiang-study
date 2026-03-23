<template>
  <section class="card">
    <h2>➕ 今日学习记录</h2>
    <div class="form-section">
      <!-- 章节选择 -->
      <div class="form-group">
        <label>选择章节：</label>
        <div class="chapter-row">
          <select v-model="form.chapter" class="chapter-select">
            <option v-for="ch in chapterList" :key="ch.key" :value="ch.key">
              {{ ch.name }}
            </option>
          </select>
          <button class="btn-manage" @click="showManage = !showManage" title="管理章节">
            ⚙️ 管理
          </button>
        </div>

        <!-- 章节管理面板 -->
        <div v-if="showManage" class="manage-panel">
          <div class="manage-header">
            <span class="manage-title">📚 章节管理</span>
            <button class="btn-close" @click="showManage = false">✕</button>
          </div>

          <!-- 现有章节列表 -->
          <ul class="chapter-list">
            <li v-for="ch in chapterList" :key="ch.key" class="chapter-item">
              <span class="ch-name">{{ ch.name }}</span>
              <span v-if="ch.key.startsWith('custom_') || !isDefaultChapter(ch.key)" class="ch-tag custom">自定义</span>
              <span v-else class="ch-tag builtin">内置</span>
              <button
                class="btn-del"
                @click="handleRemoveChapter(ch.key, ch.name)"
                title="删除（历史数据保留）"
              >🗑️</button>
            </li>
          </ul>

          <!-- 添加新章节 -->
          <div class="add-chapter-row">
            <input
              v-model="newChapterName"
              type="text"
              placeholder="输入新章节名称"
              @keyup.enter="handleAddChapter"
              class="add-input"
            />
            <button class="btn-add-ch" @click="handleAddChapter" :disabled="addingChapter">
              {{ addingChapter ? '...' : '+ 添加' }}
            </button>
          </div>
          <p class="manage-tip">💡 删除章节不会删除该章节的历史学习数据，仅从选择列表中移除</p>
        </div>
      </div>

      <!-- 日期 -->
      <div class="form-group">
        <label>学习日期：</label>
        <div class="date-row">
          <input type="date" v-model="form.date" />
          <button class="btn-today" @click="form.date = todayStr">今天</button>
        </div>
      </div>

      <!-- 做题数 -->
      <div class="form-group">
        <label>今日做题数量：</label>
        <input
          type="number"
          v-model.number="form.questionsDone"
          min="0"
          placeholder="输入今日做题数量"
        />
      </div>

      <!-- 正确题数 -->
      <div class="form-group">
        <label>正确题目数量：</label>
        <input
          type="number"
          v-model.number="form.correctAnswers"
          min="0"
          placeholder="输入正确题目数量"
        />
      </div>

      <!-- 学习时长 -->
      <div class="form-group">
        <label>学习时长（小时）：</label>
        <input
          type="number"
          v-model.number="form.studyTime"
          min="0"
          step="0.1"
          placeholder="例如：1.5 表示1小时30分钟"
        />
        <small>可以输入小数，如：0.5=30分钟，1.25=1小时15分钟</small>
      </div>

      <button class="btn-add" :disabled="submitting" @click="handleAdd">
        {{ submitting ? '保存中...' : '📝 添加学习记录' }}
      </button>

      <hr class="divider" />

      <!-- 模拟考试 -->
      <h3 class="section-title">📝 模拟考试记录</h3>

      <div class="form-group">
        <label>考试日期：</label>
        <div class="date-row">
          <input type="date" v-model="mockForm.date" />
          <button class="btn-today" @click="mockForm.date = todayStr">今天</button>
        </div>
      </div>

      <div class="form-group">
        <label>答对题数：</label>
        <input
          type="number"
          v-model.number="mockForm.score"
          min="0"
          max="75"
          step="0.1"
          placeholder="输入分数（0-100）"
        />
      </div>

      <div class="form-group">
        <label>考试类型：</label>
        <select v-model="mockForm.type">
          <option value="综合模拟">综合模拟考试</option>
          <option value="章节模拟">章节模拟考试</option>
          <option value="真题模拟">历年真题模拟</option>
          <option value="冲刺模拟">冲刺模拟考试</option>
        </select>
      </div>

      <div class="form-group">
        <label>考试备注：</label>
        <input
          type="text"
          v-model="mockForm.notes"
          placeholder="例如：上午卷、下午卷、错题分析等"
        />
      </div>

      <button class="btn-mock" :disabled="mockSubmitting" @click="handleAddMock">
        {{ mockSubmitting ? '保存中...' : '📊 添加模拟考试记录' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, watch } from 'vue'
import { DEFAULT_CHAPTERS, getTodayString, useStudyStore } from '../store/useStudyStore.js'
import { useToast } from '../composables/useToast.js'

const emit = defineEmits(['add-record', 'add-mock'])
const { showToast } = useToast()
const store = useStudyStore()

const todayStr = getTodayString()
const CHAPTER_CACHE_KEY = 'gaoxiang_selected_chapter'

// 章节列表直接从 store 读取（响应式）
const chapterList = computed(() => store.studyData.chapterList)

// 默认章节的 key 集合
const defaultKeys = new Set(DEFAULT_CHAPTERS.map(c => c.key))
function isDefaultChapter(key) {
  return defaultKeys.has(key)
}

// 读取缓存的章节选择，没有则取第一个
function getInitialChapter() {
  try {
    const cached = localStorage.getItem(CHAPTER_CACHE_KEY)
    if (cached && chapterList.value.some(c => c.key === cached)) return cached
  } catch {}
  return chapterList.value[0]?.key || ''
}

const form = reactive({
  chapter: getInitialChapter(),
  date: todayStr,
  questionsDone: '',
  correctAnswers: '',
  studyTime: '',
})

// 章节选择变化时，缓存到 localStorage
watch(() => form.chapter, (val) => {
  try { localStorage.setItem(CHAPTER_CACHE_KEY, val) } catch {}
})

// 当章节列表变化时，确保 form.chapter 有效（如被删除则切换到第一个）
watchEffect(() => {
  if (chapterList.value.length > 0) {
    const keys = chapterList.value.map(c => c.key)
    if (!keys.includes(form.chapter)) {
      form.chapter = keys[0]
    }
  }
})

const mockForm = reactive({
  date: todayStr,
  score: '',
  type: '综合模拟',
  notes: '',
})

const submitting = ref(false)
const mockSubmitting = ref(false)

// 章节管理面板
const showManage = ref(false)
const newChapterName = ref('')
const addingChapter = ref(false)

async function handleAddChapter() {
  const name = newChapterName.value.trim()
  if (!name) return
  addingChapter.value = true
  try {
    const result = await store.addChapter(name)
    if (result.ok) {
      newChapterName.value = ''
      showToast(`✅ 章节「${name}」已添加`, 'success')
    } else {
      showToast(result.msg, 'error')
    }
  } finally {
    addingChapter.value = false
  }
}

async function handleRemoveChapter(key, name) {
  if (!window.confirm(`确定要从列表中移除「${name}」吗？\n\n该章节的历史数据不会丢失，仅从选择列表中移除。`)) return
  await store.removeChapter(key)
  showToast(`章节「${name}」已移除（历史数据已保留）`, 'info')
}

async function handleAdd() {
  if (!form.date) {
    showToast('请选择日期', 'warning')
    return
  }
  const q = Number(form.questionsDone) || 0
  const c = Number(form.correctAnswers) || 0
  const t = Number(form.studyTime) || 0
  if (c > q) {
    showToast('正确题目数量不能超过总题目数量', 'error')
    return
  }
  submitting.value = true
  try {
    await emit('add-record', {
      chapter: form.chapter,
      date: form.date,
      questionsDone: q,
      correctAnswers: c,
      studyTime: t,
    })
    form.questionsDone = ''
    form.correctAnswers = ''
    form.studyTime = ''
    showToast('✨ 学习记录已添加！', 'success')
  } finally {
    submitting.value = false
  }
}

async function handleAddMock() {
  if (!mockForm.date) {
    showToast('请选择考试日期', 'warning')
    return
  }
  const score = Number(mockForm.score)
  if (isNaN(score) || score < 0 || score > 75) {
    showToast('请输入有效的答对题数（0-75）', 'error')
    return
  }
  mockSubmitting.value = true
  try {
    await emit('add-mock', {
      date: mockForm.date,
      score,
      type: mockForm.type,
      notes: mockForm.notes,
    })
    mockForm.score = ''
    mockForm.notes = ''
    showToast('📊 模拟考试记录已添加！', 'success')
  } finally {
    mockSubmitting.value = false
  }
}
</script>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

small {
  color: #888;
  font-size: 0.82rem;
}

/* 章节行：下拉 + 管理按钮 */
.chapter-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.chapter-select {
  flex: 1;
  min-width: 0;
}

.btn-manage {
  padding: 8px 12px;
  background: #f0f4ff;
  color: #667eea;
  border: 2px solid #c5d0f5;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.btn-manage:hover {
  background: #e0e8ff;
  border-color: #667eea;
}

/* 管理面板 */
.manage-panel {
  background: #f8f9ff;
  border: 2px solid #c5d0f5;
  border-radius: 10px;
  padding: 16px;
  margin-top: 4px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.manage-title {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

.btn-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.btn-close:hover { background: #eee; color: #333; }

/* 章节列表 */
.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  max-height: 200px;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}
.chapter-item:hover { background: #eef1ff; }

.ch-name {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.ch-tag {
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 10px;
  white-space: nowrap;
}
.ch-tag.builtin {
  background: #e8f4fd;
  color: #1a7abf;
}
.ch-tag.custom {
  background: #fef3e2;
  color: #e07800;
}

.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 2px 6px;
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s;
}
.btn-del:hover { opacity: 1; background: #ffe0e0; }

/* 添加新章节行 */
.add-chapter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.add-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}
.add-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-add-ch {
  padding: 8px 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}
.btn-add-ch:hover { background: #5a6fd6; }
.btn-add-ch:disabled { opacity: 0.6; cursor: not-allowed; }

.manage-tip {
  font-size: 0.78rem;
  color: #999;
  margin: 0;
  line-height: 1.5;
}

/* 通用输入控件 */
select,
input[type='number'],
input[type='date'],
input[type='text'] {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

select:focus,
input:focus {
  outline: none;
  border-color: #667eea;
}

.date-row {
  display: flex;
  gap: 8px;
}

.date-row input {
  flex: 1;
}

button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-today {
  background: #f0f0f0;
  color: #333;
  padding: 10px 14px;
  white-space: nowrap;
}
.btn-today:hover { background: #e0e0e0; }

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.btn-add:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }

.btn-mock {
  background: #9C27B0;
  color: white;
}
.btn-mock:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(156,39,176,0.4); }

.divider {
  border: none;
  border-top: 2px dashed #ddd;
  margin: 8px 0;
}

.section-title {
  color: #333;
  font-size: 1rem;
  margin: 0;
}
</style>
