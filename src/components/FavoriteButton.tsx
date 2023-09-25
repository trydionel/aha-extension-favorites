import React, { CSSProperties, useEffect, useState } from 'react'
import { addFavorite,  isFavorite, removeFavorite } from '../data'

export const FavoriteButton = ({ reference }: FavoriteButtonProps) => {
  const toggleFavorite = async () => {
    if (favorite) {
      removeFavorite(reference)
      setFavorite(false)
    } else {
      addFavorite(reference)
      setFavorite(true)
    }
  }

  const [favorite, setFavorite] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(true)
  const [buttonStyles, setButtonStyles] = useState<Partial<CSSProperties>>({})
  const [iconClasses, setIconClasses] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      setFavorite(await isFavorite(reference))
      setLoading(false)
    }

    loadData()
  }, [reference])

  useEffect(() => {
    setButtonStyles({
      backgroundColor: favorite ? 'var(--aha-yellow-100)' : 'var(--aha-gray-200)',
      color: favorite ? 'var(--aha-yellow-700)' : 'var(--aha-gray-800)',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      textAlign: 'center',
      fontSize: '10px',
      lineHeight: '20px',
      cursor: 'pointer',
    })
    setIconClasses(loading ? 'fa fa-spinner fa-spin' : (favorite ? "fa fa-star" : "far fa-star"))
  }, [loading, favorite])


  return <div className="favorite-button" style={buttonStyles} onClick={e => toggleFavorite()}>
    <i className={iconClasses} />
  </div>
}