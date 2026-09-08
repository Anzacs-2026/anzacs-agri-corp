interface FilterableQuery<T> {
  is: (column: string, value: null) => T
}

export const withActiveOnly = <T extends FilterableQuery<T>>(query: T): T => query.is('deleted_at', null)
