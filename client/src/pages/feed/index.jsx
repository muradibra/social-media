import React from 'react';
import { FEED_QUERY_KEY } from '@/constants/query-keys';
import { getFeed } from '@/services/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Heading } from './components/Heading';
import { PostsFilter } from './components/Filter';
import { PostsWrapper } from './components/PostsWrapper';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostCard } from '@/components/shared/post-card';
import Spinner from '@/components/shared/spinner';

const FeedPage = () => {
  // const [searchParams] = useSearchParams();
  // const search = searchParams.get("search") ?? "";
  // const sort = searchParams.get("sort") ?? "";
  // const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery({
  //     queryKey: [FEED_QUERY_KEY, search, sort],
  //     queryFn: ({ pageParam }) => getFeed({ pageParam, search, sort }),
  //     initialPageParam: 1,
  //     getNextPageParam: (lastPage) => {
  //       const { count, page, limit } = lastPage;
  //       const hasMore = count > page * limit;
  //       return hasMore ? page + 1 : undefined;
  //     },
  //     refetchOnWindowFocus: false,
  //   });

  // const { pages } = data ?? {};

  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }
  // console.log(pages);


  return (
    <div className="mx-auto max-w-screen-lg px-4 md:px-10 py-10">
      FeedPage
      {/* <Heading total={pages?.[0]?.count ?? 0} />
      <PostsFilter />
      <PostsWrapper>
        <InfiniteScroll
          dataLength={pages?.length ?? 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          hasChildren={!!pages}
          loader={
            <div className="text-center">
              <Spinner size={24} />
            </div>
          }
          endMessage={
            pages && (
              <p className="text-muted-foreground font-semibold text-sm text-center">
                Yay! You have seen it all
              </p>
            )
          }
          className="flex flex-col gap-5 px-4"
        >
          {pages?.map((page) =>
            page.items.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </InfiniteScroll>
        {isLoading && (
          <>
            <PostCard.Skeleton />
            <PostCard.Skeleton />
          </>
        )}
      </PostsWrapper> */}
    </div>
  );
};

export default FeedPage;