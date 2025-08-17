import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
// import { useTrpx } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

// export const maxDuration = 60; // seconds
// export const dynamic = 'force-dynamic';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
