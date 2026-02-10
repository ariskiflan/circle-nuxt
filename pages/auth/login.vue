<script setup lang="ts">
import type { Ilogin, ILoginResponse } from "~/types/app";

definePageMeta({
  layout: false
});

const router = useRouter();

const formInput = ref<Ilogin>({
  email: "",
  password: "",
});

const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<ILoginResponse>("/api/auth/login", {
      method: "POST",
      body: formInput.value,
    });

    if (res.status) {
      // Simpan JWT token di localStorage
      localStorage.setItem("token", res.data.token);

      // Optional: simpan user data juga
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log(res.message); // "Login success"

      router.push("/"); // redirect ke dashboard/home
    }
  } catch (err) {
    const error = err as {
      data?: {
        statusMessage?: string;
        message?: string;
      };
      message?: string
    };

    console.error(error?.data?.message || error?.data?.statusMessage || error?.message || "Login failed");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
    <div class="flex flex-col h-screen justify-center w-full md:w-1/3 m-auto gap-5 p-10 md:p-0">
        <!-- Logo & Title -->
        <div class="flex flex-col gap-5">
            <img src="/img/circle.png" alt="Logo" class="w-40 md:w-64">
            <p class="text-xl md:text-4xl font-semibold">Login to Circle</p>
        </div>
    
        <!-- Form -->
        <form class="flex flex-col gap-5 w-full" @submit.prevent="handleLogin">
            <input
v-model="formInput.email" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl" type="text"
                placeholder="Email">
            <input
v-model="formInput.password" class="border-2 px-4 py-2 rounded-xl w-full text-md md:text-xl"
                type="password" placeholder="Password">
    
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
                <RouterLink to="/auth/register" class="text-[#04A51E] cursor-pointer">
                    Sign up
                </RouterLink>
            </p>
        </div>
    </div>
</template>
