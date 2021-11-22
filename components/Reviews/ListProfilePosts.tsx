import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import TimeAgo from 'react-timeago'
import Loader from '@/components/Skeleton'

// Component: ListProfilePosts()
// Params: none
// Purpose: To list the review posts specific to
// the logged in user. This component live updates every second

export default function ListReviewPosts() {
  const { data, error } = useSWR('/api/reviewposts/userfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <p>
        Oops. Looks like your profile is not being fetched right now. If this
        persists, please let us know.
      </p>
    )
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div>
      {data.reviewPosts.length === 0 && (
        <Link href="/courses">Write your first review!</Link>
      )}
      {data.reviewPosts.map((post) => (
        <ReviewPostCard
          key={post._id}
          reviewPostId={post._id}
          creator={post.creator}
          creatorEmail={post.creatorEmail}
          creatorId={post.creatorId}
          courseId={post.courseId}
          course={post.course}
          reviewPost={post.reviewPost}
          reviewProfessor={post.reviewProfessor}
          taken={post.taken}
          difficulty={post.difficulty}
          anonymous={post.anonymous}
          timestamp={<TimeAgo date={post.createdAt} />}
        />
      ))}
    </div>
  )
}
