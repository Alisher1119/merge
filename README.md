# Object merge utility

This repository contains two utility functions, `mergeBy` and `linearMerge`, for merging objects in an array based on a
specified key or deep key. These functions can be particularly useful for consolidating data from various sources or handling data
transformation in applications.

## Functions

### `mergeBy`

Merges objects in an array based on a specified key or deep key. If two objects have the same key value, their properties are
combined.

#### Signature

```typescript
function mergeBy<T extends object>(array: T[], key: keyof T): T[]
```

## Parameters
### `array`: An array of objects to be merged.
### `key`: The key used to determine if two objects should be merged.

## Returns
An array of merged objects.

## Example

```typescript
const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 1, name: 'Alice', age: 31 }, // Duplicate ID with a different age
    { id: 3, name: 'Charlie', age: 35 },
];

const merged = mergeBy(data, 'id');
console.log(merged);
// { id: 1, name: 'Alice', age: 31 }, // Merged
// { id: 2, name: 'Bob', age: 25 },
// { id: 3, name: 'Charlie', age: 35 },

```

### `linearMerge`

Linear merges objects in an array based on a specified key or deep key. Compares only with the next item if exists. If two objects
have the same key value, their properties are combined using Object.assign or with mergeFn.

```typescript
function linearMerge<T extends object>(array: T[] = [], key: keyof T, mergeFn: (next: T, current: T) => T = Object.assign): T[]
```

## Parameters
### `array`: An array of objects to be merged.
### `key`: The key used to determine if two objects should be merged.
### `mergeFn`: An optional function to define how the merging should be performed. Defaults to Object.assign.

## Returns
An array of merged objects.

## Example

```typescript
import {linearMerge} from "./index";

const data = [
    {id: 1, name: 'Alice'},
    {id: 1, name: 'Alice Smith'},
    {id: 2, name: 'Bob'},
    {id: 2, name: 'Bob Brown'},
    {id: 3, name: 'Charlie'}
];

const merged = linearMerge(data, 'id');
console.log(merged);
// { id: 1, name: 'Alice' },
// { id: 2, name: 'Bob' },
// { id: 3, name: 'Charlie' }
```

```typescript
const data: Person[] = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 1, name: 'Alice Smith', age: 30 }
];

const customMerge = (next: Person, current: Person) => ({
    id: current.id,
    name: current.name + ' & ' + next.name,
    age: Math.max(current.age, next.age)
});

const merged = linearMerge<Person>(data, 'id', customMerge);
console.log(merged);
// { id: 1, name: 'Alice & Alice Smith', age: 30 }
```

## Installation

You can install this package via npm:

```bash
npm install merge-by-key
```
## Testing
You can set up tests using Jest to ensure that the functions work as expected. Here’s an example of how to write tests for these functions:

```bash
npx test
````
