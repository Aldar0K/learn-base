import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/entities/auth";
import { baseApi } from "./store";

const makeStoreInternal = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStoreInternal>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Определяем PreloadedState самостоятельно
export type PreloadedState = Partial<RootState>;

export const makeStore = (preloadedState?: PreloadedState) => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  // Если есть preloadedState, создаем store с ним
  if (preloadedState) {
    return configureStore({
      reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState: preloadedState as RootState,
    });
  }

  return store;
};
