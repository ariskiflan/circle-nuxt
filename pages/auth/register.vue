<script setup lang="ts">
import { register } from "~/services/auth";
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
    const res = await register(formInput.value);

    if (res && res.status) {
      useToastify("Register Berhasil", {
        autoClose: 1000,
        position: ToastifyOption.POSITION.TOP_CENTER,
      });

      router.push("/auth/login");
    }
  } catch (err) {
    const error = err as {
      data?: { statusMessage?: string; message?: string };
      message?: string;
    };
    console.error(
      error?.data?.message ||
      error?.data?.statusMessage ||
      error?.message ||
      "Register failed"
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col h-screen justify-center w-full md:w-1/3 m-auto gap-5 p-10 md:p-0">
    <!-- Logo & title -->
    <div class="flex flex-col gap-5">
      <img src="/img/circle.png" alt="Logo" class="w-40 md:w-64">
      <p class="text-xl md:text-4xl font-semibold ">Create Account Circle</p>
    </div>

    <!-- Form -->
    <form class="flex flex-col gap-5 w-full" @submit.prevent="handleRegister">
      <input v-model="formInput.username" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
        type="text" placeholder="Username">
      <input v-model="formInput.fullname" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
        type="text" placeholder="Fullname">
      <input v-model="formInput.email" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
        type="text" placeholder="Email">
      <input v-model="formInput.password" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
        type="password" placeholder="Password">

      <button type="submit" :disabled="isLoading"
        class="bg-[#04A51E] text-white w-full py-2 rounded-3xl text-md md:text-xl font-medium hover:bg-transparent transition-all duration-100 ease-in-out hover:[box-shadow:inset_0_0_0_2px_white] cursor-pointer disabled:opacity-50">
        {{ isLoading ? "Creating..." : "Create" }}
      </button>
    </form>

    <!-- Link to login -->
    <div>
      <p class="text-md md:text-xl">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-[#04A51E] cursor-pointer">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
