/**
 * 将 questionList.json + itto.json 合并转换为 fillBlankQuestions.js
 * 自动生成 id、category、keywords
 */
const fs = require('fs');
const path = require('path');

const json     = JSON.parse(fs.readFileSync(path.join(__dirname, 'questionList.json'), 'utf-8'));
const ittoJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'itto.json'), 'utf-8'));

// 章节名 → category key 映射（支持 第N章 和 第0N章 两种格式）
const CHAPTER_MAP = {
  '第1章': 'ch01_info',
  '第01章': 'ch01_info',
  '第2章': 'ch02_tech',
  '第02章': 'ch02_tech',
  '第3章': 'ch03_governance',
  '第03章': 'ch03_governance',
  '第4章': 'ch04_management',
  '第04章': 'ch04_management',
  '第5章': 'ch05_engineering',
  '第05章': 'ch05_engineering',
  '第6章': 'ch06_pm_intro',
  '第06章': 'ch06_pm_intro',
  '第7章': 'ch07_initiation',
  '第07章': 'ch07_initiation',
  '第8章': 'ch08_integration',
  '第08章': 'ch08_integration',
  '第9章': 'ch09_scope',
  '第09章': 'ch09_scope',
  '第10章': 'ch10_schedule',
  '第11章': 'ch11_cost',
  '第12章': 'ch12_quality',
  '第13章': 'ch13_resource',
  '第14章': 'ch14_communication',
  '第15章': 'ch15_risk',
  '第16章': 'ch16_procurement',
  '第17章': 'ch17_stakeholder',
  '第18章': 'ch18_performance',
  '第19章': 'ch19_config',
  '第20章': 'ch20_advanced',
  '第21章': 'ch21_science',
  '第22章': 'ch22_governance',
  '第23章': 'ch23_management',
};

// ITTO 章节名 → category key 映射
const ITTO_CHAPTER_MAP = {
  '项目整合管理': 'ch08_integration',
  '项目范围管理': 'ch09_scope',
  '项目进度管理': 'ch10_schedule',
  '项目成本管理': 'ch11_cost',
  '项目质量管理': 'ch12_quality',
  '项目资源管理': 'ch13_resource',
  '项目沟通管理': 'ch14_communication',
  '项目风险管理': 'ch15_risk',
  '项目采购管理': 'ch16_procurement',
  '项目干系人管理': 'ch17_stakeholder',
};

function getCategory(chapterName) {
  for (const [prefix, key] of Object.entries(CHAPTER_MAP)) {
    if (chapterName.startsWith(prefix)) return key;
  }
  return 'other';
}

function getIttoCategory(chapterName) {
  for (const [prefix, key] of Object.entries(ITTO_CHAPTER_MAP)) {
    if (chapterName.startsWith(prefix)) return key;
  }
  return 'other';
}

function getIdPrefix(chapterName) {
  const match = chapterName.match(/第(\d+)章/);
  return match ? `c${match[1].padStart(2,'0')}` : 'q';
}

/**
 * 从答案自动提取关键词
 * 规则：
 * - 答案本身（如果 <= 6 字）
 * - 用顿号/逗号/括号分割后的各词（>=2字）
 * - 括号内内容
 */
function extractKeywords(answer) {
  const kws = new Set();
  // 原答案
  const clean = answer.replace(/[（(）)【】\[\]]/g, ' ').trim();
  
  // 用分隔符拆分
  const parts = clean.split(/[、，,\s\/]+/).filter(p => p.length >= 2);
  parts.forEach(p => kws.add(p.trim()));
  
  // 括号内内容
  const bracketMatches = answer.match(/[（(]([^）)]+)[）)]/g);
  if (bracketMatches) {
    bracketMatches.forEach(m => {
      const inner = m.replace(/[（(）)]/g, '').trim();
      if (inner.length >= 2) kws.add(inner);
    });
  }
  
  // 答案本身（<=10字 保留）
  if (answer.length <= 10) kws.add(answer);
  
  return [...kws].filter(k => k.length >= 2).slice(0, 5);
}

const totalMain = json.chapters.reduce((s, c) => s + c.questions.length, 0);
const totalItto = ittoJson.chapters.reduce((s, c) => s + c.questions.length, 0);
const total = totalMain + totalItto;

