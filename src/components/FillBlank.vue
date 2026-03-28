<template>
  <div class="fb-page">

    <!-- ══ 顶部导航 ══ -->
    <div class="fb-topbar">
      <button class="fb-back-btn" @click="handleBack">← 返回主页</button>
      <div class="fb-topbar-title">✏️ 填空练习</div>
    </div>

    <!-- ══ 主体内容 ══ -->
    <div class="fb-body">

      <!-- ================================================================
           配置 + 统计区（setup/result 时显示）
      ================================================================ -->
      <div v-if="stage !== 'quiz'" class="fb-top-row">

        <!-- 左：配置卡 -->
        <div class="fb-config-card fb-card-stretch">
          <div class="card-title">开始练习</div>

          <div class="dist-tags">
            <span class="dist-tag m">80% 十大管理</span>
            <span class="dist-tag o">20% 其他领域</span>
          </div>

          <!-- 题目数选择 -->
          <div class="cfg-row">
            <span class="cfg-lbl">题目数量</span>
            <div class="count-btns">
              <button
                v-for="n in [10, 20, 30]"
                :key="n"
                class="cnt-btn"
                :class="{ active: selectedCount === n && !customMode }"
                @click="selectPreset(n)"
              >{{ n }}</button>
              <button
                class="cnt-btn custom-btn"
                :class="{ active: customMode }"
                @click="toggleCustom"
              >自定义</button>
            </div>
          </div>

          <!-- 自定义数量输入 -->
          <div v-if="customMode" class="cfg-row custom-row">
            <span class="cfg-lbl">自定义数量</span>
            <div class="custom-input-wrap">
              <input
                v-model.number="customCount"
                type="number"
                min="1"
                :max="maxQ"
                class="custom-input"
                placeholder="输入题数"
                @input="clampCustom"
              />
              <span class="custom-hint">最多 {{ maxQ }} 题</span>
            </div>
          </div>

          <!-- 错题专练 -->
          <div v-if="wrongList.length > 0" class="cfg-row">
            <div class="wrong-entry" @click="startWrongReview">
              📋 错题本（{{ wrongList.length }} 题）—— 点击专练
            </div>
          </div>

          <div class="cfg-spacer"></div>

          <button class="start-btn" @click="startPractice">
            开始练习（{{ finalCount }} 题）
          </button>
        </div>

        <!-- 右：统计面板 -->
        <div class="fb-stat-card fb-card-stretch">
          <div class="card-title">📊 我的统计</div>

          <!-- 数字概览 -->
          <div class="stat-nums">
            <div class="sn-item">
              <span class="sn-val">{{ historyStats.sessions }}</span>
              <span class="sn-lbl">练习次数</span>
            </div>
            <div class="sn-item">
              <span class="sn-val">{{ historyStats.total }}</span>
              <span class="sn-lbl">累计做题</span>
            </div>
            <div class="sn-item hi">
              <span class="sn-val">{{ historyStats.accuracy }}%</span>
              <span class="sn-lbl">平均正确率</span>
            </div>
            <div class="sn-item warn">
              <span class="sn-val">{{ wrongList.length }}</span>
              <span class="sn-lbl">错题本</span>
            </div>
          </div>

          <!-- 最强 / 最弱 高亮块 -->
          <div v-if="categoryAnalysis.length >= 2" class="stat-best-worst">
            <div class="sbw-item best">
              <div class="sbw-icon">💪</div>
              <div class="sbw-info">
                <div class="sbw-label">最强领域</div>
                <div class="sbw-name">{{ categoryAnalysis[0].name }}</div>
              </div>
              <div class="sbw-pct best-pct">{{ categoryAnalysis[0].accuracy }}%</div>
            </div>
            <div class="sbw-item worst">
              <div class="sbw-icon">⚠️</div>
              <div class="sbw-info">
                <div class="sbw-label">需加强</div>
                <div class="sbw-name">{{ categoryAnalysis[categoryAnalysis.length-1].name }}</div>
              </div>
              <div class="sbw-pct worst-pct">{{ categoryAnalysis[categoryAnalysis.length-1].accuracy }}%</div>
            </div>
          </div>
          <div v-else class="stat-bw-placeholder">完成练习后显示最强/最弱领域</div>
        </div>
      </div>

      <!-- ================================================================
           答题区（quiz 阶段）— 等高布局
      ================================================================ -->
      <div v-if="stage === 'quiz'" class="fb-quiz-layout">

        <!-- 答题卡（左，粘性） -->
        <div class="fb-answer-card">
          <div class="ac-title">答题卡</div>
          <div class="ac-grid">
            <button
              v-for="(q, i) in questions"
              :key="i"
              class="ac-btn"
              :class="cardBtnClass(i)"
              @click="jumpToQuestion(i)"
            >{{ i + 1 }}</button>
          </div>
          <div class="ac-legend">
            <span><i class="dot unanswered"></i>未作答</span>
            <span><i class="dot correct"></i>正确</span>
            <span><i class="dot wrong"></i>错误</span>
          </div>
          <div class="ac-prog-text">已提交 {{ submittedCount }}/{{ questions.length }}</div>
          <div class="ac-prog-bar"><div class="ac-prog-fill" :style="{ width: (submittedCount/questions.length*100) + '%' }"></div></div>
          <button
            class="ac-finish-btn"
            :class="{ on: submittedCount === questions.length }"
            @click="finishQuiz"
          >
            {{ submittedCount === questions.length ? '📊 查看结果' : `剩 ${questions.length - submittedCount} 题未提交` }}
          </button>
        </div>

        <!-- 题目面板（右） -->
        <div class="fb-q-panel">
          <div class="qp-header">
            <span class="qp-num">第 {{ currentIndex + 1 }} 题</span>
            <span class="qp-cat">{{ categoryName(currentQ.category) }}</span>
            <div class="qp-navs">
              <button class="qp-nav" :disabled="currentIndex === 0" @click="goPrev">‹ 上一题</button>
              <button class="qp-nav" :disabled="currentIndex === questions.length - 1" @click="goNextQuestion">下一题 ›</button>
            </div>
          </div>

          <div class="qp-text">
            <span v-for="(part, idx) in questionParts" :key="idx">
              <span v-if="part.type === 'text'">{{ part.content }}</span>
              <span v-else class="qp-blank">
                <span v-if="submittedFlags[currentIndex]">
                  <span class="qp-user-ans" :class="isCorrect(currentIndex) ? 'ans-ok' : 'ans-err'">
                    {{ userAnswers[currentIndex] || '（未填写）' }}
                  </span>
                </span>
                <span v-else class="qp-blank-line"></span>
              </span>
            </span>
          </div>

          <div v-if="!submittedFlags[currentIndex]" class="qp-input-row">
            <input
              ref="answerInputRef"
              v-model="userAnswers[currentIndex]"
              type="text"
              class="qp-input"
              placeholder="输入答案，回车提交..."
              @keyup.enter="onInputEnter"
            />
            <button class="qp-submit" @click="submitCurrent">提交</button>
          </div>

          <div v-if="submittedFlags[currentIndex]" class="qp-analysis">
            <div class="qa-row">
              <span class="qa-lbl ok">✅ 参考答案：</span>
              <span class="qa-val">{{ currentQ.answer }}</span>
            </div>
            <div class="qa-row">
              <span class="qa-lbl">📖 解析：</span>
              <span class="qa-val gray">{{ currentQ.analysis }}</span>
            </div>
            <div class="qa-judge" :class="isCorrect(currentIndex) ? 'j-ok' : 'j-err'">
              {{ isCorrect(currentIndex) ? '✓ 回答正确' : '✗ 回答有误，记住正确答案' }}
            </div>
            <!-- 回车跳下一题的隐藏焦点盒 -->
            <div
              ref="nextFocusRef"
              tabindex="0"
              class="qp-enter-hint"
              @keydown.enter="handleEnterAfterSubmit"
            >
              <span v-if="currentIndex < questions.length - 1">⏎ 按回车继续下一题</span>
              <span v-else>⏎ 按回车查看结果</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================
           结果区（result 阶段）
      ================================================================ -->
      <div v-if="stage === 'result'" class="fb-result-layout">

        <!-- 得分卡 -->
        <div class="res-score-card">
          <div class="res-icon">{{ resultIcon }}</div>
          <div class="res-score">
            <span class="rs-c" :class="scoreClass">{{ correctCount }}</span>
            <span class="rs-sep">/</span>
            <span class="rs-t">{{ questions.length }}</span>
          </div>
          <div class="res-acc" :class="scoreClass">正确率 {{ accuracyPercent }}%</div>
          <div class="res-btns">
            <button class="res-btn again" @click="restartPractice">🔄 再练一次</button>
            <button class="res-btn back" @click="handleBack">返回主页</button>
          </div>
        </div>

        <!-- 本次分类正确率 -->
        <div class="res-cat-card">
          <div class="card-title">本次各领域</div>
          <div v-for="cs in categoryStats" :key="cs.key" class="res-cat-row">
            <span class="rcs-name">{{ cs.name }}</span>
            <div class="rcs-bar-track">
              <div class="rcs-bar" :style="{ width: cs.accuracy + '%' }" :class="cs.accuracy >= 70 ? 'good' : cs.accuracy >= 40 ? 'mid' : 'bad'"></div>
            </div>
            <span class="rcs-pct">{{ cs.correct }}/{{ cs.total }}</span>
          </div>
        </div>

        <!-- 本次错题（第二行左） -->
        <div class="res-wrong-card">
          <div class="card-title">本次错题（{{ wrongInSession.length }} 题）</div>
          <div v-if="wrongInSession.length === 0" class="rw-empty">🎉 本次全部答对！</div>
          <div v-for="(item, i) in wrongInSession" :key="i" class="rw-item">
            <div class="rw-meta">{{ item.origIndex + 1 }}. {{ categoryName(item.category) }}</div>
            <div class="rw-q">{{ item.question }}</div>
            <div class="rw-row">你的答案：<span class="rw-yours">{{ item.userAnswer || '（未填写）' }}</span></div>
            <div class="rw-row">正确答案：<span class="rw-correct">{{ item.answer }}</span></div>
            <div class="rw-analysis">{{ item.analysis }}</div>
          </div>
        </div>

        <!-- 全题回顾（第二行右） -->
        <div class="res-all-card">
          <div class="card-title">全部题目回顾</div>
          <div v-for="(q, i) in questions" :key="i" class="ra-item" :class="isCorrect(i) ? 'ra-ok' : 'ra-err'">
            <div class="ra-header">
              <span class="ra-num">{{ i + 1 }}</span>
              <span class="ra-cat">{{ categoryName(q.category) }}</span>
              <span class="ra-badge" :class="isCorrect(i) ? 'badge-ok' : 'badge-err'">
                {{ isCorrect(i) ? '✓ 正确' : '✗ 错误' }}
              </span>
            </div>
            <div class="ra-q">{{ q.question }}</div>
            <div class="ra-ans">
              <span class="ra-lbl">你：</span>
              <span :class="isCorrect(i) ? 'ans-ok' : 'ans-err'">{{ userAnswers[i] || '（未填写）' }}</span>
              <span class="ra-lbl" style="margin-left:12px">答：</span>
              <span class="ans-ok">{{ q.answer }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================
           历史统计看板（历史记录上方，有数据才显示）
      ================================================================ -->
      <div v-if="sessionHistory.length > 0" class="fb-history-stats">
        <!-- 左：领域强弱 -->
        <div class="hs-cat-panel">
          <div class="hsp-title">领域强弱分析</div>
          <div v-if="categoryAnalysis.length > 0" class="ca-bars">
            <div
              v-for="item in categoryAnalysis"
              :key="item.key"
              class="ca-bar-row"
            >
              <span class="ca-bar-name">{{ item.name }}</span>
              <div class="ca-bar-track">
                <div
                  class="ca-bar-fill"
                  :style="{ width: item.accuracy + '%' }"
                  :class="item.accuracy >= 80 ? 'good' : item.accuracy >= 60 ? 'mid' : 'bad'"
                ></div>
              </div>
              <span class="ca-bar-pct" :class="item.accuracy >= 80 ? 'c-good' : item.accuracy >= 60 ? 'c-mid' : 'c-bad'">
                {{ item.accuracy }}%
              </span>
              <span class="ca-bar-cnt">({{ item.correct }}/{{ item.total }})</span>
            </div>
          </div>
          <div v-else class="hsp-empty">完成更多练习后显示</div>
        </div>

        <!-- 右：每日正确率折线图 -->
        <div class="hs-trend-panel">
          <div class="hsp-title">每日正确率趋势</div>
          <div v-if="dailyTrend.length >= 1" class="trend-wrap">
            <svg class="trend-svg" viewBox="0 0 300 90" preserveAspectRatio="none">
              <!-- Y轴参考线 -->
              <line x1="0" y1="18" x2="300" y2="18" stroke="#f0f0f0" stroke-width="1"/>
              <line x1="0" y1="36" x2="300" y2="36" stroke="#f0f0f0" stroke-width="1"/>
              <line x1="0" y1="54" x2="300" y2="54" stroke="#f0f0f0" stroke-width="1"/>
              <line x1="0" y1="72" x2="300" y2="72" stroke="#f0f0f0" stroke-width="1"/>
              <!-- Y轴标签 -->
              <text x="4" y="17" font-size="8" fill="#ccc">100%</text>
              <text x="4" y="53" font-size="8" fill="#ccc">50%</text>
              <text x="4" y="89" font-size="8" fill="#ccc">0%</text>
              <!-- 渐变填充 -->
              <polygon :points="trendFillPoints" fill="url(#trendGrad)" opacity="0.2"/>
              <!-- 折线 -->
              <polyline :points="trendLinePoints" fill="none" stroke="#667eea" stroke-width="2" stroke-linejoin="round"/>
              <!-- 数据点 -->
              <circle
                v-for="(pt, i) in trendPoints"
                :key="i"
                :cx="pt.x" :cy="pt.y" r="3.5"
                :fill="pt.acc >= 80 ? '#34d399' : pt.acc >= 60 ? '#fbbf24' : '#f87171'"
                stroke="white" stroke-width="1.5"
              />
              <!-- 数据点数值 -->
              <text
                v-for="(pt, i) in trendPoints"
                :key="'l'+i"
                :x="pt.x" :y="pt.y - 6"
                text-anchor="middle"
                font-size="7.5"
                :fill="pt.acc >= 80 ? '#059669' : pt.acc >= 60 ? '#d97706' : '#dc2626'"
                font-weight="600"
              >{{ pt.acc }}%</text>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#667eea" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            <!-- X轴日期 -->
            <div class="trend-xaxis">
              <span v-for="(d, i) in dailyTrendLabels" :key="i" class="trend-xlabel">{{ d }}</span>
            </div>
          </div>
          <div v-else class="hsp-empty">
            <div class="hsp-empty-icon">📈</div>
            <div>完成第一次练习后<br>即可显示趋势</div>
          </div>
        </div>
      </div>

      <!-- ================================================================
           答题历史记录（始终展开，在底部）
      ================================================================ -->
      <div class="fb-history-section">
        <div class="hs-header">
          <span class="hs-title">
            📋 答题历史记录
            <span class="hs-count">共 {{ sessionHistory.length }} 次</span>
          </span>
        </div>

        <div class="hs-body">
          <!-- 如果在查看详情 -->
          <div v-if="viewingRecord" class="hd-view">
            <div class="hd-back-row">
              <button class="hd-back" @click="viewingRecord = null">← 返回列表</button>
              <span class="hd-meta">{{ viewingRecord.date }} {{ viewingRecord.time }} · {{ viewingRecord.total }}题 · 正确率 <strong :class="viewingRecord.accuracy >= 80 ? 'c-good' : viewingRecord.accuracy >= 60 ? 'c-mid' : 'c-bad'">{{ viewingRecord.accuracy }}%</strong></span>
            </div>
            <div class="hd-items">
              <div
                v-for="(item, i) in viewingRecord.items"
                :key="i"
                class="hd-item"
                :class="item.isCorrect ? 'hd-ok' : 'hd-err'"
              >
                <div class="hd-item-header">
                  <span class="hd-num">{{ i + 1 }}</span>
                  <span class="hd-cat">{{ categoryName(item.category) }}</span>
                  <span class="hd-badge" :class="item.isCorrect ? 'badge-ok' : 'badge-err'">
                    {{ item.isCorrect ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="hd-q">{{ item.question }}</div>
                <div class="hd-ans-row">
                  <span class="hd-lbl">你的答案：</span>
                  <span :class="item.isCorrect ? 'ans-ok' : 'ans-err'">{{ item.userAnswer || '（未填写）' }}</span>
                </div>
                <div v-if="!item.isCorrect" class="hd-ans-row">
                  <span class="hd-lbl">正确答案：</span>
                  <span class="ans-ok">{{ item.answer }}</span>
                </div>
                <div class="hd-analysis">{{ item.analysis }}</div>
              </div>
            </div>
          </div>

          <!-- 历史列表 -->
          <template v-else>
            <div v-if="sessionHistory.length === 0" class="hs-empty">暂无记录，完成一次练习后会自动保存</div>
            <div v-else class="hs-list">
              <div
                v-for="(rec, i) in sessionHistory"
                :key="i"
                class="hs-row"
                @click="viewingRecord = rec"
              >
                <span class="hsr-rank">#{{ sessionHistory.length - i }}</span>
                <span class="hsr-date">{{ rec.date }} {{ rec.time }}</span>
                <span class="hsr-info">{{ rec.total }}题 · 约{{ rec.duration }}min</span>
                <span
                  class="hsr-acc"
                  :class="rec.accuracy >= 80 ? 'c-good' : rec.accuracy >= 60 ? 'c-mid' : 'c-bad'"
                >{{ rec.accuracy }}%</span>
                <span
                  class="hsr-badge"
                  :class="rec.accuracy >= 80 ? 'badge-great' : rec.accuracy >= 60 ? 'badge-good' : 'badge-poor'"
                >{{ rec.accuracy >= 80 ? '优秀' : rec.accuracy >= 60 ? '良好' : '加油' }}</span>
                <span class="hsr-arrow">›</span>
              </div>
            </div>
          </template>
        </div>
      </div>

    </div><!-- /fb-body -->
  </div><!-- /fb-page -->
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { generateQuestions, FILL_BLANK_QUESTIONS } from '../data/fillBlankQuestions.js'
import { useStudyStore, getTodayString } from '../store/useStudyStore.js'
import { useToast } from '../composables/useToast.js'

const emit = defineEmits(['back'])
const store = useStudyStore()
const { showToast } = useToast()

// ── 存储 Key ──
const WRONG_KEY   = 'gaoxiang_fillblank_wrong'
const HISTORY_KEY = 'gaoxiang_fillblank_history'
const SESSION_KEY = 'gaoxiang_fillblank_sessions'

// ── 分类名映射 ──
const CATEGORY_NAMES = {
  integration:          '整合管理',
  scope:                '范围管理',
  time:                 '时间管理',
  cost:                 '成本管理',
  quality:              '质量管理',
  'human-resource':     '人力资源管理',
  communication:        '沟通管理',
  risk:                 '风险管理',
  procurement:          '采购管理',
  stakeholder:          '干系人管理',
  'project-management': '项目管理基础',
  'performance-domain': '项目绩效域',
}
function categoryName(key) { return CATEGORY_NAMES[key] || key }

// ── 状态 ──
const stage         = ref('setup')
const selectedCount = ref(10)
const customMode    = ref(false)
const customCount   = ref(15)
const maxQ          = FILL_BLANK_QUESTIONS.length

const questions      = ref([])
const currentIndex   = ref(0)
const userAnswers    = ref([])
const submittedFlags = ref([])
const answerInputRef = ref(null)
const nextFocusRef  = ref(null)
let inputEnterLocked = false   // 防止"按键穿透"：跳题后短暂屏蔽 input 的 enter

const wrongList      = ref(loadWrongList())
const historyStats   = ref(loadHistoryStats())
const sessionHistory = ref(loadSessionHistory())

// 是否已经保存过（result阶段）
const savedThisSession = ref(false)

const viewingRecord   = ref(null)

let quizStartTime = null

// ── 工具函数 ──
function loadWrongList()    { try { return JSON.parse(localStorage.getItem(WRONG_KEY)   || '[]')    } catch { return [] } }
function saveWrongList()    { localStorage.setItem(WRONG_KEY,   JSON.stringify(wrongList.value))    }
function loadHistoryStats() {
  try {
    const r = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null')
    return r || { sessions: 0, total: 0, correct: 0, accuracy: 0, bestAccuracy: 0, wrongCount: 0 }
  } catch { return { sessions: 0, total: 0, correct: 0, accuracy: 0, bestAccuracy: 0, wrongCount: 0 } }
}
function saveHistoryStats() { localStorage.setItem(HISTORY_KEY, JSON.stringify(historyStats.value)) }
function loadSessionHistory() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]') } catch { return [] } }
function saveSessionHistory() { localStorage.setItem(SESSION_KEY, JSON.stringify(sessionHistory.value)) }

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── 题目数相关 ──
const finalCount = computed(() => customMode.value ? (customCount.value || 10) : selectedCount.value)

function selectPreset(n) { customMode.value = false; selectedCount.value = n }
function toggleCustom()  { customMode.value = !customMode.value }
function clampCustom()   {
  if (customCount.value < 1) customCount.value = 1
  if (customCount.value > maxQ) customCount.value = maxQ
}

// ── 答题卡样式 ──
function cardBtnClass(i) {
  return {
    cur:     i === currentIndex.value,
    correct: submittedFlags.value[i] && isCorrect(i)  && i !== currentIndex.value,
    wrong:   submittedFlags.value[i] && !isCorrect(i) && i !== currentIndex.value,
    done:    submittedFlags.value[i] && i !== currentIndex.value,
  }
}

// ── 题干分段 ──
const questionParts = computed(() => {
  const text = questions.value[currentIndex.value]?.question || ''
  const splits = text.split('___')
  const parts = []
  splits.forEach((seg, i) => {
    parts.push({ type: 'text', content: seg })
    if (i < splits.length - 1) parts.push({ type: 'blank' })
  })
  return parts
})

const currentQ = computed(() => questions.value[currentIndex.value] || {})
const submittedCount = computed(() => submittedFlags.value.filter(Boolean).length)

// ── 评分 ──
function isCorrect(idx) {
  const q = questions.value[idx]
  const ans = (userAnswers.value[idx] || '').trim()
  if (!ans || !q) return false
  if (ans === q.answer) return true
  if (q.answer.includes(ans) && ans.length >= 2) return true
  if (q.keywords?.some(kw => ans.includes(kw) || kw.includes(ans))) return true
  return false
}

const correctCount    = computed(() => questions.value.filter((_, i) => isCorrect(i)).length)
const accuracyPercent = computed(() => questions.value.length ? Math.round(correctCount.value / questions.value.length * 100) : 0)
const scoreClass      = computed(() => { const p = accuracyPercent.value; return p >= 80 ? 'score-great' : p >= 60 ? 'score-good' : 'score-poor' })
const resultIcon      = computed(() => { const p = accuracyPercent.value; return p >= 90 ? '🏆' : p >= 70 ? '🎯' : p >= 50 ? '📚' : '💪' })

const wrongInSession = computed(() =>
  questions.value.map((q, i) => ({ ...q, userAnswer: userAnswers.value[i], origIndex: i }))
    .filter((_, i) => !isCorrect(i))
)

const categoryStats = computed(() => {
  const map = {}
  questions.value.forEach((q, i) => {
    if (!map[q.category]) map[q.category] = { total: 0, correct: 0 }
    map[q.category].total++
    if (isCorrect(i)) map[q.category].correct++
  })
  return Object.entries(map).map(([key, v]) => ({
    key, name: categoryName(key), total: v.total, correct: v.correct,
    accuracy: v.total > 0 ? Math.round(v.correct / v.total * 100) : 0,
  }))
})

// ── 历史分析：每次练习趋势（按次，不按天聚合，最近10次）──
const dailyTrend = computed(() => {
  return [...sessionHistory.value]
    .reverse()          // 最早的在前
    .slice(-10)
    .map(rec => ({
      date: (rec.date || '').slice(5) + (rec.time ? ' ' + rec.time.slice(0,5) : ''),
      correct: rec.correct, total: rec.total,
      acc: rec.total > 0 ? Math.round(rec.correct / rec.total * 100) : 0,
    }))
})

const dailyTrendLabels = computed(() => dailyTrend.value.map(d => d.date))

// SVG 坐标（viewBox 0 0 300 90，底部留10px给x轴）
const trendPoints = computed(() => {
  const data = dailyTrend.value
  if (data.length < 1) return []
  const n = data.length
  // 只有1个点时居中显示
  return data.map((d, i) => ({
    x: n === 1 ? 150 : (i / (n - 1)) * 270 + 20,
    y: 82 - (d.acc / 100) * 72,
    acc: d.acc,
  }))
})

const trendLinePoints = computed(() =>
  trendPoints.value.map(p => `${p.x},${p.y}`).join(' ')
)

const trendFillPoints = computed(() => {
  const pts = trendPoints.value
  if (!pts.length) return ''
  const line = pts.map(p => `${p.x},${p.y}`).join(' ')
  return `${pts[0].x},82 ${line} ${pts[pts.length-1].x},82`
})

// ── 历史分析：领域强弱 ──
const categoryAnalysis = computed(() => {
  const map = {}
  sessionHistory.value.forEach(rec => {
    rec.items.forEach(item => {
      if (!map[item.category]) map[item.category] = { correct: 0, total: 0 }
      map[item.category].total++
      if (item.isCorrect) map[item.category].correct++
    })
  })
  return Object.entries(map)
    .filter(([, v]) => v.total >= 2)
    .map(([key, v]) => ({
      key, name: categoryName(key), total: v.total, correct: v.correct,
      accuracy: Math.round(v.correct / v.total * 100),
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
})

// ── 操作 ──
function initQuiz(qs) {
  questions.value = qs
  currentIndex.value = 0
  userAnswers.value = new Array(qs.length).fill('')
  submittedFlags.value = new Array(qs.length).fill(false)
  savedThisSession.value = false
  stage.value = 'quiz'
  quizStartTime = Date.now()
  nextTick(() => answerInputRef.value?.focus())
}

function startPractice() { initQuiz(generateQuestions(finalCount.value)) }

function startWrongReview() {
  if (!wrongList.value.length) return
  const ids = new Set(wrongList.value.map(w => w.id))
  let qs = FILL_BLANK_QUESTIONS.filter(q => ids.has(q.id))
  if (!qs.length) qs = wrongList.value.map(w => ({ id: w.id, category: w.category || 'project-management', question: w.question, answer: w.answer, analysis: w.analysis || '', keywords: w.keywords || [] }))
  initQuiz(qs.sort(() => Math.random() - 0.5).slice(0, finalCount.value))
}

function onInputEnter() {
  if (inputEnterLocked) return
  submitCurrent()
}

function submitCurrent() {
  submittedFlags.value[currentIndex.value] = true
  submittedFlags.value = [...submittedFlags.value]
  // 提交后焦点移到「回车→下一题」提示框
  nextTick(() => nextFocusRef.value?.focus())
}

function handleEnterAfterSubmit() {
  if (currentIndex.value < questions.value.length - 1) {
    // 锁住 input enter，防止跳题后 keyup 穿透触发提交
    inputEnterLocked = true
    goNextQuestion()
    setTimeout(() => { inputEnterLocked = false }, 300)
  } else {
    finishQuiz()
  }
}

function goPrev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    nextTick(() => { if (!submittedFlags.value[currentIndex.value]) answerInputRef.value?.focus() })
  }
}
function goNextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    nextTick(() => { if (!submittedFlags.value[currentIndex.value]) answerInputRef.value?.focus() })
  }
}
function jumpToQuestion(i) {
  currentIndex.value = i
  nextTick(() => { if (!submittedFlags.value[i]) answerInputRef.value?.focus() })
}

async function finishQuiz() {
  submittedFlags.value = submittedFlags.value.map(() => true)
  const durationMin = quizStartTime ? Math.round((Date.now() - quizStartTime) / 60000) : Math.round(questions.value.length * 1.5)

  // 更新错题本
  const correctIds = questions.value.filter((_, i) => isCorrect(i)).map(q => q.id)
  wrongList.value = wrongList.value.filter(w => !correctIds.includes(w.id))
  const wrongIds = new Set(wrongList.value.map(w => w.id))
  wrongInSession.value.forEach(item => {
    if (!wrongIds.has(item.id)) wrongList.value.push({ id: item.id, category: item.category, question: item.question, answer: item.answer, analysis: item.analysis, keywords: item.keywords })
  })
  saveWrongList()

  // 更新汇总统计
  const acc = accuracyPercent.value
  historyStats.value.sessions++
  historyStats.value.total   += questions.value.length
  historyStats.value.correct += correctCount.value
  historyStats.value.accuracy = Math.round(historyStats.value.correct / historyStats.value.total * 100)
  historyStats.value.bestAccuracy = Math.max(historyStats.value.bestAccuracy || 0, acc)
  historyStats.value.wrongCount = wrongList.value.length
  saveHistoryStats()

  // 保存本次详细记录
  const today = getTodayString()
  sessionHistory.value.unshift({
    date: today, time: nowTime(), total: questions.value.length,
    correct: correctCount.value, wrongCount: wrongInSession.value.length,
    accuracy: acc, duration: durationMin,
    items: questions.value.map((q, i) => ({
      id: q.id, category: q.category, question: q.question,
      answer: q.answer, analysis: q.analysis, keywords: q.keywords,
      userAnswer: userAnswers.value[i] || '', isCorrect: isCorrect(i),
    })),
  })
  saveSessionHistory()

  // 标记已保存
  savedThisSession.value = true

  // 同步到学习进度
  try {
    let fbKey = store.studyData.chapterList.find(c => c.key === 'fill-blank')?.key
    if (!fbKey) { await store.addChapter('填空题练习'); fbKey = store.studyData.chapterList.find(c => c.name === '填空题练习')?.key }
    if (fbKey) {
      await store.addRecord({ chapter: fbKey, date: today, questionsDone: questions.value.length, correctAnswers: correctCount.value, studyTime: Math.round(durationMin / 60 * 10) / 10 })
      showToast('✅ 本次记录已自动保存！', 'success')
    }
  } catch (e) { console.warn('同步失败', e) }

  stage.value = 'result'
}

function restartPractice() {
  savedThisSession.value = false
  stage.value = 'setup'
}

function handleBack() {
  // 仅在答题中且尚未保存时弹出提示
  if (stage.value === 'quiz' && !savedThisSession.value) {
    if (!window.confirm('确定退出本次练习？进度不会保存。')) return
  }
  stage.value = 'setup'
  emit('back')
}

watch(currentIndex, () => {
  nextTick(() => { if (!submittedFlags.value[currentIndex.value]) answerInputRef.value?.focus() })
})
</script>

<style scoped>
/* ════════════════════════════════════════
   页面框架
════════════════════════════════════════ */
.fb-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

/* ════════════════════════════════════════
   顶部导航
════════════════════════════════════════ */
.fb-topbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.fb-back-btn {
  background: rgba(255,255,255,0.18);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.2s;
}
.fb-back-btn:hover { background: rgba(255,255,255,0.28); }
.fb-topbar-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

/* ════════════════════════════════════════
   主体
════════════════════════════════════════ */
.fb-body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

/* ════════════════════════════════════════
   顶部两栏（配置 + 统计）— 等高
════════════════════════════════════════ */
.fb-top-row {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 14px;
  align-items: stretch;   /* ← 等高关键 */
}

/* 等高辅助类：flex列布局，内容撑开 */
.fb-card-stretch {
  display: flex;
  flex-direction: column;
}
.cfg-spacer { flex: 1; }  /* 把开始按钮推到底部 */

.fb-config-card,
.fb-stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 12px;
}

