const apiURL = process.env.REACT_APP_MUSIC_API

function client(endpoint, {headers, data, ...customConfig} = {}) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
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
