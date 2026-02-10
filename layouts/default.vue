<script setup lang="ts">

</script>

<template>
  <div class="grid md:grid-cols-[35%_65%] xl:grid-cols-[20%_50%_30%]">

    <!-- Sidebar -->
    <div class="hidden md:block sticky top-0 h-screen">
      <p>ini sidebar</p>
    </div>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Rightbar -->
    <div class="hidden xl:block sticky top-0 h-screen">
      <p>ini rightbar</p>
    </div>

  </div>
</template>

<style scoped></style>
