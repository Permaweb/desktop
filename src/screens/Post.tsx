import React from 'react'
import { observer, inject } from 'mobx-react'
import PostCard from '../components/PostCard'
import MOCK_FILES from '../mocks/files.json'

const POST_ENFORCE_INTERFACE = {
  groupId: -1,
  id: -1,
  lastModified: 0,
  author: 'Error',
  title: 'Error',
  content: 'Error',
  comments: [],
  shares: [],
  reactions: []
}

function usePost(postId: string) {
  const post = {
    ...POST_ENFORCE_INTERFACE,
    ...MOCK_FILES.find(post => post.postId === postId)
  }
  return { post }
}

function Post({ postId }: { postId: string }) {
  const { post } = usePost(postId)

  return <PostCard post={post} />
}

export default inject('store')(
  observer(({ match: { params: { postId } } }) => <Post postId={postId} />)
)