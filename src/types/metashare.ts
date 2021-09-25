import type { DBSchema } from 'idb'

export interface IMetashareDB extends DBSchema {
  posts: {
    key: string
    value: {
      image?: string
      title?: string
      description?: string
      links?: string[]
    }
  }
}

export interface IMetaRequestPosts {
  type: 'request-posts'
}

export interface IMetaResponsePosts {
  type: 'response-posts'
  data: string[]
}

export interface IMetaRequestPost {
  type: 'request-post'
  id: string
}

export interface IMetaResponsePost {
  type: 'response-post'
  id: string
  data: string[]
}

export type IMetaMessage = IMetaRequestPosts | IMetaResponsePosts | IMetaRequestPost | IMetaResponsePost

export interface IPostMeta {
  meta: Meta
  jsonLD: JsonLd
  headers: Headers
  status: Status
}

interface Meta {
  viewport: string
  'imdb:pageType': string
  'imdb:subPageType': string
  'imdb:pageConst': string
  description: string
  'og:url': string
  'og:site_name': string
  'og:title': string
  'og:description': string
  'og:type': string
  'og:image': string
  'og:image:height': string
  'og:image:width': string
  'twitter:site': string
  'twitter:title': string
  'twitter:description': string
  'twitter:card': string
  'twitter:image': string
  'twitter:image:alt': string
}

interface JsonLd {
  '@context': string
  '@type': string
  url: string
  name: string
  image: string
  description: string
  review: Review
  aggregateRating: AggregateRating
  contentRating: string
  genre: string[]
  datePublished: string
  keywords: string
  trailer: Trailer
  actor: Actor[]
  director: Director[]
  creator: Creator[]
  duration: string
}

interface Review {
  '@type': string
  itemReviewed: ItemReviewed
  author: Author
  dateCreated: string
  inLanguage: string
  name: string
  reviewBody: string
  reviewRating: ReviewRating
}

interface ItemReviewed {
  '@type': string
  url: string
}

interface Author {
  '@type': string
  name: string
}

interface ReviewRating {
  '@type': string
  worstRating: number
  bestRating: number
  ratingValue: number
}

interface AggregateRating {
  '@type': string
  ratingCount: number
  bestRating: number
  worstRating: number
  ratingValue: number
}

interface Trailer {
  '@type': string
  name: string
  embedUrl: string
  thumbnail: Thumbnail
  thumbnailUrl: string
  description: string
}

interface Thumbnail {
  '@type': string
  contentUrl: string
}

interface Actor {
  '@type': string
  url: string
  name: string
}

interface Director {
  '@type': string
  url: string
  name: string
}

interface Creator {
  '@type': string
  url: string
  name?: string
}

interface Headers {
  connection: string[]
  'content-encoding': string[]
  'content-type': string[]
  date: string[]
  etag: string[]
  'permissions-policy': string[]
  server: string[]
  'set-cookie': string[]
  'strict-transport-security': string[]
  'transfer-encoding': string[]
  vary: string[]
  via: string[]
  'x-amz-cf-id': string[]
  'x-amz-cf-pop': string[]
  'x-amz-rid': string[]
  'x-cache': string[]
  'x-frame-options': string[]
  'x-imdb-oloc': string[]
  'x-xss-protection': string[]
}

export interface Status {
  code: number
  message: string
}
