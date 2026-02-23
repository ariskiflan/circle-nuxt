<script setup>
import { getProfile } from '~/services/profile';
import { getThreadByToken } from '~/services/thread';

const router = useRouter();

const activeTab = ref("all");
const isEditModalOpen = ref(false);
const showImageModal = ref(false);
const selectedImage = ref(null);


const {data: user} = await useAsyncData(
    "profile", getProfile
)

const {data: threadsByUserToken} = await  useAsyncData(
    `threadsByUserToken`, getThreadByToken
)

const handleFollows = () => {
  router.push("/follows");
};

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const openPreview = (src) => {
  selectedImage.value = src;
  showImageModal.value = true;
};

</script>

<template>
  <div>
    <div class="sticky top-0 bg-[#1d1d1d] z-10">
      <div class="px-5 py-10 flex flex-col gap-3 md:gap-5">
        <div class="flex items-center gap-3">
          <UiBaseIcon name="mdi:arrow-back" size="40" class="cursor-pointer" @click="router.push('/')"/>
  
          <p class="text-md md:text-2xl font-semibold">{{ user?.user?.fullname }}</p>
        </div>
  
        <div class="relative">
          <div class="w-full h-[70px] md:h-[100px] rounded-2xl overflow-hidden">
            <img v-if="user?.cover" :src="user?.cover" alt="Cover" class="w-full h-full object-cover" >
            <div v-else class="w-full h-full bg-green-500"/>
          </div>
          <div
            class="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-400 border-4 border-black absolute bottom-[-30px] md:bottom-[-40px] left-[30px] overflow-hidden">
            <img :src="user?.avatar || '/img/profile-circle.png'" alt="" class="object-cover w-full h-full" >
          </div>
        </div>
  
        <div class="flex justify-end mt-5 md:mt-6">
          <button
class="flex border-2 border-white py-1 px-3 md:py-2 md:px-4 rounded-2xl text-white font-semibold text-md md:text-xl hover:bg-white hover:text-black transition-colors"
            @click="openEditModal">
            Edit Profile
          </button>
        </div>
  
        <div class="flex flex-col gap-2">
          <p class="text-xl md:text-2xl font-semibold">{{ user?.user?.fullname }}</p>
          <span class="text-gray-400 font-semibold text-md">
            @{{ user?.user?.username }}
          </span>
          <p class="text-sm md:text-md font-normal">{{ user?.bio }}</p>
          <div class="flex items-center gap-5">
            <p class="text-sm md:text-md font-semibold cursor-pointer hover:underline" @click="handleFollows">
              {{ user?.user?.following?.length || 0 }}
              <span class="text-gray-400 font-normal text-sm md:text-md">Following</span>
            </p>
  
            <p class="text-sm md:text-md font-semibold cursor-pointer hover:underline" @click="handleFollows">
              {{ user?.user?.follower?.length || 0 }}
              <span class="text-gray-400 font-normal text-sm md:text-md">Followers</span>
            </p>
          </div>
        </div>
      </div>
  
      <div class="grid grid-cols-2 justify-center items-center">
        <p
:class="[
              'relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2',
              activeTab === 'all'
                ? 'border-gray-500 font-bold text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[80%] after:h-1 after:bg-green-500 after:rounded-lg'
                : 'border-gray-500 font-normal',
            ]" @click="activeTab = 'all'">
          All Post
        </p>
        <p
:class="[
              'relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2',
              activeTab === 'media'
                ? 'border-gray-500 font-bold text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[80%] after:h-1 after:bg-green-500 after:rounded-lg'
                : 'border-gray-500 font-normal',
            ]" @click="activeTab = 'media'">
          Media
        </p>
      </div>
    </div>
  
    <div class="mb-20">
      <template v-if="activeTab === 'all'">
        <div v-for="item in threadsByUserToken" :key="item.id">
          <ThreadItemThread :thread="item" />
        </div>
      </template>
  
      <template v-else>
        <div class="grid grid-cols-2 gap-2 p-5">
          <template v-for="thread in threadsByUserToken" :key="thread.id">
            <img
v-for="img in thread.image || []" :key="img.id" :src="img.image" alt="media"
              class="w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              @click="openPreview(img.image)" >
          </template>
        </div>
      </template>
    </div>
  
    <!-- Edit Profile Modal -->
    <UiModalEditProfile :is-open="isEditModalOpen" :user="user" @close="closeEditModal"/>
  
    <!-- Image Preview Modal -->
    <UiImagePreviewModal v-model="showImageModal" :image="selectedImage" />
  </div>
</template>