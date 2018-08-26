export const isString = (val: unknown): val is string => typeof val === 'string';
export const isCanvasEl = (el: unknown): el is HTMLCanvasElement => el != null && el instanceof HTMLCanvasElement;
