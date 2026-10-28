import { QueryClient } from "@tanstack/react-query";
import {
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const history =
    typeof window !== "undefined"
      ? createHashHistory()
      : undefined;

  const router = createRouter({
    routeTree,
    ...(history ? { history } : {}),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
