/**@jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx, Global} from '@emotion/react'
import * as React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import {Discover} from 'screens/discover'
import {Crawl} from 'screens/crawl'
import {Song} from 'screens/song'
import {NotFound} from 'screens/not-found'
import {HomePage} from 'screens/home-page'
import {GoodJob} from 'screens/good-job'
import {FaMusic} from 'react-icons/fa'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'

const paths = {
  HOME_PAGE: '/',
  DISCOVER: '/discover',
  SONG: '/song',
  CRAWL: '/crawl',
  GOODJOB: '/good-job',
}

function AppRoutes({isOpen}: {isOpen: boolean}) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/crawl" element={<Crawl />} />
      <Route path="/discover" element={<Discover isOpen={isOpen} />} />
      <Route path="/good-job" element={<GoodJob />} />
      <Route path="/song/:singerName/:songId" element={<Song />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function calculateBg(pathname: string) {
  if (pathname.includes(paths.DISCOVER)) {
    return colors.bgDiscover
  } else if (pathname.includes(paths.SONG)) {
    return colors.bgSong
  } else if (pathname.includes(paths.CRAWL)) {
    return colors.bgCrawl
  } else if (pathname.includes(paths.GOODJOB)) {
    return colors.bgGoodJob
  }
}

function App() {
  const [isOpen, setIsOpen] = React.useState(false)
  const {pathname} = useLocation()
  const bgColor = calculateBg(pathname)
  const isHomePage = pathname === paths.HOME_PAGE

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
          maxWidth: isHomePage ? 'unset' : '840px',
          margin: isHomePage ? '0' : '3rem auto',
          [mq.small]: {
            width: '100%',
            margin: '0',
            padding: '0.625em',
            backgroundColor: isOpen ? colors.bgSmall : 'unset',
          },
          [mq.medium]: {
            maxWidth: '736px',
          },
        }}
      >
        {pathname.includes(paths.DISCOVER) ? (
          <div
            css={{
              display: 'none',
              [mq.small]: {
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
