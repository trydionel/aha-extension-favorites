import React from "react";
import { FIELD_NAME, IDENTIFIER } from "../constants";
import { FavoriteRecords } from "../components/FavoriteRecords";
import { patchDrawerBehavior } from "../setup";

const AhaPanel = aha.getPanel(IDENTIFIER, FIELD_NAME, {
  name: "Favorite records",
});

AhaPanel.on("render", ({ props, container }, { identifier }) => {
  // Big ol' nasty hack to allow for 100% height iframe
  const extensionComponents = document.querySelectorAll(`extension-component[data-extension-identifier="${identifier}"]`)
  extensionComponents.forEach(e => e.parentElement.style.height = '100%')
  container.style.height = '100%'

  return <FavoriteRecords />;
});

patchDrawerBehavior()