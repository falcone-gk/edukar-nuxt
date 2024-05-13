export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();
    if (userStore.isLogged) {
        return navigateTo("/")
    }
})
