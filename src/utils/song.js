import {useQuery, useMutation, useQueryClient} from 'react-query'
import {client} from './api-client'
import * as colors from 'styles/colors'

function useSong(singerName, songId) {
  return useQuery({
    queryKey: ['songs', singerName, songId],
    queryFn: () => client(`songs/${singerName}/${songId}`),
  })
}

function useSongUpdate(singerName, songId) {
  const queryClient = useQueryClient()

  return useMutation(
    (updateData) =>
      client(`singer?name=${singerName}`, {data: updateData, method: 'PUT'}),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['songs', singerName, songId])
        queryClient.refetchQueries('singer')
        queryClient.refetchQueries('goodJob')
      },
    },
  )
}

const levels = {
  unset: {value: 'unset', color: colors.text, label: 'Unset'},
  easy: {value: 'easy', color: colors.easy, label: 'Easy'},
  medium: {value: 'medium', color: colors.medium, label: 'Medium'},
  hard: {value: 'hard', color: colors.hard, label: 'Hard'},
}

function setLevelColor(level) {
  return levels[level].color
}

export {useSong, useSongUpdate, levels, setLevelColor}
