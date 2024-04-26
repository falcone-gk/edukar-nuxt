export const useConfirmDialog = () => {

  interface ConfirmOptions {
    title?: string
    message?: string
    severity?: 'danger' | 'warning'
    rejectLabel?: string
    acceptLabel?: string
    accept: () => void
  }

  const modal = useModal()
  const ConfirmDialog = defineAsyncComponent(() => import('~/components/ConfirmDialog.vue'))

  function showConfirmDialog({
    title, message, severity = 'warning', rejectLabel, acceptLabel, accept
  }: ConfirmOptions) {

    const confirmTitle = title || 'Confirmar'
    const confirmMessage = message || '¿Estás seguro de realizar esta operación?'
    const confirmRejectLabel = rejectLabel || 'Cancelar'
    const confirmAcceptLabel = acceptLabel || 'Confirmar'

    modal.open(ConfirmDialog, {
      title: confirmTitle,
      message: confirmMessage,
      severity: severity,
      rejectLabel: confirmRejectLabel,
      acceptLabel: confirmAcceptLabel,
      confirm: () => {
        accept()
        modal.close()
      },
      onClose: () => {
        modal.close()
      }
    })
  }

  return { showConfirmDialog }
}
