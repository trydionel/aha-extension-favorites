import { DrawerObserver } from "./controllers/DrawerObserver"
import { FavoriteController } from "./controllers/FavoriteController";

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

export const patchDrawerBehavior = () => {
  console.log("Patching drawer behavior for favorites extension")

  document.addEventListener("page:load", activateFavorites)
  activateFavorites()
}