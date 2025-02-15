export function includes<T extends U, U>(
  list: ReadonlyArray<T>,
  item: U,
): item is T {
  return list.includes(item as T);
}
