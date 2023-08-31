export class DrawerObserver {
  constructor() {
    this.observer = null
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
  }

  containsDrawer(nodes) {
    return Array.from(nodes)
      .filter(e => e.matches('.tabbed-record'))
      .length > 0
  }

  observe() {
    if (this.observer) return

    // Register a mutation observer to watch for drawers being opened/closed
    this.observer = new MutationObserver((mutations) => {
      let drawerOpened, drawerClosed

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          drawerOpened = mutation.addedNodes.length > 0 && this.containsDrawer(mutation.addedNodes)
          drawerClosed = mutation.removedNodes.length > 0 && this.containsDrawer(mutation.removedNodes)
        }
      })

      if (drawerOpened) {
        this.onOpenCallbacks.forEach(callback => callback())
      }
      if (drawerClosed) {
        this.onCloseCallbacks.forEach(callback => callback())
      }
    })

    this.observer.observe(document.querySelector('.drawer .content-main'), { childList: true })

    // Also check for drawers already on the page
    if (this.containsDrawer(document.querySelectorAll('.drawer'))) {
      // Next tick to ensure animation fires
      setTimeout(() => {
        this.onOpenCallbacks.forEach(callback => callback())
      }, 1);
    }
  }

  onOpen(callback) {
    this.onOpenCallbacks.push(callback)
  }

  onClose(callback) {
    this.onCloseCallbacks.push(callback)
  }

  clearCallbacks() {
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
  }
}

if (!DrawerObserver.instance) {
  DrawerObserver.instance = new DrawerObserver()
}