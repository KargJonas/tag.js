export const isString = value => typeof value === 'string' || value instanceof String;
export const isRawObject = value => value && value.constructor === Object;
export const isNode = value => value instanceof HTMLElement;
export const isArrayLike = value => !isString(value) && Symbol.iterator in Object(value);
export const isNothing = value => !value && value !== 0;
export const isRenderable = value => !isRawObject(value) && !isNothing(value);