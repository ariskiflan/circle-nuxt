<script setup>
import { createFollow } from '~/services/follow';
import { getProfile } from '~/services/profile';

const props = defineProps({
    follows: {
        type: Object,
        required: true,
    },
});

const route = useRoute();
const isFollowing = ref(false);

const { data: currentUser } = useAsyncData(
  "profile", getProfile
)
const targetUserId = computed(() => {
  return route.query.userId ? Number(route.query.userId) : currentUser.value?.id;
});

const handleCreateFollows = async () => {

    try {
        await createFollow(props.follows.id);
        isFollowing.value = !isFollowing.value;

        if(targetUserId.value) {
            console.log('update');
        }
    } catch (error) {
        console.log(error);
    }
};

const checkIsFollowing = () => {
  try {
    // ✅ BENAR: Cek di user.following untuk followingId
    const followings = currentUser.value?.user?.following?.find(
      (f) => f.followingId === props.follows.id
    );
    isFollowing.value = !!followings;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  checkIsFollowing();
});
watch([currentUser, () => props.follows.id], checkIsFollowing);

</script>

<template>
    <button
        class="flex border-2 border-white py-1 px-3 md:py-2 md:px-4 rounded-2xl text-white font-semibold cursor-pointer text-sm xl:text-md"
        @click="handleCreateFollows">
        {{ isFollowing ? "Unfollow" : "Follow" }}
    </button>
</template>