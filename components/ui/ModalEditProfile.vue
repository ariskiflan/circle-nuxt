<script setup lang="ts">
import { getProfile, updateProfile } from "~/services/profile"
// import type { IEditProfile } from "~/types/app"

// interface Props {
//     isOpen: boolean
//     user: IEditProfile
// }

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

// const props = defineProps<Props>()
const emit = defineEmits(["close"])

const { refresh: refreshProfile } =  useLazyAsyncData(
    "profile", getProfile
)

const formData = ref({
    fullname: "",
    username: "",
    bio: "",
    avatar: null as File | null,
    cover: null as File | null,
})

const previewAvatar = ref<string | null>(null)
const previewBackground = ref<string | null>(null)
const isLoading = ref(false)

watch(
    () => props.isOpen,
    (newVal) => {
        if (newVal) {
            formData.value = {
                fullname: props.user?.user?.fullname || "",
                username: props.user?.user?.username || "",
                bio: props.user?.bio || "",
                avatar: null,
                cover: null,
            }

            previewAvatar.value = props.user?.avatar || null
            previewBackground.value = props.user?.cover || null
        }
    }
)

const handleAvatarChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    formData.value.avatar = file
    previewAvatar.value = URL.createObjectURL(file)
}

const handleBackgroundChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    formData.value.cover = file
    previewBackground.value = URL.createObjectURL(file)
}

const handleClose = () => {
    emit("close")
}

const handleSave = async () => {
    isLoading.value = true
    try {
        await updateProfile(formData.value)

        refreshProfile()
        emit("close")
    } catch (error) {
        console.error("Error saving profile:", error)
    } finally {
        isLoading.value = false
    }
}
</script>


<template>
    <!-- Modal Overlay -->
    <Transition name="modal">
        <div
            v-if="isOpen" 
            class="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-999 p-4"
            @click.self="handleClose">
            <!-- Modal Content -->
            <div class="modal-content bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div
                    class="sticky top-0 bg-[#1a1a1a] border-b border-gray-700 px-5 py-4 flex items-center justify-between z-999">
                    <h2 class="text-xl md:text-2xl font-semibold text-white">
                        Edit Profile
                    </h2>
                    <Icon
                        icon="mdi:close" 
                        width="30" 
                        height="30" 
                        class="cursor-pointer text-white hover:text-gray-300"
                        @click="handleClose" />
                </div>


                <!-- Form -->
                <div class="p-5 flex flex-col gap-5">
                    <!-- Background & Avatar Upload Section -->
                    <div class="relative mb-10">
                        <!-- Background Image -->
                        <div
                            class="relative w-full h-[70px] md:h-[100px] rounded-2xl overflow-hidden bg-green-500 group cursor-pointer">
                            <img
v-if="previewBackground" :src="previewBackground" alt="Background preview"
                                class="w-full h-full object-cover">
                            <div
                                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="flex flex-col items-center gap-1">
                                    <Icon icon="mdi:camera" width="40" height="40" class="text-white" />
                                    <p class="text-sm text-white font-semibold">Change Cover</p>
                                </div>
                            </div>
                            <input
type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer"
                                @change="handleBackgroundChange">
                        </div>

                        <!-- Avatar Image -->
                        <div
                            class="w-15 h-15 md:w-20 md:h-20 rounded-full bg-gray-400 border-4 border-[#1a1a1a] absolute bottom-[-30px] md:bottom-[-40px] left-[30px] overflow-hidden group cursor-pointer">
                            <img
v-if="previewAvatar" :src="previewAvatar" alt="Profile preview"
                                class="w-full h-full object-cover">
                            <img
v-else src="/img/profile-circle.png" alt="Default profile"
                                class="w-full h-full object-cover">
                            <div
                                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon icon="mdi:camera" width="30" height="30" class="text-white" />
                            </div>
                            <input
type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer"
                                @change="handleAvatarChange">
                        </div>
                    </div>

                    <!-- Fullname Input -->
                    <div class="flex flex-col gap-2">
                        <label class="text-white font-semibold text-sm md:text-md">
                            Full Name
                        </label>
                        <input
v-model="formData.fullname" type="text" placeholder="Enter your full name"
                            class="bg-[#3f3f3f] text-white px-4 py-2 md:py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                    </div>

                    <!-- Username Input -->
                    <div class="flex flex-col gap-2">
                        <label class="text-white font-semibold text-sm md:text-md">
                            Username
                        </label>
                        <input
v-model="formData.username" type="text" placeholder="Enter your username"
                            class="bg-[#3f3f3f] text-white px-4 py-2 md:py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                    </div>

                    <!-- Bio Input -->
                    <div class="flex flex-col gap-2">
                        <label class="text-white font-semibold text-sm md:text-md">
                            Bio
                        </label>
                        <textarea
v-model="formData.bio" placeholder="Tell us about yourself" rows="4"
                            class="bg-[#3f3f3f] text-white px-4 py-2 md:py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 mt-3">
                        <button
                            class="flex-1 border-2 border-gray-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            :disabled="isLoading" @click="handleClose">
                            Cancel
                        </button>
                        <button
                            class="flex-1 bg-green-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="isLoading" @click="handleSave">
                            {{ isLoading ? "Saving..." : "Save Changes" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.9);
}
</style>
