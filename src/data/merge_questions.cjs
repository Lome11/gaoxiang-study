/**
 * 将 test.json 合并到 questionList.json，按题目内容去重
 * 去重规则：题干（question）完全相同的视为重复，保留 test.json 的版本（解析更详细）
 * 新章节（第09~18章）直接追加到 questionList.json
 */
const fs = require('fs');
const path = require('path');

const oldFile = path.join(__dirname, 'questionList.json');
const newFile = path.join(__dirname, 'test.json');
const outFile = path.join(__dirname, 'questionList.json');

const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf-8'));
const newData = JSON.parse(fs.readFileSync(newFile, 'utf-8'));

// 标准化题干：去除多余空格、全角半角统一，用于比较
function normalize(str) {
  return str
    .replace(/\s+/g, '')
    .replace(/（\s*）/g, '（）')
    .replace(/\(\s*\)/g, '（）')
    .toLowerCase();
}

// 以章节名（去除前缀数字格式差异）为 key 做章节映射
// 如 "第1章 信息化发展" 和 "第01章 信息化发展" 视为同一章
function normalizeChapterName(name) {
  return name.replace(/第0*(\d+)章/, '第$1章').trim();
}

// 构建 old 的章节 Map：标准化章节名 -> chapter 对象
const oldChapterMap = new Map();
for (const ch of oldData.chapters) {
  oldChapterMap.set(normalizeChapterName(ch.chapter_name), ch);
}

let addedCount = 0;
let updatedCount = 0;
let newChapterCount = 0;

for (const newCh of newData.chapters) {
  const normName = normalizeChapterName(newCh.chapter_name);
  
  if (oldChapterMap.has(normName)) {
    // 已有章节：逐题去重合并
    const oldCh = oldChapterMap.get(normName);
    
    // 构建 old 题目的 question -> 索引 Map
    const oldQMap = new Map();
    for (let i = 0; i < oldCh.questions.length; i++) {
      oldQMap.set(normalize(oldCh.questions[i].question), i);
    }
    
    for (const newQ of newCh.questions) {
      const normQ = normalize(newQ.question);
      if (oldQMap.has(normQ)) {
        // 重复题目：用 test.json 的版本替换（解析更详细）
        const idx = oldQMap.get(normQ);
        oldCh.questions[idx] = newQ;
        updatedCount++;
      } else {
        // 新题目：追加
        oldCh.questions.push(newQ);
        addedCount++;
      }
    }
    // 更新章节名为 test.json 中的格式（规范化为两位数字格式）
    oldCh.chapter_name = newCh.chapter_name;
  } else {
    // 全新章节：直接追加
    oldData.chapters.push(newCh);
    newChapterCount++;
    addedCount += newCh.questions.length;
    console.log(`  新增章节: ${newCh.chapter_name}（${newCh.questions.length} 题）`);
  }
}

// 按章节名中的数字排序
oldData.chapters.sort((a, b) => {
  const na = parseInt(a.chapter_name.match(/\d+/)?.[0] || '99');
  const nb = parseInt(b.chapter_name.match(/\d+/)?.[0] || '99');
  return na - nb;
});

fs.writeFileSync(outFile, JSON.stringify(oldData, null, 4), 'utf-8');

const total = oldData.chapters.reduce((s, c) => s + c.questions.length, 0);
console.log('\n=== 合并完成 ===');
console.log(`章节数: ${oldData.chapters.length}（新增 ${newChapterCount} 章）`);
console.log(`总题数: ${total}`);
console.log(`更新（替换）: ${updatedCount} 题`);
console.log(`新增: ${addedCount} 题`);
