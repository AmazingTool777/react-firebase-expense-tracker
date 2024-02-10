// Options of the merge of 2 arrays
export type MergeArraysOptions = {
  // Unique key within the array of objects that identifies each object in the list
  uniqueKey: string;
};

/**
 * Merges 2 arrays of objects
 *
 * @param originalArray The original array
 * @param incomingArray The array to be merged with the original array
 */
export function mergeObjectsArrays<T extends Record<string, unknown>>(
  originalArray: T[],
  incomingArray: T[],
  options: MergeArraysOptions
) {
  const originalArrayKeys = new Set();
  for (const item of originalArray) {
    if (options.uniqueKey in item) {
      originalArrayKeys.add(item[options.uniqueKey]);
    }
  }
  const merge = [...originalArray];
  for (const item of incomingArray) {
    if (
      options.uniqueKey in item &&
      originalArrayKeys.has(item[options.uniqueKey])
    ) {
      continue;
    }
    merge.push(item);
  }
  return merge;
}
