import { apiClient, urls } from './client'

export const getProgram = () => apiClient.get(urls.program).then((res) => res.data)

export const createProgramItem = (item) =>
  apiClient.post(urls.program, item).then((res) => res.data)
