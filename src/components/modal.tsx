/**@jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {Dialog} from '@reach/dialog'
import {CircleButton} from 'components/lib'
import VisuallyHidden from '@reach/visually-hidden'

type ModalContextType = [isOpen: boolean, setIsOpen: React.Dispatch<boolean>]

const allFns = (
  ...fns: Array<
    (void | undefined) | ((event?: React.MouseEvent<HTMLElement>) => void)
  >
) => (...args: any[]) => fns.forEach((fn) => fn && fn(...args))
const ModalContext = React.createContext<ModalContextType | null>(null)

function Modal({children}: {children: Array<JSX.Element>}) {
  const [isOpen, setIsOpen] = React.useState(false)

  const value: ModalContextType = [isOpen, setIsOpen]
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

function useModalContext() {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error('useModalContext must be within ModalContext Provider')
  }

  return context
}

function ModalContents({
  children,
  label,
  onCloseProps,
  isHideButtonProps = false,
  ...props
}: {
  children: Array<JSX.Element>
  label: string
  onCloseProps?: () => void | undefined
  isHideButtonProps?: boolean
  [otherProps: string]: any
}) {
  const [isOpen, setIsOpen] = useModalContext()
  const close = () => setIsOpen(false)

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={allFns(close, onCloseProps)}
      {...props}
      aria-label={label}
    >
      {!isHideButtonProps && (
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          <CircleButton
            variant="primary"
            className="close-button"
            onClick={allFns(close, onCloseProps)}
          >
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
      )}
      {(Array.isArray(children) ? children : [children]).map((child, index) =>
        child.props?.onSubmit
          ? React.cloneElement(child, {
              onSubmit: allFns(child.props.onSubmit, close),
              key: index,
            })
          : child,
      )}
    </Dialog>
  )
}

function ModalCloseButton({
  children,
  onClick,
}: {
  children: JSX.Element
  onClick?: ((event?: React.MouseEvent<HTMLElement>) => void) | undefined
}) {
  const [, setIsOpen] = useModalContext()
  const close = () => setIsOpen(false)

  return React.cloneElement(children, {
    onClick: allFns(close, onClick),
  })
}

function ModalOpenButton({
  children,
  onClick,
  ...otherProps
}: {
  children: JSX.Element
  onClick?: ((event?: React.MouseEvent<HTMLElement>) => void) | undefined
  [otherProps: string]: any
}) {
  const [, setIsOpen] = useModalContext()
  const open = () => setIsOpen(true)

  return React.cloneElement(children, {
    onClick: allFns(open, onClick),
    ...otherProps,
  })
}

export {Modal, ModalCloseButton, ModalOpenButton, ModalContents}
