<script setup>
import { getProfile } from '~/services/profile';

const isEditModalOpen = ref(false);

const { data: user } = useLazyAsyncData(
  "profile", getProfile
)

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

</script>

<template>
  <div>
    <div class="bg-[#262626] p-5 rounded-2xl flex flex-col gap-4">
      <p class="text-xl md:text-2xl font-semibold">My Profile</p>

      <div class="relative">
        <div class="w-full h-[65px] md:h-[80px] rounded-2xl overflow-hidden">
          <img v-if="user?.cover" :src="user?.cover" alt="Cover" class="w-full h-full object-cover">
          <div v-else class="w-full h-full bg-green-500" />
        </div>
        <div
          class="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-400 border-4 border-black absolute bottom-[-30px] md:bottom-[-40px] left-[30px] overflow-hidden">
          <img :src="user?.avatar || '/img/profile-circle.png'" alt="" class="object-cover w-full h-full">
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class="flex border-2 border-white py-1 px-3 md:py-2 md:px-4 rounded-2xl text-white font-semibold text-sm lg:text-md"
          @click="openEditModal">
          Edit Profile
        </button>
      </div>

      <div class="flex flex-col gap-2 ">
        <div class="flex items-center gap-2">
          <p class="text-md md:text-xl font-semibold">{{ user?.user?.fullname }}</p>
          <div class="w-2 h-2 rounded-full bg-gray-400" />
          <span class="text-gray-400 font-semibold text-md">
            @{{ user?.user?.username }}
          </span>
        </div>


        <p class="text-sm md:text-md font-normal">{{ user?.bio }}</p>

        <div class="flex items-center gap-5">
          <p class="text-sm md:text-md font-semibold" @click="handleFollows">
            {{ user?.user?.follower?.length }}
            <span class="text-gray-400 font-normal">Followers</span>
          </p>
          <p class="text-sm md:text-md font-semibold" @click="handleFollows">
            {{ user?.user?.following?.length }}
            <span class="text-gray-400 font-normal">Followings</span>
          </p>
        </div>
      </div>
    </div>

    <div class="z-100">
    <UiModalEditProfile :is-open="isEditModalOpen" :user="user" @close="closeEditModal"/>
    </div>
  </div>
</template>