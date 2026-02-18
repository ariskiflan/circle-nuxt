<script setup>

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};
</script>


<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/80" @click="close"/>
    
                <!-- Modal Image -->
                <Transition name="scale">
                    <div
v-if="modelValue" class="relative z-10 max-w-[90vw] max-h-[90vh]
                           flex items-center justify-center">
                        <img
v-if="image" :src="image" alt="preview" class="max-w-full max-h-[90vh]
                             object-contain rounded-xl" >
    
                        <!-- Close button -->
                        <button
class="absolute top-3 right-3 text-white
          w-10 h-10 rounded-full flex items-center justify-center bg-black/50" @click="close">
                            ✕
                        </button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.scale-enter-from {
    transform: scale(0.95);
    opacity: 0;
}

.scale-leave-to {
    transform: scale(0.95);
    opacity: 0;
}
</style>