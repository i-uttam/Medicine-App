---
name: Expo auth gate in splash screen
description: Pattern for checking auth state in the splash/index screen without needing a context provider.
---

## Rule
The splash screen (`app/index.tsx`) runs before context providers are mounted via `app/_layout.tsx`. Read AsyncStorage directly in the splash to determine the navigation destination.

**Why:** Expo Router renders `app/index.tsx` as the initial route before the layout mounts all providers. Using `useAuth()` context inside the splash would throw a "must be used within Provider" error.

**How to apply:**
```ts
async function getDestination(): Promise<'/login' | '/(tabs)'> {
  try {
    const auth = await AsyncStorage.getItem('@pharma_auth');
    return auth === 'true' ? '/(tabs)' : '/login';
  } catch {
    return '/login';
  }
}
```
Call this after the splash animation completes, then `router.replace(dest)`.
