import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';

import { Discussions } from './_components/discussions';

// Metadata for the Discussions page
export const metadata = {
  title: 'Discussions',
  description: 'Discussions',
};

// DiscussionsPage component with data prefetching and hydration
const DiscussionsPage = async ({
  searchParams,
}: {
  searchParams: { page: string | null };
}) => {
  const queryClient = new QueryClient();

  // Prefetch discussions data based on the page number
  await queryClient.prefetchQuery(
    getDiscussionsQueryOptions({
      page: searchParams.page ? Number(searchParams.page) : 1,
    }),
  );

  // Dehydrate the query client state for server-side rendering
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Discussions />
    </HydrationBoundary>
  );
};

export default DiscussionsPage;
