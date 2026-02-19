<script setup>
const date = new Date();
const year = date.getFullYear();

</script>

<template>
  <!-- Footer Web & Tablet -->
  <div class="hidden 2xl:block">
    <div class="bg-[#262626] px-5 py-2 rounded-2xl flex flex-col gap-1">
      <div class="flex items-center gap-3 flex-wrap">
        <p class="text-sm font-semibold">
          Developed by <span class="font-bold">@arskflnm</span>
        </p>
  
        <div class="w-2 h-2 rounded-full bg-gray-400"/>
  
        <div class="flex gap-3 items-center">
          <UiBaseIcon name="mdi:instagram" size="22" />
          <UiBaseIcon name="mdi:github" size="22"  />
          <UiBaseIcon name="ic:baseline-facebook" size="22"  />
        </div>
      </div>
  
      <div class="flex gap-3 items-center">
        <p class="flex items-center gap-2 text-sm">
          Powered by
          <img src="/img/main-logo.png" alt="" class="w-7" >
          Dumbways Indonesia
        </p>
  
        <div class="w-2 h-2 rounded-full bg-gray-400"/>
        <span class="text-sm text-white font-semi-bold">{{ year }}</span>
      </div>
    </div>
  </div>
  
  <!-- Footer Mobile -->
  <div class="block 2xl:hidden">
    <div class="bg-[#262626] p-4 rounded-2xl flex flex-col gap-2 text-center">
      <div class="flex items-center gap-2 justify-center">
        <p class="text-xs font-semibold">
          Developed by <span class="font-bold">@arskflnm</span>
        </p>
        <span class="text-xs text-white font-semi-bold">{{ year }}</span>
      </div>
  
  
      <div class="flex justify-center gap-4">
         <UiBaseIcon name="mdi:instagram" size="22" />
          <UiBaseIcon name="mdi:github" size="22"  />
          <UiBaseIcon name="ic:baseline-facebook" size="22"  />
      </div>
  
      <div class="flex justify-center items-center gap-2 text-xs">
        <span>Powered by</span>
        <img src="/img/main-logo.png" alt="" class="w-6" >
        <span>Dumbways</span>
      </div>
  
    </div>
  </div>
</template>