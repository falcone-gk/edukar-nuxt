export const useCrudMethods = () => {

  const _baseKey = ref('')
  const _idField = ref<string | number | undefined>('')
  const _urlCrud = ref('')
  const pathWithId = computed(() => `${_urlCrud.value}${_idField.value}/`)
  const body = ref<{ [key: string]: any }>({})
  const form = ref(new FormData())

  const setup = (information: { baseKey: string, idField?: string | number, urlCrud: string }) => {
    const { baseKey, idField, urlCrud } = information
    _baseKey.value = baseKey
    _idField.value = idField
    _urlCrud.value = urlCrud
  }

  const populateForm = () => {
    Object.keys(body.value).forEach(key => {
      const value = body.value[key]
      if (value !== undefined) {
        form.value.append(key, body.value[key])
      }
    })
  }

  const cleanForm = () => {
    body.value = {}
    form.value = new FormData()
  }

  const { data: retrieveData, status: retrieveStatus, execute: retrieveExecute } = useEdukarAPI(() => _urlCrud.value, {
    method: 'get',
    immediate: false,
    watch: false
  })
  /* const { data: retrieveData, status: retrieveStatus, execute: retrieveExecute } = useAsyncData(
    _baseKey.value,
    () => useApiFetch(_urlCrud.value, {
      method: 'get'
    }), {
    immediate: false,
  }) */

  const { data: postData, status: postStatus, execute: postExecute } = useEdukarAPI(() => _urlCrud.value, {
    method: 'POST',
    body: form,
    immediate: false,
    watch: false
  })
  /* const { data: postData, status: postStatus, execute: postExecute } = useAsyncData(
    `${_baseKey.value}-post`,
    () => useApiFetch(_urlCrud.value, {
      method: 'post',
      body: form.value
    }), {
    immediate: false
  }) */

  const { data: putData, status: putStatus, execute: putExecute } = useEdukarAPI(() => pathWithId.value, {
    method: 'PATCH',
    body: form,
    immediate: false,
    watch: false
  })
  /* const { data: putData, status: putStatus, execute: putExecute } = useAsyncData(
    `${_baseKey.value}-put`,
    () => useApiFetch(pathWithId.value, {
      method: 'patch',
      body: form.value
    }), {
    immediate: false
  }) */

  const { data: deleteData, status: deleteStatus, execute: deleteExecute } = useEdukarAPI(() => pathWithId.value, {
    method: 'DELETE',
    immediate: false,
    watch: false
  })
  /* const { data: deleteData, status: deleteStatus, execute: deleteExecute } = useAsyncData(
    `${_baseKey.value}-delete`,
    () => useApiFetch(pathWithId.value, {
      method: 'delete'
    }), {
    immediate: false
  }) */

  const getData = async () => {
    await retrieveExecute()
    if (retrieveStatus.value === 'success') {
      return retrieveData.value
    }
  }

  const createData = async () => {
    populateForm()
    await postExecute()
    if (postStatus.value === 'success') {
      return postData.value
    }
  }

  const updateData = async () => {
    populateForm()
    await putExecute()
    if (putStatus.value === 'success') {
      return putData.value
    }
  }

  const destroyData = async () => {
    await deleteExecute()
    if (deleteStatus.value === 'success') {
      cleanForm()
      return deleteData.value
    }
  }

  const getStatus = () => {
    return { retrieveStatus, postStatus, putStatus, deleteStatus }
  }

  return {
    setup, getData, createData, updateData, destroyData,
    getStatus, body, form, cleanForm
  }
}
