<script setup lang="ts">
const showPostModal = ref(false);
const {logout, showLogoutModal} = useLogout()
</script>

<template>
  <div class="grid md:grid-cols-[35%_65%] xl:grid-cols-[20%_50%_30%]">

    <!-- Sidebar -->
    <div class="hidden md:block sticky top-0 h-screen">
      <LayoutSidebar />
    </div>

    <!-- Main Content -->
    <main>
      <slot />

      <!-- Bottom Navbar (Mobile Only) -->
    <div
      class="bg-[#04A51E] w-[90%] rounded-3xl fixed bottom-4 left-1/2 -translate-x-1/2 block md:hidden z-30 shadow-lg">
      <div class="flex items-center justify-between px-6 py-2">
        <NuxtLink to="/">
          <img class="w-7" src="/img/home.png" alt="Home">
        </NuxtLink>

        <NuxtLink to="/search">
          <img class="w-7" src="/img/user-search.png" alt="Search">
        </NuxtLink>

        <!-- Button Add (Modal) -->
        <div class="cursor-pointer" @click="showPostModal = true">
          <UiBaseIcon name="mdi:add-circle" size="40" class="text-white" />
        </div>

        <NuxtLink to="/follows">
          <img class="w-7" src="/img/heart.png" alt="Follows">
        </NuxtLink>

        <div class="cursor-pointer" @click="showLogoutModal = true">
          <img class="w-7" src="/img/logout.png" alt="Logout">
        </div>
      </div>
    </div>

    <ThreadModalAddThread v-model="showPostModal" />

     <UiConfirmModal
v-model="showLogoutModal" title="Logout?" description="You will be signed out from your account."
      confirm-text="Logout" confirm-color="bg-red-600 hover:bg-red-700" @confirm="logout" />
    
    </main>

    <!-- Rightbar -->
    <div class="hidden xl:block sticky top-0 h-screen">
      <LayoutRightbar />
    </div>

  </div>
</template>

<style scoped></style>
