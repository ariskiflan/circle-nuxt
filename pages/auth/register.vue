<script setup lang="ts">
import type { Iregister } from "~/types/app";

definePageMeta({
  layout: false
});

const router = useRouter();

const formInput = ref<Iregister>({
  username: "",
  fullname: "",
  email: "",
  password: "",
});

const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: formInput.value,
    });

    if (res && (res as any).status) {
      router.push("/auth/login");
    }
  } catch (err: any) {
    console.log(err?.data?.statusMessage || err?.message || "Register failed");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col h-screen justify-center w-full md:w-1/3 m-auto gap-5 p-10 md:p-0">
    <!-- Logo & title -->
    <div class="flex flex-col gap-5">
      <img src="/img/circle.png" alt="Logo" class="w-40 md:w-64" >
      <p class="text-xl md:text-4xl font-semibold">Create Account Circle</p>
    </div>

    <!-- Form -->
    <form class="flex flex-col gap-5 w-full" @submit.prevent="handleRegister">
      <input
        v-model="formInput.username"
        class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl"
        type="text"
        placeholder="Username"
      >
      <input
        v-model="formInput.fullname"
        class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl"
        type="text"
        placeholder="Fullname"
      >
      <input
        v-model="formInput.email"
        class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl"
        type="text"
        placeholder="Email"
      >
      <input
        v-model="formInput.password"
        class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl"
        type="password"
        placeholder="Password"
      >

      <button
        type="submit"
        :disabled="isLoading"
        class="bg-[#04A51E] text-white w-full py-2 rounded-3xl text-md md:text-xl font-medium hover:bg-transparent transition-all duration-100 ease-in-out hover:[box-shadow:inset_0_0_0_2px_white] cursor-pointer disabled:opacity-50"
      >
        {{ isLoading ? "Creating..." : "Create" }}
      </button>
    </form>

    <!-- Link to login -->
    <div>
      <p class="text-md md:text-xl">
        Already have an account?
        <RouterLink to="/auth/login" class="text-[#04A51E] cursor-pointer">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
