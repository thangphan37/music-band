/**@jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import {Button, FormGroup, Input, Spinner, ErrorMessage} from 'components/lib'
import {client} from 'utils/api-client'
import {useMutation, useQueryClient} from 'react-query'
import {useSingers} from 'utils/discover'
import {Link} from 'react-router-dom'
import {FaCcDiscover} from 'react-icons/fa'
import * as colors from 'styles/colors'
import * as mq from 'styles/media-queries'

function InputCrawl(props) {
  return (
    <Input
      {...props}
      css={{
        border: `solid 1px ${colors.border}`,
      }}
    />
  )
}

function SingerForm() {
  const queryClient = useQueryClient()
  const {
    mutateAsync: create,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation((data) => client(`crawl`, {data}), {
    onSuccess: () => queryClient.refetchQueries('singers'),
  })

  function handleSubmit(event) {
    event.preventDefault()
    const {singer, playlist, avatar} = event.target.elements

    create({
      singerName: singer.value,
      playlist: playlist.value,
      avatar: avatar.value,
    })
  }

  return (
    <form
      css={{
        '> div': {
          marginTop: '10px',
        },
      }}
      onSubmit={handleSubmit}
    >
      <h2>Playlist</h2>
      <FormGroup>
        <label htmlFor="singer">Singer:</label>
        <InputCrawl id="singer" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="avatar">Avatar:</label>
        <InputCrawl id="avatar" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="playlist">Link:</label>
        <InputCrawl id="playlist" />
      </FormGroup>
      <div>
        <Button>
          Crawl
          {isLoading ? <Spinner css={{marginLeft: '5px'}} /> : null}
        </Button>
      </div>
      {isSuccess ? <p css={{color: colors.cadetblue}}>Success!</p> : null}
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

const type_inputs = {
  INPUT: 'input',
  SELECT: 'select',
}

function CustomForm() {
  const [typeInput, setTypeInput] = React.useState(type_inputs.INPUT)

  const queryClient = useQueryClient()
  const {data} = useSingers()

  const {
    mutateAsync: createCustom,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation((data) => client(`singer`, {data}), {
    onSuccess: () => queryClient.refetchQueries('singers'),
  })

  const hasSinger = typeInput === type_inputs.SELECT && data?.singers.length
  const hasInputSinger = typeInput === type_inputs.INPUT

  function handleSubmitCustom(event) {
    event.preventDefault()
    const {singerName, avatarCustom, songName, songHref} = event.target.elements
    const payload = {
      singerName: singerName.value,
      songName: songName.value,
      songHref: songHref.value,
    }

    if (hasInputSinger) {
      payload.avatar = avatarCustom.value
    }

    createCustom(payload)
  }

  function handleChangeTypeInput() {
    setTypeInput(hasInputSinger ? type_inputs.SELECT : type_inputs.INPUT)
  }

  return (
    <form
      css={{
        '> div': {
          marginTop: '10px',
        },
      }}
      onSubmit={handleSubmitCustom}
    >
      <h2>Custom</h2>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <label htmlFor="typeInput" css={{marginBottom: 0}}>
          Available
        </label>
        <Input
          type="checkbox"
          id="typeInput"
          onChange={handleChangeTypeInput}
          css={{marginLeft: 5}}
        />
      </div>
      <FormGroup>
        <label htmlFor="singerName">SingerName:</label>

        {hasSinger ? (
          <select id="singerName">
            {data?.singers.map((si, i) => (
              <option key={`${si}-${i}`}>{si.name}</option>
            ))}
          </select>
        ) : (
          <InputCrawl id="singerName" />
        )}
      </FormGroup>
      {hasSinger ? null : (
        <FormGroup>
          <label htmlFor="avatarCustom">Avatar:</label>
          <InputCrawl id="avatarCustom" />
        </FormGroup>
      )}
      <FormGroup>
        <label htmlFor="songName">Song name:</label>
        <InputCrawl id="songName" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="songHref">Link:</label>
        <InputCrawl id="songHref" />
      </FormGroup>
      <div>
        <Button variant="secondary">
          Add
          {isLoading ? <Spinner css={{marginLeft: 5}} /> : null}
        </Button>
      </div>
      {isSuccess ? <p css={{color: colors.cadetblue}}>Success!</p> : null}
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

function Crawl() {
  return (
    <div>
      <Link
        to="/discover"
        css={{
          display: 'flex',
          justifyContent: 'center',
          color: 'unset',
          fontSize: '5rem',
          marginBottom: '2rem',
          '&:hover': {
            color: colors.cadetblue,
          },
        }}
      >
        <FaCcDiscover />
      </Link>
      <div
        css={{
          display: 'grid',
          gridGap: '10px',
          gridTemplateColumns: 'repeat(2, 1fr)',
          justifyContent: 'center',
          ['@media ' + mq.small]: {
            gridTemplateColumns: 'auto',
            justifyContent: 'normal',
          },
        }}
      >
        <SingerForm />
        <CustomForm />
      </div>
    </div>
  )
}

export {Crawl}
