---
name: Expo FlatList renderItem null crash
description: FlatList crashes at runtime if renderItem is null or undefined; use ScrollView for static content sections.
---

## Rule
Never pass `renderItem={null}` to a `FlatList`. React Native throws an invariant violation at runtime ("You must provide a renderItem function"), even though TypeScript may not catch it.

**Why:** FlatList is a virtualized list component designed for data rendering. When you want a "header-only" state (no query typed yet in search), use a plain `ScrollView` instead of a `FlatList` with empty data and null renderItem.

**How to apply:** In any screen with a conditional list/content split (e.g. search: home state vs results state), render two separate components — a `ScrollView` for the empty/home state, and a `FlatList` for the results state — selected with a ternary.
