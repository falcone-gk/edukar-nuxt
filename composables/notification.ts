export const useNotification = () => {
  const toast = useToast()

  const showNotification = (information: { title?: string, message?: string, type: 'success' | 'error' | 'warning' | 'info' }) => {
    const info = reactive(information)
    switch (info.type) {
      case 'success':
        info.title = info.title || 'Éxito'
        info.message = info.message || 'Operación exitosa'
        toast.add({ title: info.title, description: info.message, icon: "i-heroicons-check-badge" })
        break
      case 'error':
        info.title = info.title || 'Error'
        info.message = info.message || 'Ha ocurrido un error'
        toast.add({ title: info.title, description: info.message, icon: "i-heroicons-x-circle", color: 'red' })
        break
    }
  }

  return { showNotification }
}
