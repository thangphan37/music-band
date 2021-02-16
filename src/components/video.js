/**@jsx jsx */
import {jsx} from '@emotion/react'

function Video({vi, autoPlay = 0, ...otherProps} = {}) {
  return (
    <iframe
      width="100%"
      allow="autoplay; encrypted-media"
      height="315"
      allowFullScreen={true}
      src={vi?.href.replace('watch?v=', 'embed/') + `?autoplay=${autoPlay}`}
      title={vi?.song}
      css={{
        border: 'none',
        borderRadius: '3px',
        display: 'block',
      }}
      {...otherProps}
    />
  )
}

export {Video}
