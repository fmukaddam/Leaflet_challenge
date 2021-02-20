//Create map
function createMap(earthquakes) {

    // Define outdoormap, satellitemap, and grayscalemap layers
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors",
    accessToken: API_KEY
  });
  
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite",
    accessToken: API_KEY
  });
  
  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light",
    accessToken: API_KEY
  })
  
    var map = L.map("mapid", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [graymap_background, satellitemap_background, outdoors_background]
    });
    graymap_background.addTo(map);
    var tectonicplates = new L.LayerGroup();
    var earthquakes = new L.LayerGroup();
    var baseMaps = {
      Satellite: satellitemap_background,
      Grayscale: graymap_background,
      Outdoors: outdoors_background
    };
    var overlayMaps = {
      "Tectonic Plates": tectonicplates,
      "Earthquakes": earthquakes
    };
    // control which layers are visible.
    L
      .control
      .layers(baseMaps, overlayMaps)
      .addTo(map);
  
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"), function (data) {
      function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      function getColor(magnitude) {
        switch (true) {
          case magnitude > 5:
            return "#EA2C2C";
          case magnitude > 4:
            return "#EA822C";
          case magnitude > 3:
            return "#EE9C00";
          case magnitude > 2:
            return "#EECC00";
          case magnitude > 1:
            return "#D4EE00";
          default:
            return "#98EE00";
        }
      }
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
      }
      L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(earthquakes);
      earthquakes.addTo(map);
      var legend = L.control({
        position: "bottomright"
      });
      legend.onAdd = function () {
        var div = L
          .DomUtil
          .create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
          "#98EE00",
          "#D4EE00",
          "#EECC00",
          "#EE9C00",
          "#EA822C",
          "#EA2C2C"
        ];
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
      legend.addTo(map);
      d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
        function (platedata) {
          L.geoJson(platedata, {
            color: "orange",
            weight: 2
          })
            .addTo(tectonicplates);
          // add the tectonicplates layer to the map.
          tectonicplates.addTo(map);
        });
    };
  };