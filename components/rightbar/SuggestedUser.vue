<script setup>
import { getUserNotId } from '~/services/user';
import { getProfile } from "~/services/profile";

const { data: suggestedUsers } = useLazyAsyncData(
    "suggested-users", getUserNotId 
)

const { data: user } = await useAsyncData(
  "profile", getProfile
)

const router = useRouter();

const handleRedirectProfile = (targetUserId) => {
  if (!user.value) {
    router.push('/auth/login');
    return;
  }

  const authorId = targetUserId ?? null;
  if (!authorId) {
    router.push('/profile');
    return;
  }

  if (user.value.id !== authorId) {
    router.push(`/profile/${authorId}`);
  } else {
    router.push('/profile');
  }
};

</script>

<template>
    <div>
        <div  class="bg-[#262626] p-5 rounded-2xl flex flex-col gap-5">
            <p class="text-md md:text-xl font-semibold">Suggested For you</p>

            <div class="flex flex-col gap-3 lg:h-[150px] h-[100px] overflow-auto custom-scrollbar">
                <div v-for="item in suggestedUsers" :key="item.id">
                    <div class="flex items-center gap-5 justify-between">
                        <div @click="handleRedirectProfile(item.id)">
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

<style scoped>
/* Chrome, Edge, Safari */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
  border-radius: 999px;
}

/* .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #04A51E;
  border-radius: 999px;
  border: 1px solid #1f2937;
} */

/* Firefox */
/* .custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #04A51E #1f2937;
} */
</style>