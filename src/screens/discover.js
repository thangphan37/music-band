/**@jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import {client} from 'utils/api-client'
import {
  Input,
  Spinner,
  PrevButton,
  NextButton,
  Button,
  FormGroup,
  FullFallbackSpinner,
} from 'components/lib'
import {Modal, ModalOpenButton, ModalContents} from 'components/modal'
import {SongItem} from 'components/song-item'
import {useQueryClient} from 'react-query'
import {FaGuitar, FaShare, FaMinusCircle} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {
  useSingers,
  useSinger,
  useSongSearch,
  useSingerUpdate,
  useHistoryRemove,
} from 'utils/discover'
import {ErrorBoundary} from 'react-error-boundary'
import {NotFound} from 'screens/not-found'
import {setLevelColor} from 'utils/song'
import * as colors from 'styles/colors.js'
import * as mq from 'styles/media-queries.js'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre css={{color: colors.red}}>{error.message}</pre>
    </div>
  )
}

function Singer({onSelectSinger, activeIndex, setPage, setQuery}) {
  const {
    data: {singers},
  } = useSingers()

  function handleChangeSinger(index) {
    onSelectSinger(index)
    setPage(0)
    setQuery('')
  }

  return (
    <div
      css={{
        position: 'sticky',
        borderRadius: '3px',
        padding: '10px',
        height: '500px',
        top: '4px',
        border: `solid 1px ${colors.border}`,
        [mq.small]: {
          background: colors.white,
        },
      }}
    >
      <h1
        css={{
          position: 'sticky',
          top: '2px',
        }}
      >
        Singer
      </h1>
      <ul
        css={{
          display: 'grid',
          gridGap: '1.5rem',
          maxHeight: '320px',
          overflowY: 'auto',
          padding: 0,
          margin: 0,
        }}
      >
        {singers.map((si, index) => (
          <li
            key={`${si.id}-${index}`}
            css={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
              gridGap: '0.5rem',
              padding: '3px',
              borderRadius: '3px',
              height: '58px',
              background: activeIndex === index ? colors.cadetblue : 'unset',
              '&:hover': {
                cursor: 'pointer',
                background: colors.gray10,
              },
            }}
            onClick={() => handleChangeSinger(index)}
          >
            <img
              width="48"
              height="48"
              src={si.avatar}
              alt={si.name}
              css={{
                borderRadius: '50%',
              }}
            />
            <h3 css={{marginLeft: 5, fontSize: '0.85rem'}}>{si.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Main({singers, activeIndex, page, setPage, query, setQuery}) {
  const queryClient = useQueryClient()
  const formRef = React.useRef()

  const singer = singers[activeIndex]

  const {name} = singer

  const {data: singerData, isPreviousData, isFetching} = useSinger(name, page)
  const {data: dataSearched, isFetching: isSearching} = useSongSearch(
    name,
    query,
  )
  const {mutate: update} = useSingerUpdate(name)
  const {mutate: remove, isLoading: isRemoving} = useHistoryRemove(name)

  React.useEffect(() => {
    formRef.current.reset()
  }, [activeIndex])

  React.useEffect(() => {
    if (singerData?.hasMore) {
      queryClient.prefetchQuery(['singer', name, page + 1], () =>
        client(`singer?name=${name}&page=${page + 1}`),
      )
    }
  }, [singerData, page, queryClient, name])

  function handleSearchSong(e) {
    e.preventDefault()
    const {song} = e.target.elements

    setQuery(song.value)

    if (song.value) {
      update({history: song.value})
    }
  }

  function handleSubmitLyrics(e, _id) {
    e.preventDefault()
    const {lyrics} = e.target.elements

    if (lyrics.value) {
      update({song: {lyrics: lyrics.value, _id}})
    }
  }

  function handleHistoryRemove({_id, name}) {
    remove({_id, name})

    if (query === name) {
      formRef.current.reset()
      setQuery('')
    }
  }

  function renderFormDiscover() {
    return (
      <form onSubmit={handleSearchSong} ref={formRef}>
        <Input
          placeholder="Search song..."
          css={{
            width: '100%',
          }}
          name="song"
          id="song"
        />
      </form>
    )
  }

  function renderSongHistory() {
    return (
      <div
        css={{
          display: 'flex',
        }}
      >
        {singerData?.history.map((hi, index) => (
          <div
            key={`${hi.name}-${hi._id}`}
            css={{
              position: 'relative',
            }}
          >
            <button
              onClick={() => setQuery(hi.name)}
              css={{
                background: colors.white,
                color: colors.cadetblue,
                fontSize: '0.85em',
                margin: '2.5px',
                borderRadius: '3px',
                border: `solid 2px ${
                  hi.name === query ? colors.cadetblue : colors.border
                }`,
                '&:hover': {
                  border: `solid 2px ${colors.cadetblue}`,
                },
              }}
            >
              {hi.name}
            </button>
            <Button
              onClick={() => handleHistoryRemove({_id: hi._id, name: hi.name})}
              css={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                position: 'absolute',
                padding: 1,
                top: 0,
                right: 0,
              }}
            >
              {isRemoving && query === hi.name ? (
                <Spinner css={{width: 8, height: 8}} />
              ) : (
                <FaMinusCircle
                  css={{
                    width: 8,
                    height: 8,
                  }}
                />
              )}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  function renderSpinner() {
    return (
      <div css={{display: 'flex', justifyContent: 'center'}}>
        <Spinner css={{fontSize: '5rem'}} />
      </div>
    )
  }

  function renderSongSearched() {
    return (
      <>
        {isSearching ? renderSpinner() : null}
        {dataSearched?.songs.length ? (
          dataSearched?.songs.map((vi, index) => renderSong(vi, index))
        ) : (
          <p
            css={{
              textAlign: 'center',
              width: '80%',
              margin: '0 auto',
            }}
          >
            Hmmm... I couldn't find any songs with the query "{query}" Please
            try another.
          </p>
        )}
      </>
    )
  }

  function renderPrevNextButton() {
    return (
      <div
        css={{
          display: 'flex',
          margin: '0 auto',
        }}
      >
        <PrevButton
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 0}
        />

        <NextButton
          onClick={() =>
            !isPreviousData && singerData.hasMore
              ? setPage((old) => old + 1)
              : void 0
          }
          disabled={!singerData?.hasMore}
        />
      </div>
    )
  }

  function renderModalAddLyrics({_id} = {}) {
    return (
      <Modal>
        <ModalOpenButton
          css={{
            margin: '0 1rem',
            '&:hover': {
              color: colors.cadetblue,
              cursor: 'pointer',
            },
          }}
        >
          <FaGuitar />
        </ModalOpenButton>
        <ModalContents
          css={{width: '400px', borderRadius: '3px'}}
          label="Lyrics"
        >
          <h2 css={{textAlign: 'center'}}>Add Lyrics</h2>
          <form onSubmit={(e) => handleSubmitLyrics(e, _id)}>
            <FormGroup>
              <label htmlFor="lyrics">Lyrics:</label>
              <textarea
                id="lyrics"
                name="lyrics"
                css={{
                  height: '300px',
                  minHeight: '300px',
                  padding: '10px',
                }}
              />
            </FormGroup>
            <Button variant="primary" type="submit" css={{marginTop: '0.5em'}}>
              Add
            </Button>
          </form>
        </ModalContents>
      </Modal>
    )
  }

  function renderSong(vi, index) {
    return (
      <div key={`${vi.song}-${index}`}>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <div
            css={{
              color: colors.white,
              background: setLevelColor(vi.level),
              padding: '0 5px',
              margin: 3,
              borderRadius: 3,
            }}
          >
            {vi.level}
          </div>
          {vi.lyrics ? (
            <Link
              to={`/song/${singer.name}/${vi._id}`}
              css={{
                color: 'unset',
                margin: '0 1rem',
                '&:hover': {
                  color: colors.cadetblue,
                },
              }}
            >
              <FaShare />
            </Link>
          ) : (
            renderModalAddLyrics(vi)
          )}
        </div>
        <SongItem vi={vi} />
      </div>
    )
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        '> div': {
          marginTop: '1rem',
        },
      }}
    >
      {renderFormDiscover()}
      {renderSongHistory()}
      <div
        css={{
          display: 'grid',
          gridGap: '1rem',
        }}
      >
        {query ? (
          renderSongSearched()
        ) : (
          <>
            {renderPrevNextButton()}
            {isFetching ? renderSpinner() : null}
            {singerData?.songs
              .filter((f) => f.song.includes(query))
              .map((vi, index) => renderSong(vi, index))}
          </>
        )}
      </div>
    </div>
  )
}

function isMediumLarge() {
  const {matches: isMatchLarge} = window.matchMedia(mq.largeSize)
  const {matches: isMatchMedium} = window.matchMedia(mq.mediumSize)

  return isMatchLarge || isMatchMedium
}

function Discover({isOpen}) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [page, setPage] = React.useState(0)
  const [query, setQuery] = React.useState('')

  const {data, isLoading} = useSingers()
  const isMatch = isMediumLarge()

  function handleActiveSinger(a) {
    setActiveIndex(a)
  }

  if (isLoading) {
    return <FullFallbackSpinner />
  }

  const {singers} = data

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: singers.length ? '1fr 3fr' : 'auto',
        gap: '1.5rem',
        [mq.small]: {
          gridTemplateColumns: 'auto',
        },
      }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {singers.length ? (
          <>
            {isOpen || isMatch ? (
              <Singer
                onSelectSinger={handleActiveSinger}
                activeIndex={activeIndex}
                setPage={setPage}
                setQuery={setQuery}
              />
            ) : null}
            <Main
              activeIndex={activeIndex}
              page={page}
              setPage={setPage}
              query={query}
              singers={singers}
              setQuery={setQuery}
            />
          </>
        ) : (
          <NotFound />
        )}
      </ErrorBoundary>
    </div>
  )
}

export {Discover}
