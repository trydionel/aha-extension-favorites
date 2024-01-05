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

export const clearFavorites = async () => {
  aha.user.clearExtensionField(IDENTIFIER, FIELD_NAME)
}

export function groupBy<T>(xs: T[], key: keyof(T)): { [key: string]: T[] } {
  return xs.reduce((acc, x) => {
    const idx = x[key] as string;
    (acc[idx] = acc[idx] || []).push(x)
    return acc
  }, {})
}

export async function bulkFetchDetails(typename: string, references: FavoriteReference[]) {
  if (typename.includes("::")) {
    typename = typename.split("::")[1] // drop namespace
  }

  const Model = aha.models[typename]
  if (!Model) {
    console.warn(`Unable to find Aha! model for '${typename}'`)
    return []
  }

  const result = await Model.select(["name", "referenceNum", "path"])
    .where({ id: references.map(r => r.id) })
    .all()

  return [typename, result.models]
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