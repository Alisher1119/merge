import { mergeBy, linearMerge } from './index';

interface Person {
    id: number;
    name: string;
    age: number;
}

describe('mergeBy Function', () => {
    const array: Person[] = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 1, name: 'Alice', age: 31 }, // Duplicate ID with a different age
        { id: 3, name: 'Charlie', age: 35 },
    ];

    test('should merge objects with the same key', () => {
        const result = mergeBy<Person>(array, 'id');

        expect(result).toHaveLength(3);
        expect(result).toEqual([
            { id: 1, name: 'Alice', age: 31 }, // Merged
            { id: 2, name: 'Bob', age: 25 },
            { id: 3, name: 'Charlie', age: 35 },
        ]);
    });

    test('should handle an empty array', () => {
        const result = mergeBy([], 'id');
        expect(result).toEqual([]);
    });

    test('should return a new array without mutating the original', () => {
        const originalArray = [...array];
        const result = mergeBy(array, 'id');

        expect(result).not.toBe(originalArray); // Different reference
        expect(originalArray).toEqual(array); // Original should remain unchanged
    });

    test('should not merge if keys are different', () => {
        const arrayWithDifferentKeys: Person[] = [
            { id: 1, name: 'Alice', age: 30 },
            { id: 1, name: 'Alicia', age: 31 }, // Same ID, different name
        ];

        const result = mergeBy<Person>(arrayWithDifferentKeys, 'id');

        expect(result).toHaveLength(1);
        expect(result).toEqual([
            { id: 1, name: 'Alicia', age: 31 }, // The last one should be kept
        ]);
    });
});

describe('linearMerge', () => {
    it('merges adjacent objects with the same key', () => {
        const data = [
            { id: 1, name: 'Alice' },
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob' },
            { id: 2, name: 'Bob Brown' },
            { id: 3, name: 'Charlie' }
        ];

        const merged = linearMerge(data, 'id');

        expect(merged).toEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ]);
    });

    it('handles an empty array', () => {
        const merged = linearMerge([], 'id');
        expect(merged).toEqual([]);
    });

    it('does not merge when keys are different', () => {
        const data = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ];

        const merged = linearMerge(data, 'id');

        expect(merged).toEqual(data);
    });

    it('uses a custom merge function', () => {
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

        expect(merged).toEqual([
            { id: 1, name: 'Alice & Alice Smith', age: 30 }
        ]);
    });
});