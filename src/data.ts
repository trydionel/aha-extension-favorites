import { FIELD_NAME, IDENTIFIER } from './constants'

export const fetchFavorites = async (): Promise<FavoriteReference[]> => {
  const favorites = await aha.user.getExtensionField<FavoriteReference[] | null>(IDENTIFIER, FIELD_NAME)
  return favorites || []
}

export const isFavorite = async (reference: FavoriteReference): Promise<Boolean> => {
  const favorites = await fetchFavorites()
  return includesRecord(favorites, reference)
}

export const addFavorite = async (reference: FavoriteReference) => {
  const favorites = await fetchFavorites()
  if (!includesRecord(favorites, reference)) {
    favorites.push(reference)
  }
  aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, favorites)
}

export const removeFavorite = async (reference: FavoriteReference) => {
  const favorites = await fetchFavorites()
  const newFavorites = withoutRecord(favorites, reference)
  aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, newFavorites)
}

export function groupBy<T>(xs: T[], key: keyof(T)): { [key: string]: T[] } {
  return xs.reduce((acc, x) => {
    const idx = x[key] as string;
    (acc[idx] = acc[idx] || []).push(x)
    return acc
  }, {})
}

const matchingRecord = (a: FavoriteReference, b: FavoriteReference) => {
  return a.typename == b.typename && a.id == b.id
}

const includesRecord = (records: FavoriteReference[], record: FavoriteReference) => {
 return records.filter(x => matchingRecord(x, record)).length > 0
}

const withoutRecord = (records: FavoriteReference[], record: FavoriteReference) => {
  return records.filter(x => !matchingRecord(x, record))
}