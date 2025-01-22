// Mapping between Nepali and English digits
export const NEPALI_TO_ENGLISH: { [key: string]: string } = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

export const ENGLISH_TO_NEPALI = Object.fromEntries(
  Object.entries(NEPALI_TO_ENGLISH).map(([k, v]) => [v, k])
);