export class DrawerObserver {
  static instance: DrawerObserver;
  observer: MutationObserver;
  onOpenCallbacks: DrawerCallback[];
  onCloseCallbacks: DrawerCallback[];
  
  constructor() {
    this.observer = null
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
  }

  containsDrawer(nodes: NodeListOf<Element>) {
    return Array.from(nodes)
      .filter(e => {
        try {
          return e.matches('.tabbed-record')
        } catch {
          return false
        }
      })
      .length > 0
  }

  observe() {
    if (this.observer) return

    // Register a mutation observer to watch for drawers being opened/closed
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        let drawerOpened, drawerClosed

        if (mutation.type === 'childList') {
          drawerOpened = mutation.addedNodes.length > 0 && this.containsDrawer(mutation.addedNodes as NodeListOf<Element>)
          drawerClosed = mutation.removedNodes.length > 0 && this.containsDrawer(mutation.removedNodes as NodeListOf<Element>)
        }

        if (drawerOpened) {
          this.onOpenCallbacks.forEach(callback => callback(mutation.addedNodes[0]))
        }
        if (drawerClosed) {
          this.onCloseCallbacks.forEach(callback => callback(mutation.removedNodes[0]))
        }
      })
    })

    try {
      const drawerRoot = document.querySelector('.drawer .content-main')
      this.observer.observe(drawerRoot, { childList: true })

      // Also check for drawers already on the page
      if (this.containsDrawer(document.querySelectorAll('.drawer'))) {
        // Next tick to ensure animation fires
        setTimeout(() => {
          this.onOpenCallbacks.forEach(callback => callback(drawerRoot))
        }, 1);
      }
    } catch (e) {
      console.warn("Unable to observe drawer for favorites extension", e)
    }
  }

  onOpen(callback: DrawerCallback) {
    this.onOpenCallbacks.push(callback)
  }

  onClose(callback: DrawerCallback) {
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