/* 分布标签 */
.dist-tags { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.dist-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
.dist-tag.m { background: #ede9fe; color: #7c3aed; }
.dist-tag.o { background: #fce7f3; color: #be185d; }

/* 配置行 */
.cfg-row { margin-bottom: 10px; }
.cfg-lbl { display: block; font-size: 0.78rem; color: #888; margin-bottom: 6px; }

/* 题目数按钮 */
.count-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.cnt-btn {
  padding: 6px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  background: #f9fafb;
  color: #555;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.cnt-btn:hover, .cnt-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}
.custom-btn { border-style: dashed; }
.custom-btn.active { border-style: solid; }

/* 自定义输入 */
.custom-row { margin-top: -4px; }
.custom-input-wrap { display: flex; align-items: center; gap: 8px; }
.custom-input {
  width: 80px;
  padding: 5px 8px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 0.88rem;
  text-align: center;
}
.custom-input:focus { outline: none; border-color: #667eea; }
.custom-hint { font-size: 0.75rem; color: #aaa; }

/* 错题入口 */
.wrong-entry {
  padding: 8px 12px;
  background: #fff7ed;
  border: 1.5px solid #fed7aa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.82rem;
  color: #c2410c;
  font-weight: 600;
  transition: all 0.15s;
}
.wrong-entry:hover { background: #ffedd5; }

/* 开始按钮 */
.start-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}
.start-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(102,126,234,0.4); }

/* ════════════════════════════════════════
   统计面板 — 数字 + 最强最弱
════════════════════════════════════════ */
.stat-nums {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.sn-item { background: #f8f9ff; border-radius: 8px; padding: 10px 6px; text-align: center; }
.sn-item.hi   { background: #ede9fe; }
.sn-item.warn { background: #fff7ed; }
.sn-val { display: block; font-size: 1.25rem; font-weight: 800; color: #667eea; }
.sn-item.hi   .sn-val { color: #7c3aed; }
.sn-item.warn .sn-val { color: #ea580c; }
.sn-lbl { font-size: 0.7rem; color: #999; margin-top: 2px; }

/* 最强/最弱 块 */
.stat-best-worst {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.sbw-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
}
.sbw-item.best  { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
.sbw-item.worst { background: #fffbeb; border: 1.5px solid #fde68a; }
.sbw-icon  { font-size: 1.3rem; flex-shrink: 0; }
.sbw-info  { flex: 1; min-width: 0; }
.sbw-label { font-size: 0.68rem; color: #999; margin-bottom: 2px; }
.sbw-name  { font-size: 0.8rem; font-weight: 700; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sbw-pct   { font-size: 1.1rem; font-weight: 800; flex-shrink: 0; }
.best-pct  { color: #059669; }
.worst-pct { color: #d97706; }

.stat-bw-placeholder { font-size: 0.75rem; color: #ccc; text-align: center; padding: 16px 8px; flex: 1; display: flex; align-items: center; justify-content: center; }

/* ════════════════════════════════════════
   答题区 — 等高布局
════════════════════════════════════════ */
.fb-quiz-layout {
  display: grid;
  grid-template-columns: 176px 1fr;
  gap: 14px;
  align-items: stretch;   /* ← 等高关键 */
}

/* 答题卡 */
.fb-answer-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  position: sticky;
  top: 14px;
  display: flex;
  flex-direction: column;
}
.ac-title { font-size: 0.78rem; font-weight: 700; color: #888; margin-bottom: 10px; }
.ac-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}
.ac-btn {
  aspect-ratio: 1;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
  color: #777;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ac-btn.cur     { border-color: #667eea; background: #667eea; color: white; }
.ac-btn.correct { border-color: #10b981; background: #d1fae5; color: #065f46; }
.ac-btn.wrong   { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
.ac-btn.done:not(.correct):not(.wrong) { border-color: #a5b4fc; background: #e0e7ff; color: #4338ca; }

.ac-legend { display: flex; flex-direction: column; gap: 3px; margin-bottom: 10px; font-size: 0.68rem; color: #aaa; }
.ac-legend span { display: flex; align-items: center; gap: 5px; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 2px; border: 1.5px solid #ccc; flex-shrink: 0; }
.dot.unanswered { background: #f9fafb; border-color: #e5e7eb; }
.dot.correct    { background: #d1fae5; border-color: #10b981; }
.dot.wrong      { background: #fee2e2; border-color: #ef4444; }

.ac-prog-text { font-size: 0.72rem; color: #aaa; text-align: center; margin-bottom: 4px; }
.ac-prog-bar { height: 4px; background: #eee; border-radius: 2px; overflow: hidden; margin-bottom: 10px; }
.ac-prog-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px; transition: width 0.4s; }

.ac-finish-btn {
  width: 100%;
  padding: 8px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  color: #bbb;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: not-allowed;
  transition: all 0.2s;
  margin-top: auto;
}
.ac-finish-btn.on {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
}
.ac-finish-btn.on:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(102,126,234,0.4); }

/* 题目面板 */
.fb-q-panel {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}
.qp-header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.qp-num  { font-size: 0.82rem; font-weight: 700; color: #667eea; }
.qp-cat  { background: #ede9fe; color: #7c3aed; font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 12px; }
.qp-navs { margin-left: auto; display: flex; gap: 6px; }
.qp-nav  {
  padding: 4px 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #555;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.12s;
}
.qp-nav:hover:not(:disabled) { border-color: #667eea; color: #667eea; }
.qp-nav:disabled { opacity: 0.35; cursor: not-allowed; }

.qp-text { font-size: 0.95rem; line-height: 1.9; color: #222; font-weight: 500; margin-bottom: 14px; flex: 1; }
.qp-blank { display: inline; }
.qp-blank-line { display: inline-block; width: 90px; border-bottom: 2px solid #667eea; margin: 0 3px; vertical-align: bottom; height: 1.3em; }
.qp-user-ans { display: inline-block; padding: 1px 8px; border-radius: 5px; font-weight: 700; margin: 0 3px; }
.qp-user-ans.ans-ok  { background: #d1fae5; color: #065f46; border: 1px solid #34d399; }
.qp-user-ans.ans-err { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; text-decoration: line-through; }

.qp-input-row { display: flex; gap: 8px; }
.qp-input {
  flex: 1;
  padding: 9px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.qp-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 2px rgba(102,126,234,0.12); }
.qp-submit {
  padding: 9px 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.qp-submit:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(102,126,234,0.4); }

.qp-analysis {
  background: #f8f9ff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.qa-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; }
.qa-lbl { font-weight: 700; font-size: 0.8rem; white-space: nowrap; }
.qa-lbl.ok { color: #059669; }
.qa-val { color: #333; font-size: 0.85rem; line-height: 1.5; }
.qa-val.gray { color: #666; }
.qa-judge { align-self: flex-start; padding: 3px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; }
.j-ok  { background: #d1fae5; color: #065f46; }
.j-err { background: #fee2e2; color: #991b1b; }

/* 回车提示 */
.qp-enter-hint {
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #6366f1;
  background: #eef2ff;
  border: 1.5px dashed #a5b4fc;
  text-align: center;
  cursor: pointer;
  outline: none;
  transition: background 0.15s, border-color 0.15s;
  user-select: none;
}
.qp-enter-hint:focus {
  background: #e0e7ff;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}
.qp-enter-hint:hover {
  background: #e0e7ff;
}

/* ════════════════════════════════════════
   结果区
════════════════════════════════════════ */
.fb-result-layout {
  display: grid;
  grid-template-columns: 220px 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 14px;
  align-items: stretch;
}

/* 第一行：得分卡(col1) | 各领域(col2~3 合并) */
.res-score-card {
  grid-column: 1;
  grid-row: 1;
  background: white;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.res-cat-card {
  grid-column: 2 / 4;
  grid-row: 1;
}

/* 第二行：错题(col1~2) | 全题回顾(col2~3) 各半 */
.res-wrong-card {
  grid-column: 1 / 3;
  grid-row: 2;
}
.res-all-card {
  grid-column: 3 / 4;
  grid-row: 2;
}
.res-icon   { font-size: 2.5rem; }
.res-score  { display: flex; align-items: baseline; gap: 3px; }
.rs-c       { font-size: 2.2rem; font-weight: 800; }
.rs-sep     { font-size: 1.2rem; color: #ccc; }
.rs-t       { font-size: 1.5rem; color: #ccc; font-weight: 600; }
.res-acc    { font-size: 0.95rem; font-weight: 700; }
.score-great { color: #059669; }
.score-good  { color: #d97706; }
.score-poor  { color: #dc2626; }
.res-btns { display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 6px; }
.res-btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.res-btn.again { background: #f0f4ff; color: #667eea; border: 1.5px solid #c5d0f5; }
.res-btn.back  { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.res-btn:hover { opacity: 0.88; transform: translateY(-1px); }

.res-cat-card,
.res-wrong-card,
.res-all-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  max-height: 380px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.rw-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: #059669;
  font-weight: 600;
  padding: 20px 0;
}

.res-cat-row { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
.rcs-name { width: 72px; font-size: 0.72rem; color: #666; text-align: right; flex-shrink: 0; }
.rcs-bar-track { flex: 1; height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
.rcs-bar { height: 100%; border-radius: 3px; transition: width 0.5s; }
.rcs-bar.good { background: #34d399; }
.rcs-bar.mid  { background: #fbbf24; }
.rcs-bar.bad  { background: #f87171; }
.rcs-pct { width: 32px; font-size: 0.72rem; color: #888; text-align: right; flex-shrink: 0; }

.rw-item { border-bottom: 1px solid #fecaca; padding: 8px 0; }
.rw-item:last-child { border-bottom: none; }
.rw-meta    { font-size: 0.68rem; color: #bbb; margin-bottom: 2px; }
.rw-q       { font-size: 0.82rem; color: #333; margin-bottom: 4px; }
.rw-row     { font-size: 0.78rem; color: #888; margin-bottom: 2px; }
.rw-yours   { color: #dc2626; font-weight: 600; }
.rw-correct { color: #059669; font-weight: 600; }
.rw-analysis{ font-size: 0.72rem; color: #bbb; margin-top: 3px; }

.ra-item { padding: 8px; border-radius: 7px; margin-bottom: 6px; border-left: 3px solid transparent; }
.ra-item.ra-ok  { background: #f0fdf4; border-left-color: #34d399; }
.ra-item.ra-err { background: #fef2f2; border-left-color: #f87171; }
.ra-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.ra-num    { font-size: 0.7rem; color: #bbb; width: 18px; }
.ra-cat    { font-size: 0.68rem; color: #888; background: #f3f4f6; padding: 1px 6px; border-radius: 8px; }
.ra-badge  { margin-left: auto; font-size: 0.7rem; font-weight: 700; padding: 1px 8px; border-radius: 8px; }
.badge-ok  { background: #d1fae5; color: #065f46; }
.badge-err { background: #fee2e2; color: #991b1b; }
.ra-q    { font-size: 0.82rem; color: #333; line-height: 1.5; margin-bottom: 4px; }
.ra-ans  { font-size: 0.78rem; display: flex; flex-wrap: wrap; gap: 4px 10px; }
.ra-lbl  { color: #aaa; }
.ans-ok  { color: #059669; font-weight: 600; }
.ans-err { color: #dc2626; font-weight: 600; text-decoration: line-through; }

/* ════════════════════════════════════════
   历史统计看板（历史记录上方双栏）
════════════════════════════════════════ */
.fb-history-stats {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 14px;
  align-items: stretch;
}

.hs-cat-panel,
.hs-trend-panel {
  background: white;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.hsp-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 12px;
}

/* 领域强弱横条 */
.ca-bars { display: flex; flex-direction: column; gap: 7px; flex: 1; }
.ca-bar-row { display: flex; align-items: center; gap: 7px; }
.ca-bar-name { width: 72px; font-size: 0.72rem; color: #666; text-align: right; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ca-bar-track { flex: 1; height: 7px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
.ca-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.ca-bar-fill.good { background: linear-gradient(90deg, #34d399, #10b981); }
.ca-bar-fill.mid  { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.ca-bar-fill.bad  { background: linear-gradient(90deg, #f87171, #ef4444); }
.ca-bar-pct { width: 32px; font-size: 0.72rem; text-align: right; font-weight: 600; flex-shrink: 0; }
.ca-bar-cnt { width: 48px; font-size: 0.68rem; color: #bbb; flex-shrink: 0; }
.c-good { color: #059669; }
.c-mid  { color: #d97706; }
.c-bad  { color: #dc2626; }

/* 折线图 */
.trend-wrap { flex: 1; display: flex; flex-direction: column; }
.trend-svg { width: 100%; flex: 1; min-height: 110px; display: block; }
.trend-xaxis { display: flex; justify-content: space-between; margin-top: 4px; padding: 0 16px; }
.trend-xlabel { font-size: 0.65rem; color: #bbb; }

.hsp-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  color: #ccc;
  gap: 6px;
  text-align: center;
  padding: 20px 0;
}
.hsp-empty-icon { font-size: 1.8rem; }

/* ════════════════════════════════════════
   历史记录（直接展开，无折叠）
════════════════════════════════════════ */
.fb-history-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  overflow: hidden;
}

.hs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.hs-title { font-size: 0.85rem; font-weight: 700; color: #444; display: flex; align-items: center; gap: 8px; }
.hs-count { font-size: 0.72rem; color: #aaa; font-weight: 400; }

.hs-body { /* 无折叠，直接显示 */ }

.hs-empty {
  padding: 20px;
  text-align: center;
  font-size: 0.82rem;
  color: #ccc;
}

.hs-list { display: flex; flex-direction: column; }
.hs-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.12s;
  font-size: 0.82rem;
}
.hs-row:last-child { border-bottom: none; }
.hs-row:hover { background: #f8f9ff; }
.hsr-rank { font-size: 0.75rem; font-weight: 700; color: #ddd; width: 28px; text-align: center; flex-shrink: 0; }
.hsr-date { color: #555; flex-shrink: 0; }
.hsr-info { color: #aaa; flex: 1; }
.hsr-acc  { font-size: 0.95rem; font-weight: 800; flex-shrink: 0; }
.hsr-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}
.badge-great { background: #d1fae5; color: #065f46; }
.badge-good  { background: #fef3c7; color: #92400e; }
.badge-poor  { background: #fee2e2; color: #991b1b; }
.hsr-arrow { color: #ddd; font-size: 1.1rem; }

/* 历史详情 */
.hd-view { padding: 14px 16px; }
.hd-back-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.hd-back {
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #555;
  font-size: 0.78rem;
  cursor: pointer;
}
.hd-back:hover { border-color: #667eea; color: #667eea; }
.hd-meta { font-size: 0.78rem; color: #aaa; }

.hd-items { display: flex; flex-direction: column; gap: 10px; }
.hd-item { padding: 10px 12px; border-radius: 8px; border-left: 3px solid transparent; }
.hd-item.hd-ok  { background: #f0fdf4; border-left-color: #34d399; }
.hd-item.hd-err { background: #fef2f2; border-left-color: #f87171; }
.hd-item-header { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.hd-num  { font-size: 0.7rem; color: #bbb; width: 18px; }
.hd-cat  { font-size: 0.68rem; color: #888; background: #f3f4f6; padding: 1px 6px; border-radius: 8px; }
.hd-badge { margin-left: auto; font-size: 0.7rem; font-weight: 700; padding: 1px 8px; border-radius: 8px; }
.hd-q    { font-size: 0.82rem; color: #333; line-height: 1.5; margin-bottom: 5px; }
.hd-ans-row { display: flex; gap: 6px; font-size: 0.78rem; margin-bottom: 3px; }
.hd-lbl  { color: #aaa; white-space: nowrap; }
.hd-analysis { font-size: 0.72rem; color: #aaa; line-height: 1.4; margin-top: 4px; padding-top: 4px; border-top: 1px solid #f0f0f0; }
</style>
