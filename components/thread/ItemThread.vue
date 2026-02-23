<script setup>
import { getProfile } from "~/services/profile";
import { deleteThread } from "~/services/thread";

const props = defineProps({
  thread: {
    type: Object,
    required: true,
  },
});

// Emit untuk memberitahu Home.vue agar melakukan refresh data setelah hapus
// const emit = defineEmits(['refresh']);

// State UI
const showDeleteModal = ref(false);
const showImageModal = ref(false);
const selectedImage = ref(null);


const { data: user } = await useAsyncData(
  "profile", getProfile
)

// const refreshThread = () => {
//   emit('refresh');
// };

const handleDeletethread = async () => {

  try {
    await deleteThread(props.thread.id);
    showDeleteModal.value = false;

    useToastify("Thread berhasil dihapus", {
      autoClose: 1000,
      position: ToastifyOption.POSITION.TOP_CENTER,
    });

    refreshThread()

  } catch (error) {
    console.error("Gagal menghapus thread:", error);
  }
};

const handleRedirectProfile = () => {
  // Cek apakah thread milik user yang sedang login atau bukan
  if (!user.value) return "/auth/login";
  return user.value.id !== props.thread?.author.id
    ? `/profile/${props.thread?.author.id}`
    : "/profile";
};

const openPreview = (src) => {
  selectedImage.value = src;
  showImageModal.value = true;
};
</script>

<template>
  <div>
    <div class="border-b-2 border-gray-500 hover:bg-white/5 transition-colors">
      <div class="p-5">
        <div class="flex gap-3 md:gap-5 relative">

          <!-- Avatar dengan NuxtLink -->
          <NuxtLink v-if="props.thread?.author" :to="handleRedirectProfile()">
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-700">
              <img
class="object-cover w-full h-full" :src="thread?.author?.profile?.avatar || '/img/profile-circle.png'"
                alt="avatar">
            </div>
          </NuxtLink>

          <div class="flex flex-col gap-3 w-full">
            <div class="flex gap-3 items-center flex-wrap">
              <p class="font-semibold text-md md:text-xl text-white">
                {{ thread?.author?.fullname }}
              </p>
                 <div class="w-2 h-2 rounded-full bg-gray-400" />
              <p class="text-gray-400 text-sm md:text-md">
                @{{ thread?.author?.username }}
              </p>
              <div class="w-2 h-2 rounded-full bg-gray-400" />
              <p class="text-gray-400 text-xs md:text-sm">
                <!-- Menggunakan Plugin global $timeAgo yang kita buat tadi -->
                {{ $timeAgo(thread?.posted_at) }}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <p class="text-md font-normal text-gray-200 whitespace-pre-wrap">
                {{ thread?.content }}
              </p>

              <!-- Grid Gambar -->
              <div v-if="thread?.image?.length" class="grid grid-cols-2 gap-2">
                <div v-for="(item, index) in thread?.image" :key="index">
                  <img
:src="item.image" alt="content"
                    class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    @click="openPreview(item.image)">
                </div>

                <UiImagePreviewModal v-model="showImageModal" :image="selectedImage" />
              </div>
            </div>

            <div class="flex gap-5 items-center mt-2">
              <div class="flex gap-2 items-center">
                <ThreadLikeThread v-if="thread?.id" :thread-id="Number(thread.id)" />
                <span class="text-sm md:text-md text-gray-400 font-medium">
                  {{ thread?._count?.like || 0 }} Likes
                </span>
              </div>

              <div class="flex gap-2 items-center">
                <NuxtLink :to="`/thread/${thread.id}`" class="flex gap-2 items-center hover:opacity-70">
                  <img src="/img/reply.png" class="w-5 md:w-6" alt="Reply">
                  <span class="text-sm md:text-md text-gray-400 font-medium">
                    {{ thread?._count?.replies || 0 }} Replies
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div
v-if="user?.id === thread?.author.id"
            class="absolute top-0 right-0 cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
            @click="showDeleteModal = true">
            <UiBaseIcon name="material-symbols:delete-outline" size="24" />
          </div>

          <UiConfirmModal
v-model="showDeleteModal" title="Delete thread?" description="This action cannot be undone."
            confirm-text="Delete" confirm-color="bg-red-600 hover:bg-red-700" @confirm="handleDeletethread" />
        </div>
      </div>
    </div>
  </div>
</template>
