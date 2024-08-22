"use strict";

const map = L.map("map", {
  scrollWheelZoom: true,
  doubleClickZoom: true,
  attributionControl: false,
}).setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let geojsonLayer;
const $geohashesBox = document.getElementById("geohashesBox");
const $renderButton = document.getElementById("renderButton");
const $overGeohash = document.getElementById("overGeohash");

$renderButton.onclick = () => {
  renderGeohashes();
};

function renderGeohashes() {
  const geohashes = $geohashesBox.value.split('\n');
  const featureCollection = generateGeojson(geohashes);
  loadGeojsonData(featureCollection);
}

const featureStyle = (feature) => {
  return {
    color: "#ff7800",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
  };
};

const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
};

const highlightFeature = (e) => {
  const layer = e.target;
  const geohash = layer.feature.properties.geohash;

  layer.setStyle({
    weight: 3,
    color: "lime",
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  $overGeohash.textContent = geohash;
};

const resetHighlight = (e) => {
  geojsonLayer.resetStyle(e.target);
  $overGeohash.textContent = "-";
};

const loadGeojsonData = (featureCollection) => {
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }
  
  geojsonLayer = L.geoJSON(featureCollection, {
    style: featureStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);
  
  map.fitBounds(geojsonLayer.getBounds());
};

renderGeohashes();
$geohashesBox.focus();
