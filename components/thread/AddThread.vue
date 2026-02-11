<script setup>
// Nuxt auto-imports: ref, computed, useRoute, useCookie
import { createThread } from "~/services/thread";

const props = defineProps({
  threadId: {
    type: Number,
    default: null,
  },
});

// Emit untuk refresh data di parent
const emit = defineEmits(['success']);

const postThreads = ref({
  content: "",
  image: null,
  threadId: null,
});
const preview = ref([]);
const inputRef = ref(null);

const route = useRoute();

// Ambil data user dari cookie (pengganti Vuex)
const userCookie = useCookie('user');
const user = computed(() => userCookie.value ? JSON.parse(userCookie.value) : null);

const handlePostThreads = async (e) => {
  e.preventDefault();
  try {
    if (props.threadId) {
      postThreads.value.threadId = props.threadId;
    }

    if (postThreads.value.content || postThreads.value.image) {
      await createThread(postThreads.value);
      
      // Beri tahu parent untuk refresh data
      emit('success');
      
      // Reset form
      postThreads.value = { content: "", image: null, threadId: null };
      preview.value = [];
      if (inputRef.value) inputRef.value.value = ""; 
    }
  } catch (error) {
    console.error("Failed to post thread:", error);
  }
};

const handleImageChange = (e) => {
  const files = e.target.files;
  if (!files || !files.length) return;

  const fileList = Array.from(files);
  // Bersihkan memory dari URL lama jika ada
  preview.value.forEach(url => URL.revokeObjectURL(url));
  
  preview.value = fileList.map((file) => URL.createObjectURL(file));
  postThreads.value.image = files; // Simpan FileList
};

const handleImage = () => {
  inputRef.value?.click();
};
</script>

<template>
  <div class="border-b-2 border-gray-500 sm:p-5 p-5 w-full flex flex-col gap-4">
    <div class="flex items-center gap-3 md:gap-5 w-full">
      
      <!-- User Avatar -->
      <div class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-700">
        <img 
          class="object-cover w-full h-full" 
          :src="user?.avatar || '/img/profile-circle.png'" 
          alt="avatar" 
        >
      </div>
    
      <div class="flex-1 flex items-center gap-3">
        <input 
          v-model="postThreads.content" 
          type="text"
          class="flex-1 sm:text-xl text-sm text-white bg-transparent pr-4 py-2 outline-none" 
          :placeholder="route.path === '/' ? `What's on your mind?` : 'Type Your Reply'" 
        >
  
        <button type="button" class="flex-shrink-0" @click="handleImage">
          <input 
            ref="inputRef" 
            multiple 
            name="image" 
            type="file" 
            class="hidden" 
            accept="image/*"
            @change="handleImageChange" 
          >
          <!-- Gunakan path public atau Nuxt Icon -->
          <img src="/img/gallery-add.png" alt="add image" class="w-6 sm:w-8 cursor-pointer" >
        </button>
  
        <button 
          type="submit" 
          class="bg-[#04A51E] text-white px-3 py-1 sm:px-6 sm:py-2 rounded-3xl text-sm font-medium hover:bg-white hover:text-[#04A51E] transition-all duration-200 cursor-pointer shadow-md"
          @click="handlePostThreads"
        >
          Post
        </button>
      </div>
    </div>
  
    <!-- Image Preview -->
    <div v-if="preview.length" class="grid grid-cols-2 gap-2 mt-2">
      <div v-for="(item, index) in preview" :key="index" class="relative rounded-xl overflow-hidden aspect-video">
        <img class="w-full h-full object-cover" :src="item" alt="preview" >
      </div>
    </div>
  </div>
</template>
