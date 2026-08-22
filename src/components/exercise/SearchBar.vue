<script setup>
defineProps({
    query: { type: String, required:true}
})
const emit = defineEmits(['update-query', 'search-submit'])
</script>

<template>
  <div class="search-box">
    <label class="panel-label">🔍 도시 검색</label>
    <input
      type="text"
      class="search-input"
      :value="query"
      @input="emit('update-query', $event.target.value)"
      @keyup.enter="emit('search-submit')"
      placeholder="검색할 도시 이름 입력"
    />
    <p class="hint-text">검색 중인 도시: {{ query || '전체' }}</p>
  </div>
</template>

<style scoped>
.panel-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-body);
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.hint-text {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
