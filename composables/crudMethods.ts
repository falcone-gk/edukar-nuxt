export const useCrudMethods = () => {

  const _baseKey = ref('')
  const _idField = ref<string | number | undefined>('')
  const _urlCrud = ref('')
  const pathWithId = computed(() => `${_urlCrud.value}${_idField.value}/`)
  const body = reactive<{ [key: string]: string | number }>({})

  const setup = <T>(information: { baseKey: string, idField?: string | number, urlCrud: string }) => {
    const { baseKey, idField, urlCrud } = information
    _baseKey.value = baseKey
    _idField.value = idField
    _urlCrud.value = urlCrud
  }

  const { data: retrieveData, status: retrieveStatus, execute: retrieveExecute } = useLazyAsyncData(
    _baseKey.value,
    () => useApiFetch(_urlCrud.value, {
      method: 'get'
    }), {
    immediate: false,
  }
  )

  const { data: postData, status: postStatus, execute: postExecute } = useLazyAsyncData(
    `${_baseKey.value}-post`,
    () => useApiFetch(_urlCrud.value, {
      method: 'post',
      body: body
    }), {
    immediate: false
  }
  )

  const { data: putData, status: putStatus, execute: putExecute } = useLazyAsyncData(
    `${_baseKey.value}-put`,
    () => useApiFetch(pathWithId.value, {
      method: 'put',
      body: body
    }), {
    immediate: false
  }
  )

  const { data: deleteData, status: deleteStatus, execute: deleteExecute } = useLazyAsyncData(
    `${_baseKey.value}-delete`,
    () => useApiFetch(pathWithId.value, {
      method: 'delete'
    }), {
    immediate: false
  }
  )

  const getData = async () => {
    await retrieveExecute()
    if (retrieveStatus.value === 'success') {
      return retrieveData.value
    }
  }

  const createData = async () => {
    await postExecute()
    if (postStatus.value === 'success') {
      return postData.value
    }
  }

  const updateData = async () => {
    await putExecute()
    if (putStatus.value === 'success') {
      return putData.value
    }
  }

  const destroyData = async () => {
    await deleteExecute()
    if (deleteStatus.value === 'success') {
      return deleteData.value
    }
  }

  const getStatus = () => {
    return { retrieveStatus, postStatus, putStatus, deleteStatus }
  }

  return { setup, getData, createData, updateData, destroyData, getStatus, body }
}
