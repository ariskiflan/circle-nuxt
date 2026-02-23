<script setup>
import { getCurrentLike, createLike } from "~/services/like";

const props = defineProps({
    threadId: {
        type: Number,
        required: true,
    },
});

// const emit = defineEmits(['refresh']);

const {refreshThread} = useThreads()


// 1. Ambil data secara asinkron dengan useAsyncData
// Kita gunakan key unik `like-{id}` agar Nuxt bisa membedakan cache antar thread
// Gunakan template literal agar key berbeda untuk tiap thread
const { data: likeRes, refresh: refreshLikeStatus } =  useLazyAsyncData(
    `like-${props.threadId}`,
    () => getCurrentLike(props.threadId)
);

// Sekarang isLiked akan reaktif
const isLiked = computed(() => !!likeRes.value?.isLiked);

const handleLike = async () => {
    try {
        await createLike(props.threadId);

        // 3. Refresh status like lokal
        await refreshLikeStatus();
        refreshThread()

        // 4. Beritahu parent (Home/ThreadDetail) untuk update jumlah like total
        // emit('refresh');
    } catch (err) {
        console.error("Gagal toggle like:", err);
    }
};
</script>

<template>
    <div class="cursor-pointer inline-flex items-center gap-1" @click.stop="handleLike">
        <UiBaseIcon :name="isLiked ? 'flat-color-icons:like' : 'solar:heart-linear'" size="24" />
    </div>
</template>