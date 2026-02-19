<script setup>
const {logout, showLogoutModal} = useLogout()
</script>

<template>
    <div>
        <div class="h-screen md:border-r-2 border-gray-500">
            <div class="p-10 flex flex-col gap-10 h-full justify-between">
                <div class="flex flex-col gap-10">
                    <img class="md:w-58 w-40" src="/img/circle.png" alt="Logo">

                    <div>
                        <ul class="flex flex-col gap-10">
                            <!-- Ganti RouterLink menjadi NuxtLink -->
                            <NuxtLink to="/">
                                <li class="flex items-center gap-5 hover:translate-x-1 transition-all duration-100">
                                    <img class="md:w-10 w-8" src="/img/home.png" alt="">
                                    <p
                                        class="md:text-2xl text-xl text-white font-medium hover:font-bold cursor-pointer">
                                        Home
                                    </p>
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/search">
                                <li class="flex items-center gap-5 hover:translate-x-1 transition-all duration-100">
                                    <img class="md:w-10 w-8" src="/img/user-search.png" alt="">
                                    <p
                                        class="md:text-2xl text-xl text-white font-medium hover:font-bold cursor-pointer">
                                        Search
                                    </p>
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/follows">
                                <li class="flex items-center gap-5 hover:translate-x-1 transition-all duration-100">
                                    <img class="md:w-10 w-8" src="/img/heart.png" alt="">
                                    <p
                                        class="md:text-2xl text-xl text-white font-medium hover:font-bold cursor-pointer">
                                        Follows
                                    </p>
                                </li>
                            </NuxtLink>

                            <NuxtLink to="/profile">
                                <li class="flex items-center gap-5 hover:translate-x-1 transition-all duration-100">
                                    <img class="md:w-10 w-8" src="/img/profile-circle.png" alt="">
                                    <p
                                        class="md:text-2xl text-xl text-white font-medium hover:font-bold cursor-pointer">
                                        Profile
                                    </p>
                                </li>
                            </NuxtLink>
                        </ul>
                    </div>
                </div>

                <!-- Trigger Logout -->
                <div
class="flex items-center gap-5 cursor-pointer hover:translate-x-1 transition"
                    @click="showLogoutModal = true">
                    <img class="md:w-10 w-8" src="/img/logout.png">
                    <p class="md:text-2xl text-xl text-white font-medium">Logout</p>
                </div>

                <!-- Modal -->
                <UiConfirmModal
v-model="showLogoutModal" title="Logout?"
                    description="You will be signed out from your account." confirm-text="Logout"
                    confirm-color="bg-red-600 hover:bg-red-700" @confirm="logout" />

            </div>
        </div>
    </div>
</template>
