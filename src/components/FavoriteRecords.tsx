import React, { useState, useEffect } from 'react'
import { clearFavorites, fetchFavorites, bulkFetchDetails, groupBy } from '../data';

const FavoritesContainer = ({ children, onRefresh, onClear }) => {
  return <aha-flex direction="column" justify-content="space-between" style={{ height: '100%' }}>
    <div style={{ flexGrow: 1 }}>
      {children}
    </div>
    <div className="p-3" style={{ borderTop: "1px solid var(--theme-primary-border)" }}>
      <aha-flex justify-content="space-between" align-items="center" gap="10px">
        <aha-button kind="link" size="mini" onClick={onClear}>Clear all</aha-button>
        <aha-button kind="link" size="mini" onClick={onRefresh}>Refresh</aha-button>
      </aha-flex>
    </div>
  </aha-flex>
}

export const FavoriteRecords = () => {
  const [records, setRecords] = useState<Partial<Record<FavoriteReference['typename'], Aha.ReferenceInterface[]>>>({})
  const [loading, setLoading] = useState(true)
  const loadData = async () => {
    setLoading(true)

    const pointers = await fetchFavorites()
    const pointersByType = groupBy<FavoriteReference>(pointers, 'typename')
    const records = await Promise.all(Object.entries(pointersByType).map(([typename, references]) => bulkFetchDetails(typename, references)))
    
    setRecords(Object.fromEntries(records))
    setLoading(false)
  }

  const clearData = async () => {
    if (window.confirm("This will clear all of your favorite records. Are you sure?")) {
      await clearFavorites()
      loadData()
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <FavoritesContainer onRefresh={e => loadData()} onClear={e => clearData()}>
        <aha-flex justify-content="center" align-items="center" style={{ 'height': '100%' }}>
          <aha-spinner size="5ex" />
        </aha-flex>
      </FavoritesContainer>
    )
  }

  if (Object.keys(records).length === 0) {
    return (
      <FavoritesContainer onRefresh={e => loadData()} onClear={e => clearData()}>
        <aha-flex justify-content="center" align-items="center" style={{ 'height': '100%' }}>
          <aha-empty-state>
            Click the <aha-icon icon="far fa-star"></aha-icon> in the drawer header to add the record to your favorites.
          </aha-empty-state>
        </aha-flex>
      </FavoritesContainer>
    )
  }

  return (
    <FavoritesContainer onRefresh={e => loadData()} onClear={e => clearData()}>
      {Object.entries(records).map(([typename, records]) => (
        <div className="p-3" style={{ flexGrow: 1, overflowY: "auto" }}>
          <h5 className="t-300">{typename}s</h5>
          {records.map(record => (
            <div className="my-2" onClick={e => aha.drawer.showRecord(record)} style={{ cursor: "pointer", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <aha-record-reference record-type={record.typename}>
                {record.referenceNum}
              </aha-record-reference>
              &nbsp;
              {record.name}
            </div>
          ))}
        </div>
      ))}
    </FavoritesContainer>
  )
}