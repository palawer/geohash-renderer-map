
function generateGeojson(geohashes) {
  let polygons = {};
  for (const geohash of geohashes) {
    try {
      const cleanedGeohash = geohash.replace(/\s/g, '');
      const bounds = Geohash.bounds(cleanedGeohash);
      const polygon = geohashToPolygon(bounds);
      polygons[geohash] = polygon;
    } catch (error) {
      console.warn(`Invalid geohash ${geohash}`);
    }
  }

  let features = [];
  for (const geohash in polygons) {
    const polygon = polygons[geohash];
    features.push({
      type: "Feature",
      properties: {
        geohash: geohash,
      },
      geometry: polygon,
    });
  }

  const featureCollection = {
    type: "FeatureCollection",
    features: features,
  };
  
  return featureCollection;
}

function geohashToPolygon(bounds) {
  const polygon = {
    type: "Polygon",
    coordinates: [
      [
        [bounds.sw.lon, bounds.sw.lat],
        [bounds.ne.lon, bounds.sw.lat],
        [bounds.ne.lon, bounds.ne.lat],
        [bounds.sw.lon, bounds.ne.lat],
        [bounds.sw.lon, bounds.sw.lat],
      ],
    ],
  };
  return polygon;
}
