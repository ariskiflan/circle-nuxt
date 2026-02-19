<script setup>
// import { getProfile } from '~/services/profile';

const props = defineProps({
  follows: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true
  }
});

// const { data: user } =  useLazyAsyncData(
//   "profile", getProfile
// )

const handleButtonFollows = computed(() => {
  if (props.user.value?.id !== props.follows?.id) {
    return true;
  }
  return false;
})

const handleRedirectProfile = () => {
  if (props.user.value?.id !== props.follows?.id) {
    return `/profile/${props.follows?.id}`;
  }
  return "/profile";
};

</script>

<template>
  <div class="flex items-center gap-5 justify-between">
    <div class="flex items-center gap-5">
      <RouterLink :to="handleRedirectProfile()">
        <div class="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="/img/profile-circle.png"
            alt="profile"
            class="object-cover w-full h-full"
          >
        </div>
      </RouterLink>

      <div>
        <p class="text-md font-semibold">{{ props.follows.fullname }}</p>
        <span class="text-gray-400 font-normal text-md">
          @{{ props.follows.username }}
        </span>
        <!-- <p>{{ props.follows?.profile?.bio }}</p> -->
      </div>
    </div>

    <div v-if="handleButtonFollows">
      <UiButtonFollow :follows="props.follows" />
    </div>
  </div>
</template>