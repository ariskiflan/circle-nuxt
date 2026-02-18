<script setup>
import { getProfile } from '~/services/profile';
import { getUsers } from '~/services/user';


const input = ref("");
const searchResult = ref([]);
const router = useRouter();

const {data: users} = useLazyAsyncData('search', getUsers )

const { data: user } =  useLazyAsyncData(
  "profile", getProfile
)

const handleChange = () => {
  if (input.value === "") {
    searchResult.value = [];
  } else {
    const keyword = input.value.toLowerCase();
    searchResult.value = users.value.filter((user) =>
      user.username.toLowerCase().includes(keyword)
    );    
  }
};

const handleRedirectProfile = (users) => {
  return user.value.id != users?.id ? `/profile/${users.id}` : "/profile";
};

const handleButtonFollows = (item) => {
  return user.value?.id !== item?.id;
};

</script>

<template>
  <div class="px-5 py-10 flex flex-col gap-10">
    <div class="flex items-center gap-3 justify-between">
        <UiBaseIcon
name="mdi:arrow-back" 
          size="40" 
          class="cursor-pointer md:hidden"
          @click="router.push('/')"
        />

      <input
        v-model="input"
        type="text"
        class="w-full bg-[#3f3f3f] p-2 rounded-2xl font-normal text-white placeholder:text-white text-md md:text-xl"
        placeholder="Search Your Friend"
        @input="handleChange"
      >
    </div>

    <div class="flex flex-col gap-5">
      <template v-if="searchResult.length > 0">
        <div
          v-for="item in searchResult"
          :key="item.id"
          class="flex items-center gap-5 justify-between"
        >
          <div class="flex items-center gap-5">
            <RouterLink :to="handleRedirectProfile(item)">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                <img :src="item.profile?.Avatar || '/img/profile-circle.png'" alt="" >
              </div>
            </RouterLink>

            <div>
              <p class="text-md md:text-xl font-semibold">{{ item.fullname }}</p>
              <span class="text-gray-400 font-normal text-md md:text-xl">
                @{{ item.username }}
              </span>
              <p>{{ item.profile?.bio }}</p>
            </div>
          </div>

          <div v-if="handleButtonFollows(item)">
            <UiButtonFollow :follows="item" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-5 justify-center">
          <div class="flex flex-col gap-2 items-center">
            <p class="text-xl md:text-2xl font-semibold">No Result for "{{ input }}"</p>
            <p class="text-sm md:text-md font-normal text-[#b3b3b3]">
              Try searching for something else or check the spelling of what you
              typed
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>