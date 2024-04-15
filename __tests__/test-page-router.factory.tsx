import React from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

export class TestPageRouterFactory {
  static create(pageComponent: React.FC) {
    const rootRoute = createRootRoute({
      component: Outlet,
    });
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: pageComponent,
    });
    const routeTree = rootRoute.addChildren([indexRoute]);
    const router = createRouter({
      routeTree,
      history: createMemoryHistory(),
    });
    return router;
  }
}
