<script setup>
// import { getThreads } from '~/services/thread';
import { getProfile } from "~/services/profile";

const showSidebar = ref(false);

const { data: user } = await useAsyncData(
  "profile", getProfile
)

const {threads} = useThreads()

// const { data: threads, refresh: refreshThread } =
//   await useAsyncData('threads', getThreads)

// const refreshThreads = async () => {
//   await refreshThread(); // Fungsi bawaan useAsyncData untuk ambil data ulang
// };

const openSidebar = () => showSidebar.value = true;
const closeSidebar = () => showSidebar.value = false;

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
            <img class="object-cover w-full h-full" :src="user?.avatar || '/img/profile-circle.png'" alt="avatar">
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
      <ThreadAddThread />
    </div>

    <!-- List Threads -->
    <div class="mt-5">
      <div v-for="item in threads" :key="item.id">
        <ThreadItemThread :thread="item" />
      </div>
    </div>

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
