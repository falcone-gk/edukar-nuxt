export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();
    const { showNotification } = useNotification();
    if (!userStore.isLogged) {
        showNotification({ message: 'Por favor inicia sesión', type: 'info' })
        return navigateTo({
            path: '/login',
            query: { next: from.fullPath }
        })
    }
})
