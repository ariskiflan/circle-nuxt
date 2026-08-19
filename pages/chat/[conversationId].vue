<script setup>
import { markAsRead } from '~/services/chat';

useSeoMeta({
  title: 'Percakapan',
  description: 'Chat conversation',
})

const route = useRoute();
const router = useRouter();
const conversationId = computed(() => Number(route.params.conversationId));

const inputMessage = ref("");
const messageListRef = ref(null);

const {
  currentUserId,
  activeConversationId,
  conversations,
  messages,
  loading,
  isConnected,
  error,
  connect,
  disconnect,
  openConversation,
  leaveConversation,
  sendMessage,
  startTyping,
  otherUser,
  isTyping,
} = useChat()

const conversation = computed(() =>
  conversations.value.find((c) => c.id === activeConversationId.value)
)

const other = computed(() => otherUser(conversation.value))

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const redirectProfile = () => {
  if (!other.value?.id) return
  return `/profile/${other.value.id}`
}

onMounted(async () => {
  connect()
  await openConversation(conversationId.value)
  markAsRead(conversationId.value)
  scrollToBottom()
})

onBeforeUnmount(() => {
  leaveConversation(conversationId.value)
  disconnect()
})

watch(() => messages.value.length, scrollToBottom)

const handleSend = async () => {
  const content = inputMessage.value.trim()
  if (!content) return

  inputMessage.value = ""
  await sendMessage(conversationId.value, content)
  scrollToBottom()
}

const handleTyping = () => {
  startTyping(conversationId.value)
}

const isMine = (message) => message.senderId === currentUserId.value

const messageTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const otherIsTyping = computed(() => {
  const other = otherUser(conversation.value)
  return other && isTyping(conversationId.value, other.id)
})
</script>

<template>
  <div class="flex flex-col h-screen md:h-[calc(100vh-0px)]">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-600">
      <UiBaseIcon
        name="mdi:arrow-back"
        size="30"
        class="cursor-pointer md:hidden"
        @click="router.push('/chat')"
      />

      <NuxtLink :to="redirectProfile()">
        <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
          <img
            class="object-cover w-full h-full"
            :src="otherUser(conversation)?.profile?.avatar || '/img/profile-circle.png'"
            alt="avatar"
          >
        </div>
      </NuxtLink>
      <div class="flex flex-col">
        <p class="text-md md:text-lg font-semibold">
          {{ otherUser(conversation)?.fullname }}
        </p>
        <span class="text-sm text-gray-400">
          @{{ otherUser(conversation)?.username }}
        </span>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full"
          :class="isConnected ? 'bg-[#04A51E]' : 'bg-red-500'"
        />
        <span class="text-xs text-gray-400 hidden sm:block">
          {{ isConnected ? 'Online' : 'Offline' }}
        </span>
      </div>
    </div>

    <!-- Daftar Pesan -->
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3"
    >
      <div v-if="loading" class="text-center text-gray-400 py-10">
        Loading...
      </div>

      <div v-else-if="error" class="text-center text-red-400 py-10">
        {{ error }}
      </div>

      <template v-else>
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="isMine(message) ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[75%] px-4 py-2 rounded-2xl flex flex-col gap-1"
            :class="isMine(message)
              ? 'bg-[#04A51E] text-white rounded-br-sm'
              : 'bg-[#3f3f3f] text-white rounded-bl-sm'"
          >
            <p class="text-sm md:text-md whitespace-pre-wrap break-words">
              {{ message.content }}
            </p>
            <span
              class="text-[11px] self-end"
              :class="isMine(message) ? 'text-white/70' : 'text-gray-400'"
            >
              {{ messageTime(message.createdAt) }}
              <template v-if="isMine(message)">
                <UiBaseIcon
                  v-if="message.isRead"
                  name="mdi:check-all"
                  size="14"
                />
                <UiBaseIcon
                  v-else
                  name="mdi:check"
                  size="14"
                />
              </template>
            </span>
          </div>
        </div>

        <div v-if="otherIsTyping" class="flex justify-start">
          <div class="bg-[#3f3f3f] text-gray-300 text-sm px-4 py-2 rounded-2xl rounded-bl-sm">
            mengetik...
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div class="px-4 py-4 border-t border-gray-600">
      <div class="flex items-center gap-3">
        <input
          v-model="inputMessage"
          type="text"
          class="flex-1 bg-[#3f3f3f] p-3 rounded-2xl text-white placeholder:text-gray-400 text-sm md:text-md focus:outline-none focus:ring-1 focus:ring-[#04A51E]"
          placeholder="Tulis pesan..."
          @input="handleTyping"
          @keyup.enter="handleSend"
        >
        <button
          class="bg-[#04A51E] p-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          :disabled="!inputMessage.trim()"
          @click="handleSend"
        >
          <UiBaseIcon name="mdi:send" size="22" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
