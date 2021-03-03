/**@jsx jsx */
import {jsx} from '@emotion/react'
import type {Song} from 'type'

function SongItem({
  itemSong,
  autoPlay = 0,
  ...otherProps
}: {
  itemSong?: Song
  autoPlay?: number
  [k: string]: any
} = {}) {
  return (
    <iframe
      width="100%"
      allow="autoplay; encrypted-media"
      height="315"
      allowFullScreen={true}
      src={
        itemSong?.href.replace('watch?v=', 'embed/') + `?autoplay=${autoPlay}`
      }
      title={itemSong?.song}
      css={{
        border: 'none',
        borderRadius: '3px',
        display: 'block',
      }}
      {...otherProps}
    />
  )
}

export {SongItem}
