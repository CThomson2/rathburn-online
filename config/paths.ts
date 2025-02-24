// This file defines a centralized configuration object for generating consistent URL paths across the application.
export const paths = {
  home: {
    getHref: () => "/",
  },

  // auth: {
  //   register: {
  //     getHref: (redirectTo?: string | null | undefined) =>
  //       `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  //   },
  //   login: {
  //     getHref: (redirectTo?: string | null | undefined) =>
  //       `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  //   },
  // },

  dashboard: {
    getHref: () => "/dashboard",
  },
  inventory: {
    getHref: () => "/inventory",
  },
  // public: {
  //   discussion: {
  //     getHref: (id: string) => `/public/discussions/${id}`,
  //   },
  // },
} as const;
