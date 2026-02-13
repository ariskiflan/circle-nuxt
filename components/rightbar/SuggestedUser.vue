<script setup>
import { getUserNotId } from '~/services/user';

const { data: suggestedUsers } = await useAsyncData(
    "suggested-users", getUserNotId
)

</script>

<template>
    <div>
        <div class="bg-[#262626] p-5 rounded-2xl flex flex-col gap-5">
            <p class="text-md md:text-xl font-semibold">Suggested For you</p>

            <div class="flex flex-col gap-3 lg:h-[150px] h-[100px] overflow-auto hide-scrollbar">
                <div v-for="item in suggestedUsers" :key="item.id">
                        <div class="flex items-center gap-5 justify-between">
                            <div @click="goProfile">
                                <div class="flex items-center gap-3 md:gap-5">
                                    <img
:src="item.profile?.avatar || '/img/profile-circle.png'" alt=""
                                        class="w-8 md:w-10 cursor-pointer">

                                    <div class="max-w-[150px]">
                                        <p class="text-sm md:text-md font-semibold truncate">
                                            {{ item.fullname }}
                                        </p>
                                        <span class="text-gray-400 font-normal text-sm md:text-md truncate block">
                                            @{{ item.username }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <UiButtonFollow :follows="item" />
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>