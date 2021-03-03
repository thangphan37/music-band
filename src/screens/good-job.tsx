/**@jsx jsx */
import {jsx} from '@emotion/react'
import {FaRegKiss} from 'react-icons/fa'
import {useQuery} from 'react-query'
import {client} from 'utils/api-client'
import {formatDate} from 'utils/format-date'
import {Spinner} from 'components/lib'
import {useNavigate} from 'react-router-dom'
import {setLevelColor} from 'utils/song'
import type {Song} from 'type'
import * as colors from 'styles/colors'

function GoodJob() {
  const {data, isLoading} = useQuery({
    queryKey: ['goodJob'],
    queryFn: () => client('remember'),
  })

  const navigate = useNavigate()

  function renderSongRemembered() {
    return (
      <table
        css={{
          width: '100%',
          marginTop: '2rem',
          tr: {
            height: '60px',
            borderBottom: `solid 1px ${colors.text}`,
            cursor: 'pointer',
            ':hover': {
              backgroundColor: '#dddddd',
            },
          },
          'th, td': {
            textAlign: 'left',
            fontSize: '1.5rem',
            paddingLeft: 8,
          },
        }}
      >
        <thead>
          <tr>
            <th>Stt.</th>
            <th>Name</th>
            <th>Level</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.songs.map(
            (
              {
                song,
                rememberedDate,
                level,
                singer,
                _id,
              }: Song & {singer: string},
              index: number,
            ) => (
              <tr
                onClick={() => {
                  navigate(`/song/${singer}/${_id}`)
                }}
                key={`tr-${song}-${index}`}
              >
                <td>{index + 1}</td>
                <td>{song}</td>
                <td>
                  <div
                    css={{
                      color: colors.white,
                      background: setLevelColor(level),
                      textAlign: 'center',
                      padding: '0 5px',
                      maxWidth: '100px',
                      borderRadius: 3,
                    }}
                  >
                    {level}
                  </div>
                </td>
                <td>{formatDate(rememberedDate)}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    )
  }
  return (
    <div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '2em',
          color: colors.cadetblue,
        }}
      >
        <h1>Good Job!</h1>
        <FaRegKiss />
      </div>
      {isLoading ? <Spinner /> : renderSongRemembered()}
    </div>
  )
}

export {GoodJob}
