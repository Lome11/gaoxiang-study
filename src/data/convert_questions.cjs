/**
 * 将 questionList.json 转换为 fillBlankQuestions.js
 * 自动生成 id、category、keywords
 */
const fs = require('fs');
const path = require('path');

const json = JSON.parse(fs.readFileSync(path.join(__dirname, 'questionList.json'), 'utf-8'));

// 章节名 → category key 映射
const CHAPTER_MAP = {
  '第1章': 'ch1_info',
  '第2章': 'ch2_tech',
  '第3章': 'ch3_governance',
  '第4章': 'ch4_management',
  '第5章': 'ch5_engineering',
  '第6章': 'ch6_pm_intro',
  '第7章': 'ch7_initiation',
  '第8章': 'ch8_integration',
};

function getCategory(chapterName) {
  for (const [prefix, key] of Object.entries(CHAPTER_MAP)) {
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

const lines = [];
lines.push(`/**`);
lines.push(` * 软考高项备考填空题题库`);
lines.push(` * 自动从 questionList.json 转换生成`);
lines.push(` * 共 ${json.chapters.reduce((s, c) => s + c.questions.length, 0)} 题，${json.chapters.length} 章`);
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

for (const chapter of json.chapters) {
  const category = getCategory(chapter.chapter_name);
  const idPrefix = getIdPrefix(chapter.chapter_name);
  lines.push(`  // ============================================================`);
  lines.push(`  // 【${chapter.chapter_name}】`);
  lines.push(`  // ============================================================`);
  
  chapter.questions.forEach((q, idx) => {
    const id = `${idPrefix}-${String(idx + 1).padStart(3, '0')}`;
    const keywords = extractKeywords(q.answer);
    const questionEscaped = q.question.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    const answerEscaped = q.answer.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    const analysisEscaped = (q.analysis || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    
    lines.push(`  {`);
    lines.push(`    id: '${id}',`);
    lines.push(`    category: '${category}',`);
    lines.push(`    question: '${questionEscaped.replace(/'/g, "\\'")}',`);
    lines.push(`    answer: '${answerEscaped.replace(/'/g, "\\'")}',`);
    lines.push(`    analysis: '${analysisEscaped.replace(/'/g, "\\'")}',`);
    lines.push(`    keywords: ${JSON.stringify(keywords)},`);
    lines.push(`  },`);
  });
}

lines.push(`];`);

fs.writeFileSync(path.join(__dirname, 'fillBlankQuestions.js'), lines.join('\n'), 'utf-8');
console.log('转换完成！');
