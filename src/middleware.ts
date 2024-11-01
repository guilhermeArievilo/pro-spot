import {
  auth,
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import usePageModel from './application/modules/pages/presentation/models/page-model';
import StrapiPagesApiRepository from './infra/http/strapi/pages/repository/strapi-pages-api-repository';
import { GraphQlClient } from './infra/http/onClientApolloService';
import axiosInstance from './infra/http/axiosService';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isNotPageRout = createRouteMatcher(['/dashboard(.*)', '/auth(.*)', '/']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  if (!isNotPageRout(req)) {
    const pageRepository = new StrapiPagesApiRepository(
      GraphQlClient,
      axiosInstance
    );

    const { addViewToPage } = usePageModel({
      pageRepository
    });

    try {
      await addViewToPage(req.nextUrl.pathname.slice(1));
    } catch (e) {
      console.log(e);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
