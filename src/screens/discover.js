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
  ErrorMessage,
} from 'components/lib'
import {Modal, ModalOpenButton, ModalContents} from 'components/modal'
import {Video} from 'components/video'
import {useQueryClient} from 'react-query'
import {FaGuitar, FaShare} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {
  useSingers,
  useSinger,
  useSongSearch,
  useSingerUpdate,
} from 'utils/discover'
import {ErrorBoundary} from 'react-error-boundary'
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
        height: '60vh',
        top: '4px',
        border: `solid 1px ${colors.border}`,
        ['@media' + mq.small]: {
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
          maxHeight: '50vh',
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

  const {data: videos, isPreviousData, isFetching} = useSinger(name, page)
  const {data: dataSearched, isFetching: isSearching} = useSongSearch(
    name,
    query,
  )
  const {mutate: update} = useSingerUpdate(name)

  React.useEffect(() => {
    formRef.current.reset()
  }, [activeIndex])

  React.useEffect(() => {
    if (videos?.hasMore) {
      queryClient.prefetchQuery(['singer', name, page + 1], () =>
        client(`singer?name=${name}&page=${page + 1}`),
      )
    }
  }, [videos, page, queryClient, name])

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
        {videos?.history.map((hi, index) => (
          <button
            key={`${hi}-${index}`}
            onClick={() => setQuery(hi)}
            css={{
              fontSize: '0.85em',
              margin: '2.5px',
              background: colors.white,
              color: colors.cadetblue,
              borderRadius: '3px',
              border: `solid 1px ${colors.border}`,
              '&:hover': {
                border: `solid 1px ${colors.cadetblue}`,
              },
            }}
          >
            {hi}
          </button>
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
        {dataSearched?.songs.map((vi, index) => renderSongItem(vi, index))}
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
            !isPreviousData && videos.hasMore
              ? setPage((old) => old + 1)
              : void 0
          }
          disabled={!videos?.hasMore}
        />
      </div>
    )
  }

  function renderModalAddLyrics({_id} = {}) {
    return (
      <Modal>
        <ModalOpenButton>
          <FaGuitar
            css={{
              '&:hover': {
                cursor: 'pointer',
                color: colors.cadetblue,
              },
            }}
          />
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

  function renderSongItem(vi, index) {
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
          {!vi.lyrics ? renderModalAddLyrics(vi) : null}
        </div>
        <Video vi={vi} />
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
            {videos?.songs
              .filter((f) => f.song.includes(query))
              .map((vi, index) => renderSongItem(vi, index))}
          </>
        )}
      </div>
    </div>
  )
}

function isMediumLarge() {
  const {matches: isMatchLarge} = window.matchMedia(mq.large)
  const {matches: isMatchMedium} = window.matchMedia(mq.medium)

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
        gridTemplateColumns: '1fr 3fr',
        gap: '1.5rem',
        ['@media ' + mq.small]: {
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
          <ErrorMessage error={{message: 'Please crawl singer.'}} />
        )}
      </ErrorBoundary>
    </div>
  )
}

export {Discover}
