<script setup>
import { getThreadById, getReplies } from '~/services/thread';

const router = useRouter();
const route = useRoute();
const id = route.params.id

const { data: threadDetail, refresh: refreshThread } =
     useLazyAsyncData(`thread-${id}`, () => getThreadById(Number(id)));

const { data: replies, refresh: refreshReplies } =
     useLazyAsyncData(`replies-${id}`, () => getReplies(Number(id)));

const emitRefreshThread = () => {
    refreshThread()
    refreshReplies()
}

</script>

<template>
    <div>
        <div class="px-5 pt-10 pb-5 md:pb-0 md-pt-0 md:py-10">
            <div class="flex gap-3 items-center">
                <UiBaseIcon name="mdi:arrow-back" size="40" class="cursor-pointer" @click="router.push('/')" />
                <p class="text-xl md:text-3xl font-semibold">Status</p>
            </div>
        </div>

        <div class="border-b-2 border-gray-500">
            <div class="p-5">
                <div class="flex gap-5">
                    <img src="/img/profile-circle.png" alt="avatar" class="w-10 h-10 rounded-full object-cover">

                    <div class="flex flex-col gap-3">
                        <div class="flex gap-3 items-center">
                            <p class="font-bold text-md md:text-xl">
                                {{ threadDetail?.author?.fullname }}
                            </p>
                            <p class="text-gray-400 text-md font-semibold">
                                {{ threadDetail?.author?.username }}
                            </p>
                            <div class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-gray-400" />
                            <p class="text-gray-400 text-xs md:text-md font-semibold">
                                {{
                                    threadDetail?.posted_at && $timeAgo(threadDetail.posted_at)
                                }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-3">
                            <p class="text-md font-normal line-clamp-5">
                                {{ threadDetail?.content }}
                            </p>

                            <div class="grid grid-cols-2 gap-2">
                                <div v-for="(item, index) in threadDetail?.image || []" :key="index">
                                    <img :src="item.image" alt="">
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-5 items-center">
                            <div class="flex gap-2 items-center">
                                <ThreadLikeThread :thread-id="id" @refresh="emitRefreshThread" />

                                <span class="text-sm md:text-md text-gray-400 font-medium">
                                    {{ threadDetail?._count?.like }} Likes
                                </span>
                            </div>

                            <div class="flex gap-2 items-center">
                                <img src="/img/reply.png" class="w-5 md:w-6" alt="">
                                <span class="text-sm md:text-md text-gray-400 font-medium">
                                    {{ threadDetail?._count?.replies }} Replies
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ThreadAddThread :thread-id="id" @success="emitRefreshThread" />

        <div>
            <div v-for="item in replies" :key="item.id">
                <ThreadItemThread :thread="item" />
            </div>
        </div>
    </div>
</template>