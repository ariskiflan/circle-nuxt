<script setup>
const route = useRoute();

</script>

<template>
  <div>
    <div class="text-white h-screen xl:border-l-2 border-gray-500 md:px-9 px-5 py-10 ">
      <div class="flex flex-col gap-3">
        <div v-if="route.path != '/profile'">
          <RightbarProfileCard />
        </div>
        <RightbarSuggestedUser />

        <RightbarFooter />
      </div>
    </div>
  </div>
</template>