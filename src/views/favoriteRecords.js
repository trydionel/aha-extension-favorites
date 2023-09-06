import React from "react";
import { DrawerObserver } from "../DrawerObserver"
import { FIELD_NAME, IDENTIFIER } from "../constants";
import { FavoriteController } from "../FavoriteController";
import { FavoriteRecords } from "../components/FavoriteRecords";

const AhaPanel = aha.getPanel(IDENTIFIER, FIELD_NAME, {
  name: "Favorite records",
});

AhaPanel.on("render", ({ props }) => {
  return <FavoriteRecords />;
});

const activateFavorites = () => {
  console.log("Activating favorites extension")

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