import { FIELD_NAME, IDENTIFIER } from "./constants"

const includesRecord = (records, record) => {
 return records.filter(x => x.typename == record.typename && x.id == record.id).length > 0
}

const withoutRecord = (records, record) => {
  return records.filter(f => f.typename != record.typename && f.id != record.id)
}

export class FavoriteController {
  constructor() {
    this.el = null
  }

  async showButton() {
    if (this.el) this.hideButton()

    const record = this.extractRecordInfo()
    if (!record) return

    // FIXME: Can I create a standalone React component instead?
    let isFavorite = await this.isFavorite(record)
    const button = document.createElement('span')

    this.styleButton(button, isFavorite)

    button.addEventListener("click", (e) => {
      if (isFavorite) {
        this.removeFavorite(record)
        isFavorite = false
      } else {
        this.addFavorite(record)
        isFavorite = true
      }
      this.styleButton(button, isFavorite)
    }, false)

    const container = document.querySelector('#drawer-nav__row--actions .drawer-nav__cell:first-of-type')
    this.el = container.appendChild(button)
  }

  styleButton(button, isFavorite) {
    button.style.backgroundColor = isFavorite ? 'var(--aha-yellow-100)' : 'var(--aha-gray-200)'
    button.style.color = isFavorite ? 'var(--aha-yellow-700)' : 'var(--aha-gray-800)'
    button.style.padding = '4px'
    button.style.borderRadius = '50%'
    button.style.width = '20px'
    button.style.height = '20px'
    button.style.textAlign = 'center'
    button.style.fontSize = '10px'
    button.style.lineHeight = '12px'
    button.style.cursor = 'pointer'
    button.innerHTML = isFavorite ? '<i class="fa fa-star" />' : '<i class="far fa-star" />'
  }

  hideButton() {
    if (!this.el) return
    this.el.remove()
  }

  extractRecordInfo() {
    const tabbedRecordEl = document.querySelector('.tabbed-record')
    if (!tabbedRecordEl) return

    const [ typename, id ] = tabbedRecordEl.getAttribute('data-reactive-record').split("-")
    const record = {
      typename,
      id
    }

    return record
  }

  async isFavorite(record) {
    const favorites = await aha.user.getExtensionField(IDENTIFIER, FIELD_NAME) || []
    return includesRecord(favorites, record)
  }

  async addFavorite(record) {
    const favorites = await aha.user.getExtensionField(IDENTIFIER, FIELD_NAME) || []
    if (!includesRecord(favorites, record)) {
      favorites.push(record)
    }
    aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, favorites)
  }

  async removeFavorite(record) {
    const favorites = await aha.user.getExtensionField(IDENTIFIER, FIELD_NAME) || []
    const newFavorites = withoutRecord(favorites, record)
    aha.user.setExtensionField(IDENTIFIER, FIELD_NAME, newFavorites)
  }
}

if (!FavoriteController.instance) {
  FavoriteController.instance = new FavoriteController()
}