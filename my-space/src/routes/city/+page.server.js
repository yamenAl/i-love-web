/**
 * /city — server load function
 *
 * Provides static metadata consumed by the page component.
 * No database or external API calls needed — all map data is fetched
 * client-side by MapLibre GL JS from free tile providers:
 *   • OpenFreeMap "liberty" style — free vector tiles, no API key
 *   • 3D buildings via fill-extrusion using OSM render_height data
 */
export function load() {
  return {
    title: 'Amsterdam 3D City',
    description:
      'Interactive 3D map of Amsterdam — Dam Square, Koninklijk Paleis, and the full canal ring with dark navy styling, 3D building extrusions, and clickable landmark cards.',
    coordinates: { lat: '52°22′N', lng: '4°54′E' },
  };
}

