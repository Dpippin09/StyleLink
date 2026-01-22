// Stub file to prevent Vercel build errors when expo-router is imported
// This file provides empty exports for expo-router components

export const Tabs = () => null;
export const Stack = () => null;
export const Drawer = () => null;
export const router = {
  push: () => {},
  replace: () => {},
  back: () => {},
  dismiss: () => {}
};
export const useRouter = () => router;
export const useLocalSearchParams = () => ({});
export const useGlobalSearchParams = () => ({});
export const useFocusEffect = () => {};
export const useNavigation = () => ({});
export const Link = () => null;
export const Redirect = () => null;
export const Slot = () => null;
export const withLayoutContext = () => () => null;

export default {
  Tabs,
  Stack,
  Drawer,
  router,
  useRouter,
  useLocalSearchParams,
  useGlobalSearchParams,
  useFocusEffect,
  useNavigation,
  Link,
  Redirect,
  Slot,
  withLayoutContext
};
