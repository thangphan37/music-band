/**@jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'react-router-dom'
import {FaDownload, FaCcDiscover, FaRegKiss} from 'react-icons/fa'
import * as colors from 'styles/colors'

function RouterLink({to, icon, routeName, background} = {}) {
  return (
    <li
      css={{
        background,
      }}
    >
      <Link
        to={to}
        css={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
        {routeName}
      </Link>
    </li>
  )
}
function HomePage() {
  return (
    <ul
      css={{
        listStyle: 'none',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        '> li': {
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '5rem',
          width: '100%',
        },
      }}
    >
      <RouterLink
        to="crawl"
        background={colors.bgCrawl}
        icon={<FaDownload css={{marginRight: 3}} />}
        routeName="Crawl"
      />
      <RouterLink
        to="discover"
        background={colors.bgDiscover}
        icon={<FaCcDiscover css={{marginRight: 3}} />}
        routeName="Discover"
      />
      <RouterLink
        to="good-job"
        background={colors.bgGoodJob}
        icon={<FaRegKiss css={{marginRight: 3}} />}
        routeName="GoodJob"
      />
    </ul>
  )
}

export {HomePage}
