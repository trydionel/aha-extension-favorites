import React from "react";
import { FIELD_NAME, IDENTIFIER } from "../constants";
import { FavoriteRecords } from "../components/FavoriteRecords";
import { patchDrawerBehavior } from "../setup";

const AhaPanel = aha.getPanel(IDENTIFIER, FIELD_NAME, {
  name: "Favorite records",
});

AhaPanel.on("render", ({ props }) => {
  return <FavoriteRecords />;
});

patchDrawerBehavior()