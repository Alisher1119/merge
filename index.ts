import {get} from "get-deep-value-by-key";

function mergeBy<T extends object>(array: T[] = [], key: string): T[] {
    return array.reduce((acc: T[], current: T): T[] => {
        const existing = acc.find((item: T) => {
            return get(item, key) === get(current, key);
        });
        if (existing) {
            Object.assign(existing, current);
        } else {
            acc.push({...current});
        }
        return acc;
    }, []);
}

function linearMerge<T extends object>(array: T[] = [], key: string, mergeFn: (next: T, current: T) => T = Object.assign): T[] {
    return array.reduce((acc: T[], currentItem: T, currentIndex): T[] => {
        const hasNext = array.length > currentIndex + 1;

        if (hasNext) {
            const nextItem = array[currentIndex + 1];
            if (get(currentItem, key) === get(nextItem, key)) {
                Object.assign(nextItem, mergeFn(nextItem, currentItem));
            } else {
                acc.push({...currentItem});
            }
        } else {
            acc.push({...currentItem});
        }

        return acc;
    }, []);
}

export {mergeBy, linearMerge};