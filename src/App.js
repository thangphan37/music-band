/**@jsx jsx */
import {jsx, Global} from '@emotion/react'
import * as React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import {Discover} from 'screens/discover'
import {Crawl} from 'screens/crawl'
import {Song} from 'screens/song'
import {NotFound} from 'screens/not-found'
import {FaMusic} from 'react-icons/fa'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'

function AppRoutes({isOpen}) {
  return (
    <Routes>
      <Route path="/" element={<Crawl />} />
      <Route path="/discover" element={<Discover isOpen={isOpen} />} />
      <Route path="/song/:singerName/:songId" element={<Song />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function calculateBg(pathname) {
  if (pathname.includes('/discover')) {
    return colors.bgDiscover
  } else if (pathname.includes('/song')) {
    return colors.bgSong
  } else {
    return colors.bgCrawl
  }
}

function App() {
  const [isOpen, setIsOpen] = React.useState(false)
  const {pathname} = useLocation()
  const bgColor = calculateBg(pathname)

  return (
    <>
      <Global
        styles={{
          body: {
            background: bgColor,
          },
        }}
      />
      <div
        css={{
          maxWidth: '840px',
          margin: '3rem auto',
          ['@media ' + mq.small]: {
            width: '100%',
            margin: '0',
            padding: '0.625em',
            backgroundColor: isOpen ? colors.bgSmall : 'unset',
          },
        }}
      >
        {pathname.includes('/discover') ? (
          <div
            css={{
              display: 'none',
              ['@media ' + mq.small]: {
                display: 'block',
                marginBottom: '0.5rem',
              },
            }}
          >
            <FaMusic onClick={() => setIsOpen((p) => !p)} />
          </div>
        ) : null}
        <AppRoutes isOpen={isOpen} />
      </div>
    </>
  )
}

export default App
