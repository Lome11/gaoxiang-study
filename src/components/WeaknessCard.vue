<template>
  <section class="card weakness-section">
    <h2>⚠️ 需要加强的章节</h2>
    <ul class="weakness-list">
      <li v-if="weaknesses.length === 0" class="all-good">
        🎉 所有章节正确率都达到60%以上，继续保持！
      </li>
      <li v-for="item in weaknesses" :key="item.key" class="weakness-item">
        <span>{{ item.name }}</span>
        <div>
          <span class="weakness-score">{{ item.accuracy }}%</span>
          <span class="weakness-total">（{{ item.total }}题）</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  weaknesses: Array,
})
</script>

<style scoped>
.weakness-section {
  background: #fff8e1;
  border: 1px solid #ffe082;
}

.weakness-list {
  list-style: none;
  margin-top: 16px;
}

.all-good {
  color: #4CAF50;
  padding: 10px;
  text-align: center;
}

.weakness-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  font-size: 0.95rem;
}

.weakness-score {
  color: #f44336;
  font-weight: bold;
  font-size: 1rem;
}

.weakness-total {
  margin-left: 8px;
  color: #999;
  font-size: 0.85rem;
}
</style>
