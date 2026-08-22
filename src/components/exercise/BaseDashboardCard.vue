<template>
  <section class="panel">
    <slot name="search"></slot>
    <slot name="list"></slot>
  </section>
</template>

<style scoped>
.panel {
  background: var(--bg-panel);
  border: none;
  box-shadow: 0 1px 2px rgba(27, 43, 34, 0.06);
  border-radius: 16px;
  padding: 24px;
}
</style>