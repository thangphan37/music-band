/**@jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'react-router-dom'

function NotFound() {
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 6rem)',
      }}
    >
      <p>
        Sorry... nothing here. <Link to="/">Go home</Link>
      </p>
    </div>
  )
}

export {NotFound}
