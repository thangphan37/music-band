/**@jsx jsx */
import {jsx, keyframes} from '@emotion/react'
import {FaSpinner, FaCaretRight, FaCaretLeft} from 'react-icons/fa'
import styled from '@emotion/styled'
import * as colors from 'styles/colors'

const Input = styled.input({
  border: 'none',
  background: 'rgb(241, 242, 247)',
  padding: '10px',
})

const spinner = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

const Spinner = styled(FaSpinner)({
  animation: `${spinner} 0.6s linear infinite`,
})

Spinner.defaultProps = {
  'aria-label': 'loading',
}

function FullFallbackSpinner() {
  return (
    <div
      aria-label="loading"
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spinner css={{fontSize: '5rem'}} />
    </div>
  )
}

function FormGroup(props: {children: JSX.Element[]; [k: string]: any}) {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
      {...props}
    />
  )
}

function ErrorMessage({error}: {error: {message: string}}) {
  return (
    <div
      role="alert"
      css={{
        color: colors.red,
      }}
    >
      {error.message}
    </div>
  )
}

const pageButton = ({disabled}: {disabled: boolean}) => ({
  color: disabled ? colors.wheat : 'unset',
  fontSize: '5rem',
  '&:hover': {
    cursor: 'pointer',
  },
})

const buttonVariants = {
  primary: {
    background: colors.cadetblue,
    color: colors.white,
  },
  secondary: {
    background: colors.secondary,
    color: colors.white,
  },
  disabled: {
    background: colors.gray,
    color: colors.white,
  },
}

const Button = styled.button(
  {
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
  },
  ({variant = 'primary'}: {variant: 'primary' | 'secondary' | 'disabled'}) =>
    buttonVariants[variant],
)

const CircleButton = styled(Button)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  background: 'none',
  width: '40px',
  height: '40px',
  color: colors.circle,
  border: `solid 1px ${colors.gray10}`,
})

const PrevButton = styled(FaCaretLeft)(pageButton)
const NextButton = styled(FaCaretRight)(pageButton)

export {
  Spinner,
  FullFallbackSpinner,
  Input,
  PrevButton,
  NextButton,
  CircleButton,
  Button,
  FormGroup,
  ErrorMessage,
}
