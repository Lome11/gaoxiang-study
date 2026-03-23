<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
        >
          <span class="toast-icon">{{ iconMap[toast.type] || '💬' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts } = useToast()

const iconMap = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  background: white;
  padding: 14px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  pointer-events: auto;
  font-size: 0.95rem;
}

.toast.success { border-left: 4px solid #4caf50; }
.toast.error   { border-left: 4px solid #f44336; }
.toast.info    { border-left: 4px solid #2196f3; }
.toast.warning { border-left: 4px solid #ff9800; }

.toast-icon { font-size: 1.1rem; flex-shrink: 0; }
.toast-message { color: #333; flex-grow: 1; }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
