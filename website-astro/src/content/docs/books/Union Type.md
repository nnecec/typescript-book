---
title: Union Type
sidebar:
  order: 29
  label: 29. Union Type
---

A Union Type is a type that represents a value that can be one of several types. Union Types are denoted using the `|` symbol between each possible type.

```typescript
let x: string | number;
x = 'hello'; // Valid
x = 123; // Valid
```
