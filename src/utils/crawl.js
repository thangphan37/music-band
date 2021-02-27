import {useMutation, useQueryClient} from 'react-query'
import {client} from './api-client'

function useCustomCrawl() {
  const queryClient = useQueryClient()

  return useMutation((data) => client(`singer`, {data}), {
    onSuccess: () => queryClient.refetchQueries('singers'),
  })
}
function useSingerCrawl() {
  const queryClient = useQueryClient()

  return useMutation((data) => client(`crawl`, {data}), {
    onSuccess: () => queryClient.refetchQueries('singers'),
  })
}

export {useSingerCrawl, useCustomCrawl}
