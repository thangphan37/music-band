import {useQuery, useMutation, useQueryClient} from 'react-query'
import {client} from './api-client'

function useSingers() {
  return useQuery(['singers'], () => client('singers'))
}

function useSinger(name, page) {
  return useQuery({
    queryKey: ['singer', name, page],
    queryFn: () => client(`singer?name=${name}&page=${page}`),
    keepPreviousData: true,
  })
}

function useSongSearch(name, query) {
  return useQuery({
    queryKey: ['songs', name, query],
    queryFn: () => client(`songs?name=${name}&song=${query}`),
  })
}

function useSingerUpdate(name) {
  const queryClient = useQueryClient()

  return useMutation(
    (updateData) =>
      client(`singer?name=${name}`, {data: updateData, method: 'PUT'}),
    {
      onSuccess: () => {
        queryClient.refetchQueries('singer')
        queryClient.refetchQueries('songs')
      },
    },
  )
}

function useHistoryRemove(name) {
  const queryClient = useQueryClient()

  return useMutation(
    (data) => client(`singer?name=${name}`, {data, method: 'DELETE'}),
    {
      onSuccess: () => {
        queryClient.refetchQueries('singer')
        queryClient.refetchQueries('songs')
      },
    },
  )
}

export {useSingers, useSinger, useSongSearch, useSingerUpdate, useHistoryRemove}
