import React from 'react'
import ReactDOM from 'react-dom'

import { FavoriteButton } from '../components/FavoriteButton'

export class FavoriteController {
  static instance: FavoriteController
  el: HTMLSpanElement

  constructor() {
    this.el = null
  }

  async showButton() {
    if (this.el) this.hideButton()

    const reference = this.extractRecordInfo()
    if (!reference) {
      console.log("No reference found in drawer")
      return
    }

    const container = document.querySelector('#drawer-nav__row--actions .drawer-nav__cell:first-of-type')
    const button = document.createElement('span')
    this.el = container.appendChild(button)

    ReactDOM.render(React.createElement(FavoriteButton, { reference }), button)
  }

  hideButton() {
    if (!this.el) return
    this.el.remove()
  }

  extractRecordInfo(): FavoriteReference {
    const tabbedRecordEl = document.querySelector('.drawer .tabbed-record')
    if (!tabbedRecordEl) return

    const [ typename, id ] = tabbedRecordEl.getAttribute('data-reactive-record').split("-")
    const record = {
      typename: typename as Aha.ReferenceInterface['typename'], // Silence errors by forcing to a narrower type than we actually see
      id
    }

    return record
  }
}

if (!FavoriteController.instance) {
  FavoriteController.instance = new FavoriteController()
}