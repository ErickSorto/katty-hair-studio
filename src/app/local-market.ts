export const localServiceAreas = [
  "Brentwood, Maryland",
  "North Brentwood, Maryland",
  "Mount Rainier, Maryland",
  "Hyattsville, Maryland",
  "Bladensburg, Maryland",
  "Colmar Manor, Maryland",
] as const;

export function localServiceAreaSchema() {
  return localServiceAreas.map((name) => ({
    "@type": "Place",
    name,
  }));
}
