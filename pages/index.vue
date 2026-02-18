<script setup>
import { getThreads } from '~/services/thread';
import { getProfile } from "~/services/profile";
// State untuk UI
const showSidebar = ref(false);
const showPostModal = ref(false);
const showLogoutModal = ref(false);

const { data: user } =  useLazyAsyncData(
  "profile", getProfile
)

const { data: threads, refresh: refreshThread } =
   useLazyAsyncData('threads', getThreads)

const refreshThreads = async () => {
  await refreshThread(); // Fungsi bawaan useAsyncData untuk ambil data ulang
};

// Fungsi Navigasi & Logout
const openSidebar = () => showSidebar.value = true;
const closeSidebar = () => showSidebar.value = false;

const handleLogout = () => {
  try {
    // 1. Hapus Cookie (Ganti logic Vuex Anda ke Cookie Nuxt 3)
    const token = useCookie('token');
    const user = useCookie('user');

    token.value = null;
    user.value = null;

    // 2. Tutup Modal & Redirect
    showLogoutModal.value = false;

    // Gunakan navigateTo untuk best practice di Nuxt
    return navigateTo("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>

 
  <div class="w-full mb-20">
    <!-- Header Sticky -->
    <div class="sticky top-0 pt-10 z-10 bg-[#1d1d1d]">
      <div class="flex justify-between items-center mb-10 px-5">
        <h2 class="text-white md:text-5xl text-4xl font-bold">Home</h2>

        <!-- Avatar Trigger Sidebar (Mobile) -->
        <div class="xl:hidden cursor-pointer" @click="openSidebar">
          <div class="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-600">
            <img class="object-cover w-full h-full" :src="user.avatar || '/img/profile-circle.png'" alt="avatar">
          </div>
        </div>
        <!-- Overlay Sidebar -->
        <div v-if="showSidebar" class="fixed inset-0 bg-black/50 z-40 xl:hidden" @click="closeSidebar" />

        <!-- Sidebar Drawer -->
        <transition name="slide">
          <div v-if="showSidebar" class="fixed top-0 right-0 h-screen w-80 md:w-96 bg-black z-50 xl:hidden shadow-xl">
            <!-- Nuxt otomatis mendeteksi komponen di folder components/ -->
            <LayoutRightbar @close="closeSidebar" />
          </div>
        </transition>
      </div>

      <!-- Komponen Tambah Thread -->
      <ThreadAddThread @success="refreshThreads" />
    </div>

    <!-- List Threads -->
    <div class="mt-5">
      <div v-for="item in threads" :key="item.id">
        <ThreadItemThread :thread="item" @refresh="refreshThreads" />
      </div>
    </div>

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

    <!-- Modals -->
    <ThreadModalAddThread v-model="showPostModal" />

    <UiConfirmModal
v-model="showLogoutModal" title="Logout?" description="You will be signed out from your account."
      confirm-text="Logout" confirm-color="bg-red-600 hover:bg-red-700" @confirm="handleLogout" />
  </div>
</template>

<style scoped>
.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-active {
  transition: transform 0.3s ease;
}

.slide-leave-to {
  transform: translateX(100%);
}

.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