const lines = [];
lines.push(`/**`);
lines.push(` * 软考高项备考填空题题库`);
lines.push(` * 自动从 questionList.json + itto.json 合并转换生成`);
lines.push(` * 共 ${total} 题（主题库 ${totalMain} 题 + ITTO专项 ${totalItto} 题），${json.chapters.length + ittoJson.chapters.length} 章`);
lines.push(` *`);
lines.push(` * 每道题结构：`);
lines.push(` *   id       - 唯一编号`);
lines.push(` *   category - 所属章节`);
lines.push(` *   question - 题干（含"（）"填空位）`);
lines.push(` *   answer   - 标准答案`);
lines.push(` *   analysis - 解析说明`);
lines.push(` *   keywords - 关键词（用于模糊匹配评分）`);
lines.push(` */`);
lines.push(``);
lines.push(`export const FILL_BLANK_QUESTIONS = [`);

// ── 主题库（questionList.json）──
for (const chapter of json.chapters) {
  const category = getCategory(chapter.chapter_name);
  const idPrefix = getIdPrefix(chapter.chapter_name);
  lines.push(`  // ============================================================`);
  lines.push(`  // 【${chapter.chapter_name}】`);
  lines.push(`  // ============================================================`);
  
  chapter.questions.forEach((q, idx) => {
    const id = `${idPrefix}-${String(idx + 1).padStart(3, '0')}`;
    const keywords = extractKeywords(q.answer || '');
    const questionJson = JSON.stringify(q.question || '');
    const answerJson   = JSON.stringify(q.answer || '');
    const analysisJson = JSON.stringify(q.analysis || '');
    
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(id)},`);
    lines.push(`    category: ${JSON.stringify(category)},`);
    lines.push(`    question: ${questionJson},`);
    lines.push(`    answer: ${answerJson},`);
    lines.push(`    analysis: ${analysisJson},`);
    lines.push(`    keywords: ${JSON.stringify(keywords)},`);
    lines.push(`  },`);
  });
}

// ── ITTO 专项题库（itto.json）──
lines.push(`  // ============================================================`);
lines.push(`  // 【ITTO 专项填空题】`);
lines.push(`  // ============================================================`);
for (const chapter of ittoJson.chapters) {
  const category = getIttoCategory(chapter.chapter_name);
  // id 前缀：itto_ + 管理领域缩写
  const ittoIdPrefix = 'itto_' + (ITTO_CHAPTER_MAP[Object.keys(ITTO_CHAPTER_MAP).find(k => chapter.chapter_name.startsWith(k))] || 'other');

  lines.push(`  // 【${chapter.chapter_name}】`);

  chapter.questions.forEach((q, idx) => {
    const id = `${ittoIdPrefix}-${String(idx + 1).padStart(3, '0')}`;
    const keywords = extractKeywords(q.answer || '');
    const questionJson = JSON.stringify(q.question || '');
    const answerJson   = JSON.stringify(q.answer || '');
    const analysisJson = JSON.stringify(q.analysis || '');
    
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(id)},`);
    lines.push(`    category: ${JSON.stringify(category)},`);
    lines.push(`    question: ${questionJson},`);
    lines.push(`    answer: ${answerJson},`);
    lines.push(`    analysis: ${analysisJson},`);
    lines.push(`    keywords: ${JSON.stringify(keywords)},`);
    lines.push(`  },`);
  });
}

lines.push(`];`);
lines.push(``);
lines.push(`/**`);
lines.push(` * 按 category 分组`);
lines.push(` */`);
lines.push(`export const QUESTIONS_BY_CATEGORY = FILL_BLANK_QUESTIONS.reduce((acc, q) => {`);
lines.push(`  if (!acc[q.category]) acc[q.category] = []`);
lines.push(`  acc[q.category].push(q)`);
lines.push(`  return acc`);
lines.push(`}, {})`);
lines.push(``);
lines.push(`/**`);
lines.push(` * 随机出题函数`);
lines.push(` * @param {number} count - 题目数量`);
lines.push(` * @returns {Array} 随机题目数组`);
lines.push(` */`);
lines.push(`export function generateQuestions(count) {`);
lines.push(`  function pickRandom(pool, n) {`);
lines.push(`    const shuffled = [...pool].sort(() => Math.random() - 0.5)`);
lines.push(`    return shuffled.slice(0, Math.min(n, shuffled.length))`);
lines.push(`  }`);
lines.push(`  return pickRandom(FILL_BLANK_QUESTIONS, count)`);
lines.push(`}`);


fs.writeFileSync(path.join(__dirname, 'fillBlankQuestions.js'), lines.join('\n'), 'utf-8');
console.log(`转换完成！共 ${total} 题（主题库 ${totalMain} 题 + ITTO专项 ${totalItto} 题），${json.chapters.length + ittoJson.chapters.length} 章`);

