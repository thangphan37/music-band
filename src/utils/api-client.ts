const apiURL = process.env.REACT_APP_MUSIC_API

type configType = {
  headers?: {[k: string]: any}
  data?: any
  [anythingWeWant: string]: any
}

function client(
  endpoint: string,
  {headers: customHeaders, data, ...customConfig}: configType = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    ...customConfig,
  }

  return window
    .fetch(`${apiURL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json()

      if (response.ok) {
        return data
      }

      return Promise.reject(data)
    })
}

export {client}
