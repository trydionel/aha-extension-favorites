interface FavoriteReference {
  id: string | number;
  typename: Aha.ReferenceInterface["typename"]; // Decent proxy for the types of records that can show in a drawer
}

interface FavoriteButtonProps {
  reference: FavoriteReference
}

type DrawerCallback = (Element) => void

declare namespace JSX {
  interface IntrinsicElements {
    "aha-record-reference": any;
  }
}