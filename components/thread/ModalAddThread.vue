<script setup>
import { createThread } from "~/services/thread";

const props = defineProps({
  threadId: {
    type: Number,
    default: null,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// Emit untuk refresh data di parent
const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
  emit("update:modelValue", false);
};

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
const user = computed(() => userCookie.value || null);

const handlePostThreads = async (e) => {
  e.preventDefault();
  try {
    if (props.threadId) {
      postThreads.value.threadId = props.threadId;
    }

    if (postThreads.value.content || postThreads.value.image) {
      await createThread(postThreads.value);
      useToastify("Add Thread Success", {
            autoClose: 1000,
            position: ToastifyOption.POSITION.TOP_CENTER,
        });
      
      // Reset form
      postThreads.value = { content: "", image: null, threadId: null };
      preview.value = [];
      closeModal();
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
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/60" @click="closeModal"/>
    
                <!-- Modal -->
                <div
class="relative bg-[#1e1e1e] w-full sm:max-w-xl
                     p-4 sm:p-6 z-10 animate-slide-up">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-white font-semibold text-lg">
                            {{ route.path === "/" ? "Create Post" : "Reply" }}
                        </h2>
    
                        <div class="xl:hidden" @click="closeModal">
                            <UiBaseIcon icon="mdi:close" size="24"/>
                        </div>
                    </div>
    
                    <!-- Content -->
                    <div class="flex gap-4">
                        <div class="hidden sm:block w-10 h-10 rounded-full overflow-hidden">
                            <img :src="user?.avatar || '/img/profile-circle.png'" alt="avatar" >
                        </div>
    
                        <div class="flex-1 flex flex-col gap-4">
                            <input
v-model="postThreads.content" type="text"
                                class="w-full text-white bg-transparent text-base outline-none" :placeholder="
                      route.path === '/' ? `What's on your mind?` : 'Type your reply'
                    " >
    
                            <!-- Preview -->
                            <div v-if="preview.length" class="grid grid-cols-2 gap-2">
                                <img v-for="(item, index) in preview" :key="index" :src="item" class="w-full rounded-lg" >
                            </div>
    
                            <!-- Actions -->
                            <div class="flex justify-between items-center">
                                <button type="button" @click="handleImage">
                                    <input ref="inputRef" multiple type="file" class="hidden" @change="handleImageChange" >
                                    <img src="/img/gallery-add.png" class="w-7 cursor-pointer" >
                                </button>
    
                                <button
class="bg-[#04A51E] px-5 py-2 rounded-full text-sm font-medium
                             hover:bg-transparent transition
                             hover:[box-shadow:inset_0_0_0_2px_white]" @click="handlePostThreads">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

@keyframes slide-up {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slide-up 0.25s ease-out;
}
</style>