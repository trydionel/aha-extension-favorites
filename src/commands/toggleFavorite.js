import { addFavorite } from "../data";

aha.on("toggleFavorite", ({ record }, { identifier, settings }) => {
  if (record) {
    addFavorite({
      typename: record.typename,
      id: record.id
    })
  }
});