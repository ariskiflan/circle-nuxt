<script setup>
/**
 * DI NUXT 3:
 * 1. Gunakan defineModel untuk sinkronisasi v-model yang lebih simpel (Vue 3.4+)
 * 2. Teleport ke "body" tetap aman digunakan di Nuxt.
 */

const props = defineProps({
  title: {
    type: String,
    default: "Are you sure?",
  },
  description: {
    type: String,
    default: "",
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  confirmColor: {
    type: String,
    default: "bg-red-600 hover:bg-red-700",
  },
});

// Menggantikan logic manual update:modelValue
const isVisible = defineModel({ type: Boolean, default: false });

const emit = defineEmits(["confirm"]);

const close = () => {
  isVisible.value = false;
};

const confirm = () => {
  emit("confirm");
  close();
};
</script>

<template>
  <!-- Teleport memastikan modal muncul di level paling atas DOM -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[999] flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="close"
        />

        <!-- Modal Content -->
        <Transition name="scale">
          <div
            v-if="isVisible"
            class="relative bg-[#1e1e1e] w-full max-w-sm rounded-2xl p-6 z-10 shadow-2xl border border-white/10"
          >
            <h3 class="text-white font-semibold text-xl mb-2">
              {{ title }}
            </h3>

            <p v-if="description" class="text-gray-400 text-sm mb-6">
              {{ description }}
            </p>

            <div class="flex justify-end gap-3">
              <button
                class="px-5 py-2 rounded-full text-sm text-white/70 hover:bg-white/10 transition-colors"
                @click="close"
              >
                {{ cancelText }}
              </button>

              <button
                :class="[
                  'px-6 py-2 rounded-full text-sm font-medium text-white transition-all active:scale-95',
                  confirmColor,
                ]"
                @click="confirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transisi tetap sama, sudah optimal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
