import React, { useEffect, useState } from "react";
import { DrawerObserver } from "../DrawerObserver"
import { FIELD_NAME, IDENTIFIER } from "../constants";
import { FavoriteController } from "../FavoriteController";

const FavoriteRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const pointers = await aha.user.getExtensionField(IDENTIFIER, FIELD_NAME) || []
      const records = await Promise.all(pointers.map(async ({ typename, id }) => {
        const Model = aha.models[typename]
        return await Model.select(["name", "referenceNum", "path"]).find(id)
      }))
      setRecords(records)
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
        <div className="p-2" onClick={e => aha.drawer.showRecord(record)}>
          <aha-record-reference recordType={record.typename}>
            {record.referenceNum}
          </aha-record-reference>
          &nbsp;
          { record.name }
        </div>
      ))}
    </div>
  )
}

const AhaPanel = aha.getPanel(IDENTIFIER, FIELD_NAME, {
  name: "Favorite records",
});

AhaPanel.on("render", ({ props }) => {
  return <FavoriteRecords />;
});

const activateFavorites = () => {
  const drawer = DrawerObserver.instance
  const favorites = FavoriteController.instance

  drawer.clearCallbacks()

  drawer.onOpen(() => {
    favorites.showButton()
  })

  drawer.onClose(() => {
    favorites.hideButton()
  })

  drawer.observe()
}

document.addEventListener("DOMContentLoaded", activateFavorites)
document.addEventListener("page:load", activateFavorites)