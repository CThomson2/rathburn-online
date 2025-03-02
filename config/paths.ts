// This file defines a centralized configuration object for generating consistent URL paths across the application.
export const paths = {
  home: {
    getHref: () => "/",
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
  },

  data: {
    root: {
      getHref: () => "/dashboard",
    },
    drumStock: {
      getHref: () => "/dashboard/drum-stock",
    },
    production: {
      getHref: () => "/dashboard/production",
    },
    finishedGoods: {
      getHref: () => "/dashboard/finished-goods",
    },
  },

  public: {
    discussion: {
      getHref: (id: string) => `/public/discussions/${id}`,
    },
  },
} as const;
