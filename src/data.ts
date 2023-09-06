import { FIELD_NAME, IDENTIFIER } from './constants'

export const fetchFavorites = async (): Promise<FavoriteReference[]> => {
  return aha.user.getExtensionField<FavoriteReference[] | null>(IDENTIFIER, FIELD_NAME) || []
}

export const isFavorite = async (reference: FavoriteReference): Promise<Boolean> => {
  const favorites = await fetchFavorites()
  return includesRecord(favorites, reference)
}

export const addFavorite = async (reference) => {
  const favorites = await fetchFavorites()
  if (!includesRecord(favorites, reference)) {
    favorites.push(reference)
  }
  aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, favorites)
}

export const removeFavorite = async (reference) => {
  const favorites = await fetchFavorites()
  const newFavorites = withoutRecord(favorites, reference)
  aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, newFavorites)
}

const matchingRecord = (a, b) => {
  return a.typename == b.typename && a.id == b.id
}

const includesRecord = (records, record) => {
 return records.filter(x => matchingRecord(x, record)).length > 0
}

const withoutRecord = (records, record) => {
  return records.filter(x => !matchingRecord(x, record))
}