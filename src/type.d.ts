type Singer = {
  _id: string
  avatar: string
  name: string
  history: Array<History>
  song: Array<Song>
  updatedAt: string
}

type Vocabulary = {
  _id: string
  en: string
  jp: string
  vi: string
}

type Song = {
  _id: string
  hasRemembered: boolean
  href: string
  level: string
  lyrics: string
  song: string
  rememberedDate: string
  vocabulary: Array<Vocabulary>
}

type History = {
  _id: string
  name: string
}

type EventElements = {
  elements: {[k: string]: HTMLInputElement}
}

export {Singer, Song, History, EventElements, Vocabulary}
