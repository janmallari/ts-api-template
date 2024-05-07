// convert property names of an object from camelCase to snake_case
export function camelToSnake(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // @ts-expect-error: Property names conversion, assume camelToSnake is defined
      newObj[camelToSnake(key)] = obj[key];
    }
  }
  return newObj;
}
