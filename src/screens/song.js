/**@jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {Video} from 'components/video'
import {useParams} from 'react-router-dom'
import {useQuery, useMutation, useQueryClient} from 'react-query'
import {client} from 'utils/api-client'
import {FaPlusCircle, FaBrain, FaCheck, FaMicrophoneAlt} from 'react-icons/fa'
import {
  FullFallbackSpinner,
  CircleButton,
  Input,
  Button,
  Spinner,
  FormGroup,
  ErrorMessage,
} from 'components/lib'
import {Modal, ModalOpenButton, ModalContents} from 'components/modal'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'

function Song() {
  const queryClient = useQueryClient()
  const {singerName, songId} = useParams()

  const [newWord, setNewWord] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [mean, setMean] = React.useState(null)
  const [memoTest, setMemoTest] = React.useState({})

  const buttonRef = React.useRef(null)
  const lyricRef = React.useRef(null)

  const {data, isLoading} = useQuery({
    queryKey: ['songs', singerName, songId],
    queryFn: () => client(`songs/${singerName}/${songId}`),
  })

  const {mutate: update, isLoading: isUpdating, isError, error} = useMutation(
    (updateData) =>
      client(`singer?name=${singerName}`, {data: updateData, method: 'PUT'}),
    {
      onSuccess: () =>
        queryClient.refetchQueries(['songs', singerName, songId]),
    },
  )

  if (isLoading) {
    return <FullFallbackSpinner />
  }

  const {song} = data

  if (!song) {
    return (
      <div
        css={{
          display: 'flex',
          justifyContent: 'center',
          height: 'calc(100vh - 6rem)',
          alignItems: 'center',
          fontSize: '2rem',
        }}
      >
        <ErrorMessage error={{message: 'Song not exists.'}} />
      </div>
    )
  }
  const {lyrics, vocabulary} = song

  const rows = lyrics.split('\n').filter((r) => r)
  const newLyrics = calculateNewWord(vocabulary, lyrics)
  const newWordHash = vocabulary.reduce(
    // eslint-disable-next-line
    (acc, vo) => ((acc[vo.jp] = vo), acc),
    {},
  )

  function handleNewWord() {
    if (window.getSelection) {
      let {anchorNode, baseOffset, focusOffset} = window.getSelection()

      if (anchorNode.parentElement.tagName === 'SPAN') {
        setNewWord(anchorNode.parentElement.textContent)
        return
      }

      if (baseOffset > focusOffset) {
        ;[baseOffset, focusOffset] = [focusOffset, baseOffset]
      }

      setNewWord(anchorNode.data.slice(baseOffset, focusOffset))
    }
  }

  function handleLyricMouseUp(event) {
    const top = event.pageY - lyricRef.current.offsetTop - 20
    buttonRef.current.style = `top: ${top < 10 ? 10 : top}px`

    handleNewWord()
  }

  function handleSubmit(event) {
    event.preventDefault()
    const {en, vi} = event.target.elements
    const vocabulary = {jp: newWord, en: en.value, vi: vi.value}

    update({song: {_id: songId, vocabulary}})
  }

  function handleNewWordHover(event) {
    const meanHover = newWordHash[event.target.textContent]

    if (meanHover) {
      const top = event.pageY - lyricRef.current.offsetTop - 100
      const left = event.pageX - lyricRef.current.offsetLeft

      setMean({...meanHover, top: top < 0 ? 50 : top, left})
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  function handleMemoTestChange(event) {
    const newMemoTest = {...memoTest}

    newMemoTest[event.target.name] = event.target.value
    setMemoTest(newMemoTest)
  }

  function calculateNewWord(vocabulary, lyrics) {
    let result = lyrics

    vocabulary.forEach((vc) => {
      let index = result.indexOf(vc.jp)

      const head = result.slice(0, index)
      const middle = `<span style="background: cadetblue; color: white;">${vc.jp}</span>`
      const last = result.slice(index + vc.jp.length)

      result = head + middle + last
    })

    return result
  }

  function renderMeanOfNewWord() {
    return (
      <div
        css={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          padding: '5px',
          borderRadius: '3px',
          top: `${mean.top}px`,
          left: `${mean.left}px`,
          background: colors.bgTrans,
        }}
      >
        <div>
          <span css={{fontWeight: 'bold'}}>EN :</span> {mean.en}
        </div>
        <div>
          <span css={{fontWeight: 'bold'}}>VI :</span> {mean.vi}
        </div>
      </div>
    )
  }

  function renderModalAddMeanOfNewWord() {
    return (
      <Modal>
        <ModalOpenButton>
          <CircleButton
            css={{
              position: 'absolute',
              left: '20px',
              top: '10px',
              color: colors.cadetblue,
              ':disabled': {
                color: colors.text,
              },
            }}
            ref={buttonRef}
            disabled={!newWord?.trim()}
          >
            <FaPlusCircle />
          </CircleButton>
        </ModalOpenButton>
        <ModalContents
          css={{
            width: '300px',
          }}
          label="multiple-languages"
        >
          <h2 css={{textAlign: 'center'}}>{newWord}</h2>
          <form
            onSubmit={handleSubmit}
            css={{
              '> div': {
                marginTop: '10px',
              },
            }}
          >
            <FormGroup>
              <label htmlFor="en">EN</label>
              <Input
                id="en"
                defaultValue={newWord ? newWordHash[newWord]?.en : ''}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="vi">VI</label>
              <Input
                id="vi"
                defaultValue={newWord ? newWordHash[newWord]?.vi : ''}
              />
            </FormGroup>
            <div>
              <Button type="submit">
                Submit{' '}
                {isUpdating ? <Spinner css={{marginLeft: '5px'}} /> : null}
              </Button>
            </div>
            {isError ? <ErrorMessage error={error} /> : null}
          </form>
        </ModalContents>
      </Modal>
    )
  }

  function renderModalMemoTest() {
    return (
      <Modal>
        <ModalOpenButton onClick={() => setMemoTest({})}>
          <Button aria-label="memorization test">
            <FaBrain />
          </Button>
        </ModalOpenButton>
        <ModalContents
          label="Memorization"
          css={{
            width: '1000px',
            ['@media ' + mq.small]: {
              width: '100%',
            },
          }}
        >
          <h2 css={{textAlign: 'center', fontSize: '2rem'}}>
            Memorization Test
          </h2>
          <form
            css={{
              display: 'flex',
              flexDirection: 'column',
            }}
            autoComplete={'off'}
          >
            {rows.map((row, rowIndex) => {
              const cols = row.split('').filter((r) => r.trim().length)
              const colTotal = cols.length
              const letterSpacing = (916 - colTotal * 16) / (colTotal - 1)
              const name = `memo-${rowIndex}`
              const isFit = memoTest[name] === cols.join('')
              const fitCss = isFit
                ? {
                    background: colors.cadetblue,
                    color: colors.white,
                    fontWeight: 'bold',
                  }
                : {}

              return (
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '5px',
                    position: 'relative',
                  }}
                  key={`${row}-${rowIndex}`}
                >
                  <Input
                    maxLength={colTotal}
                    length={colTotal}
                    css={{
                      letterSpacing: `${letterSpacing}px`,
                      ...fitCss,
                    }}
                    name={name}
                    onChange={handleMemoTestChange}
                  />

                  {isFit ? (
                    <FaCheck
                      css={{
                        position: 'absolute',
                        right: -20,
                        color: colors.cadetblue,
                      }}
                    />
                  ) : null}
                </div>
              )
            })}
          </form>
        </ModalContents>
      </Modal>
    )
  }

  function ModalVoiceTest() {
    const [isOpenVoice, setIsOpenVoice] = React.useState(false)
    const [voice, setVoice] = React.useState([])
    const lineRef = React.useRef(0)

    React.useEffect(() => {
      if (!window.SpeechRecognition) return
      const recognition = new window.SpeechRecognition()

      recognition.interimResults = true
      recognition.lang = 'ja-JP'

      const voiceCopy = [...voice]

      recognition.addEventListener('result', (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) =>
            result.transcript
              .split('')
              .filter((tr) => tr.trim().length)
              .join(''),
          )
          .join('')

        if (event.results[0].isFinal) {
          const row = rows[lineRef.current]
            .split('')
            .filter((r) => r.trim().length)
            .join('')

          const isFit = row === transcript
          const fitCss = isFit
            ? {background: colors.cadetblue, color: colors.white}
            : {}

          const rowVoice = (
            <div css={{display: 'flex'}}>
              <p css={{fontSize: '1.5rem', ...fitCss}}>{transcript}</p>
              {row === transcript ? (
                <FaCheck
                  css={{
                    color: colors.cadetblue,
                    marginLeft: 5,
                  }}
                />
              ) : null}
            </div>
          )

          setVoice([...voiceCopy, rowVoice])
          lineRef.current++
        }
      })

      recognition.addEventListener('end', recognition.start)
      recognition.start()

      return () => {
        recognition.removeEventListener('end', recognition.start)
        recognition.stop()
      }
    }, [isOpenVoice, voice])

    return (
      <Modal>
        <ModalOpenButton
          onClick={() => {
            window.SpeechRecognition =
              window.SpeechRecognition || window.webkitSpeechRecognition

            setIsOpenVoice(true)
          }}
        >
          <Button aria-label="voice test" variant="secondary">
            <FaMicrophoneAlt />
          </Button>
        </ModalOpenButton>
        <ModalContents
          label="voice"
          onCloseProps={() => {
            window.SpeechRecognition = undefined
            lineRef.current = 0

            setVoice([])
            setIsOpenVoice(false)
          }}
          css={{
            width: '1000px',
            minHeight: '100vh',
            ['@media ' + mq.small]: {
              width: '100%',
            },
          }}
        >
          <h2
            css={{
              textAlign: 'center',
            }}
          >
            VOICE TEST
          </h2>
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {voice.map((voi) => voi)}
          </div>
        </ModalContents>
      </Modal>
    )
  }

  return (
    <div>
      <div
        css={{
          display: 'flex',
          height: '34px',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        {renderModalMemoTest()}
        <ModalVoiceTest />
      </div>
      <Video vi={song} autoPlay={0} css={{position: 'sticky', top: '0px'}} />
      {lyrics ? (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
            position: 'relative',
            background: colors.lyric,
          }}
          ref={lyricRef}
        >
          {isOpen && renderMeanOfNewWord()}
          {renderModalAddMeanOfNewWord()}
          <p
            css={{
              whiteSpace: 'pre',
              fontSize: '1.5rem',
              alignSelf: 'center',
              '&:hover': {
                cursor: 'pointer',
              },
              ['@media ' + mq.small]: {
                fontSize: '1rem',
              },
            }}
            dangerouslySetInnerHTML={{__html: newLyrics}}
            onMouseUp={handleLyricMouseUp}
            onMouseOver={handleNewWordHover}
          ></p>
        </div>
      ) : null}
    </div>
  )
}

export {Song}
