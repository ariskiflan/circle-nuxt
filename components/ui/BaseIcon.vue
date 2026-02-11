<script setup lang="ts">
import { Icon } from "@iconify/vue"

defineProps<{
  name: string
  size?: string | number
}>()
</script>

<template>
  <Icon :icon="name" :width="size || 20" :height="size || 20" />
</template>
