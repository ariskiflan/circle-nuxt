<script setup>
import { getUserNotId } from '~/services/user';
import { createConversation } from '~/services/chat';

useSeoMeta({
  title: 'Chat',
  description: 'Chat with your friends on Circle App',
})

const router = useRouter();
const showNewChat = ref(false);

const { data: users } = useLazyAsyncData(
  'not-me-users', getUserNotId
)

const {
  conversations,
  loading,
  connect,
  disconnect,
  loadConversations,
  otherUser,
} = useChat()


onMounted(() => {
  connect()
  loadConversations()
})

onBeforeUnmount(() => {
  disconnect()
})

const lastMessage = (conversation) => {
  const msg = conversation?.messages?.[0]
  return msg ? msg.content : 'Belum ada pesan'
}

const lastMessageTime = (conversation) => {
  const msg = conversation?.messages?.[0]
  if (!msg) return ''
  return msg.createdAt
}

const startChat = async (userId) => {
  try {
    const conversation = await createConversation(userId)
    showNewChat.value = false
    router.push(`/chat/${conversation.id}`)
  } catch {
    useToastify("Gagal memulai chat", {
      autoClose: 1500,
      position: ToastifyOption.POSITION.TOP_CENTER,
      type: ToastifyOption.TYPE.ERROR,
    })
  }
}
</script>

<template>
  <div class="px-5 py-10 flex flex-col gap-5">
    <!-- Header -->
    <div class="flex items-center gap-3 justify-between">
      <div class="flex items-center gap-3">
        <UiBaseIcon
          name="mdi:arrow-back"
          size="40"
          class="cursor-pointer md:hidden"
          @click="router.push('/')"
        />
        <h2 class="text-white md:text-4xl text-3xl font-bold">Chat</h2>
      </div>

      <div
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="showNewChat = true"
      >
        <UiBaseIcon name="mdi:message-plus" size="32" class="text-[#04A51E]" />
      </div>
    </div>

    <!-- Daftar Percakapan -->
    <div class="flex flex-col gap-2">
      <div v-if="loading" class="text-center text-gray-400 py-10">
        Loading...
      </div>

      <template v-else-if="conversations.length > 0">
        <NuxtLink
  v-for="conversation in conversations"
  :key="conversation.id"
  :to="`/chat/${conversation.id}`"
  class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
>
  <div class="w-12 h-12 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
    <img
      class="object-cover w-full h-full"
      :src="otherUser(conversation)?.profile?.avatar || '/img/profile-circle.png'"
      alt="avatar"
    >
  </div>

  <div class="flex flex-col gap-1 w-full min-w-0">
    <div class="flex items-center justify-between gap-2">
      <p class="text-md md:text-lg font-semibold truncate">
        {{ otherUser(conversation)?.fullname }}
      </p>
      <span class="text-xs text-gray-400 flex-shrink-0">
        {{ $timeAgo(lastMessageTime(conversation)) }}
      </span>
    </div>
    <p class="text-sm text-gray-400 truncate">
      @{{ otherUser(conversation)?.username }}
    </p>
    <p class="text-sm text-gray-300 truncate">
      {{ lastMessage(conversation) }}
    </p>
  </div>
</NuxtLink>
        
      </template>

      <div v-else class="text-center text-gray-400 py-10">
        Belum ada percakapan. Mulai chat dengan temanmu!
      </div>
    </div>

    <!-- Modal New Chat -->
    <div
      v-if="showNewChat"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/60" @click="showNewChat = false" />

      <div class="relative bg-[#262626] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div class="p-5 border-b border-gray-600 flex items-center justify-between">
          <p class="text-xl font-bold text-white">Pilih Teman</p>
          <UiBaseIcon
            name="mdi:close"
            size="28"
            class="cursor-pointer text-gray-400 hover:text-white"
            @click="showNewChat = false"
          />
        </div>

        <div class="p-5 overflow-y-auto flex flex-col gap-4">
          <div
            v-for="item in users || []"
            :key="item.id"
            class="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
            @click="startChat(item.id)"
          >
            <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
              <img
                class="object-cover w-full h-full"
                :src="item.profile?.avatar || '/img/profile-circle.png'"
                alt="avatar"
              >
            </div>
            <div>
              <p class="text-md font-semibold">{{ item.fullname }}</p>
              <span class="text-sm text-gray-400">@{{ item.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
