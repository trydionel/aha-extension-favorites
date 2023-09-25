import React, { useState, useEffect } from 'react'
import { FIELD_NAME, IDENTIFIER } from "../constants";
import { groupBy } from '../data';

export const FavoriteRecords = () => {
  const [records, setRecords] = useState<Aha.ReferenceInterface[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const pointers = await aha.user.getExtensionField<FavoriteReference[]>(IDENTIFIER, FIELD_NAME) || []
      const pointersByType = groupBy<FavoriteReference>(pointers, 'typename') 
      const records = await Promise.all(Object.entries(pointersByType).map(async ([typename, references]) => {
        const Model = aha.models[typename]
        if (!Model) {
          console.warn(`Unable to find Aha! model for '${typename}'`)
          return null
        }

        return await Model.select(["name", "referenceNum", "path"])
          .where({id: references.map(r => r.id)})
          .all()
      }))
      setRecords(records.flatMap(xs => xs.models).filter(Boolean))
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <>Loading</>
  }

  if (records.length === 0) {
    return <aha-empty-state>Click the <aha-icon icon="far fa-star"></aha-icon> in the drawer header to add the record to your favorites.</aha-empty-state>
  }

  return (
    <div>
      { records.map(record => (
        <div className="p-2" onClick={e => aha.drawer.showRecord(record)} style={{ cursor: "pointer" }}>
          <aha-record-reference record-type={record.typename}>
            {record.referenceNum}
          </aha-record-reference>
          &nbsp;
          { record.name }
        </div>
      ))}
    </div>
  )
}