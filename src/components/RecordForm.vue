<template>
  <section class="card">
    <h2>➕ 今日学习记录</h2>
    <div class="form-section">
      <!-- 章节选择 -->
      <div class="form-group">
        <label>选择章节：</label>
        <select v-model="form.chapter">
          <option v-for="(name, key) in CHAPTERS_META" :key="key" :value="key">
            {{ name }}
          </option>
        </select>
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
        <label>模拟考试分数：</label>
        <input
          type="number"
          v-model.number="mockForm.score"
          min="0"
          max="100"
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
import { ref, reactive } from 'vue'
import { CHAPTERS_META, getTodayString } from '../store/useStudyStore.js'
import { useToast } from '../composables/useToast.js'

const emit = defineEmits(['add-record', 'add-mock'])
const { showToast } = useToast()

const todayStr = getTodayString()

const form = reactive({
  chapter: 'project-management',
  date: todayStr,
  questionsDone: '',
  correctAnswers: '',
  studyTime: '',
})

const mockForm = reactive({
  date: todayStr,
  score: '',
  type: '综合模拟',
  notes: '',
})

const submitting = ref(false)
const mockSubmitting = ref(false)

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
  if (isNaN(score) || score < 0 || score > 100) {
    showToast('请输入有效的分数（0-100）', 'error')
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
