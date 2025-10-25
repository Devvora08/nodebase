import { caller, getQueryClient, trpc } from '@/trpc/server'
import React, { Suspense } from 'react'
import { Client } from './client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const Page = async () => {

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Client/>
        </Suspense> 
      </HydrationBoundary>
    </div>
  )
}

export default Page