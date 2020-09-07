import {User} from './user'

export class Post {
  id: string
  body: string
  sender: User
  hash: string
  created_at: string

  constructor(fields?: {
    id: string,
    body: string,
    sender: User,
    hash: string,
    created_at: string
  }) {
    this.id = `${fields.sender.name.split(' ').join('-')}-${fields.hash}`
    this.body = fields?.body
    this.sender = fields?.sender
    this.hash = fields?.hash
    this.created_at = fields?.created_at
  }
}