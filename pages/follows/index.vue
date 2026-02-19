<script setup>
import { getFollowers, getFollowing } from '~/services/follow';
import { getProfile } from '~/services/profile';


const router = useRouter();
const route = useRoute();
const activeTab = ref("followers");

const {data: currentUser} =  useLazyAsyncData(
  "profile", getProfile
)

const targetUserId = computed(() => {
  return route.query.userId ? Number(route.query.userId) : currentUser.value?.id;
});

const {data: followersList, refresh: refreshFollowers} = useLazyAsyncData('followers', () => getFollowers(targetUserId.value))
const {data: followingList, refresh: refreshFollowing} = useLazyAsyncData('following', () => getFollowing(targetUserId.value))

const displayedUser = computed(() => {
  // Jika ada userId di query, ambil dari userById
  if (route.query.userId) {
    return userById.value;
  }
  // Jika tidak ada, tampilkan currentUser
  return currentUser.value;
});

watch(() => route.query.userId, () => {
  refreshFollowers();
  refreshFollowing();
});

</script>

<template>
  <div>
    <div class="pt-4 px-4 md:hidden flex items-center gap-2">
      <UiBaseIcon name="mdi:arrow-back" size="40" class="cursor-pointer" @click="router.push('/')"/>
      <p class="text-lg font-semibold">
        @{{ displayedUser?.username || displayedUser?.user?.username }}
      </p>
    </div>
  
    <div class="grid grid-cols-2 justify-center items-center py-5 md:py-10">
      <p
class="relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2"
        :class="[
                'relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2',
                activeTab === 'followers'
                  ? 'border-gray-500 font-bold text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[80%] after:h-1 after:bg-green-500 after:rounded-lg'
                  : 'border-gray-500 font-normal',
              ]" @click="activeTab = 'followers'">
        Followers
      </p>
  
      <p
class="relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2"
        :class="[
                'relative text-md md:text-xl cursor-pointer px-4 py-2 text-center border-b-2',
                activeTab === 'following'
                  ? 'border-gray-500 font-bold text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[80%] after:h-1 after:bg-green-500 after:rounded-lg'
                  : 'border-gray-500 font-normal',
              ]" @click="activeTab = 'following'">
        Following
      </p>
    </div>
  
    <div class="p-5">
      <div v-if="activeTab === 'followers'" class="flex flex-col gap-5">
        <div v-if="followersList?.length > 0">
          <div v-for="(follower, index) in followersList" :key="index">
            <FollowListFollows :follows="follower.follower" :user="currentUser" />
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-10">
          No followers yet
        </div>
      </div>
  
      <div v-else class="flex flex-col gap-5">
        <div v-if="followingList?.length > 0">
          <div v-for="(following, index) in followingList" :key="index">
            <FollowListFollows :follows="following.following" :user="currentUser" />
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-10">
          Not following anyone yet
        </div>
      </div>
    </div>
  </div>
</template>