<script setup lang="ts">
import { login } from "~/services/auth";
import type { Ilogin } from "~/types/app";

definePageMeta({
  layout: false
});

const formInput = ref<Ilogin>({
  email: "",
  password: "",
});

const isLoading = ref(false);
const isShowPassword = ref(false);

const handleLogin = async () => {
  isLoading.value = true

  try {
    const res = await login(formInput.value)

    if (res.status) {
      useToastify("Login Berhasil", {
        autoClose: 1000,
        position: ToastifyOption.POSITION.TOP_CENTER,
      });
      await navigateTo("/")
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
      "Login failed"
    );

  } finally {
    isLoading.value = false
  }
}

const inputType = computed(() =>
  isShowPassword.value ? "text" : "password"
)

const togglePassword = () => {
  isShowPassword.value = !isShowPassword.value
}

</script>

<template>
  <div class="flex flex-col h-screen justify-center w-full md:w-1/2 lg:w-1/3 m-auto gap-5 p-10 md:p-0">
    <!-- Logo & Title -->
    <div class="flex flex-col gap-5">
      <img src="/img/circle.png" alt="Logo" class="w-40 md:w-64">
      <p class="text-xl md:text-4xl font-semibold">Login to Circle</p>
    </div>

    <!-- Form -->
    <form class="flex flex-col gap-5 w-full" @submit.prevent="handleLogin">

      <div>
        <input
v-model="formInput.email" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
          type="text" placeholder="Email">
      </div>

      <div class="relative">
        <input
v-model="formInput.password" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl text-black"
          :type="inputType" placeholder="Password">

        <div class="absolute right-4 top-1/2 -translate-y-1/2" @click="togglePassword">
          <UiBaseIcon
:name="isShowPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" size="40"
             class="text-black" />
        </div>

      </div>

      <button
type="submit" :disabled="isLoading" class="bg-[#04A51E] text-white w-full py-2 rounded-3xl text-md md:text-xl font-medium
                       hover:bg-transparent transition-all duration-100 ease-in-out
                       hover:[box-shadow:inset_0_0_0_2px_white] cursor-pointer disabled:opacity-50">
        {{ isLoading ? "Logging in..." : "Login" }}
      </button>
    </form>

    <!-- Link to register -->
    <div>
      <p class="text-md md:text-xl">
        Don’t have an account yet?
        <NuxtLink to="/auth/register" class="text-[#04A51E] cursor-pointer">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
