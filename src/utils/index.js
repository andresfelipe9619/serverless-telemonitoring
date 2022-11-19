export function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }
  
  export const map2select = ([value, label]) => ({ label, value });
  
  export function pluralize(word, count) {
    return `${word}${count === 1 ? "" : "s"}`;
  }
  
  export function nullifyObjectEmptyStrings(object) {
    return Object.entries(object).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: replaceEmptyStringWithNull(value),
      }),
      {}
    );
  }
  
  export function replaceEmptyStringWithNull(value) {
    if (!value) return null;
    return value;
  }
  
  export const isDate = (item) =>
    isNaN(item) && new Date(item) !== "Invalid Date" && !isNaN(new Date(item));
  
  export const isObject = (item) => !!item && typeof item === "object";
  
  export const isBoolean = (item) => typeof item === "boolean";
  
  export const isNullish = (item) => typeof item === "undefined" || item === null;