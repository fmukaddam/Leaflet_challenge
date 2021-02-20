//Create map
function createMap(earthquakes) {

  // Define outdoormap, satellitemap, and grayscalemap layers
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

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

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"), function (data) {
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

  // // Store our API inside a queryUrl
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

// // Perform a GET request to the query URL
// d3.json(queryUrl, function (data) {
//   // Create a function and send data.features to the function
//   createFeatures(data.features);
//   console.log(data.features)
// });

// function createFeatures(earthquakeData) {

//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   };

//   // Define function to create the circle based on the magnitude
//   function radiusSize(magnitude) {
//     return magnitude * 20000;
//   };

//   // Define function to set the circle color based on the magnitude
//   function circleColor(magnitude) {
//     if (magnitude < 1) {
//       return "#ccff33"
//     }
//     else if (magnitude < 2) {
//       return "#ffff33"
//     }
//     else if (magnitude < 3) {
//       return "#ffcc33"
//     }
//     else if (magnitude < 4) {
//       return "#ff9933"
//     }
//     else if (magnitude < 5) {
//       return "#ff6633"
//     }
//     else {
//       return "#ff3333"
//     }
//   };
//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     pointToLayer: function (earthquakeData, latlng) {
//       return L.circle(latlng, {
//         radius: radiusSize(earthquakeData.properties.mag),
//         color: circleColor(earthquakeData.properties.mag),
//         fillOpacity: 1
//       });
//     },
//     onEachFeature: onEachFeature
//   });


// // Sending our earthquakes layer to the createMap function
// createMap(earthquakes);
// };

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Outdoor Map": outdoorsmap,
//     "Greyscale Map": grayscalemap,
//     "Satellite Map": satellitemap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [outdoorsmap, earthquakes]
//   });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

//   // color function to be used when creating the legend
//   function getColor(d) {
//     return d > 5 ? '#ff3333' :
//       d > 4 ? '#ff6633' :
//         d > 3 ? '#ff9933' :
//           d > 2 ? '#ffcc33' :
//             d > 1 ? '#ffff33' :
//               '#ccff33';
//   }

//   // Add legend to the map
//   var legend = L.control({ position: 'bottomright' });

//   legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//       mags = [0, 1, 2, 3, 4, 5],
//       labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < mags.length; i++) {
//       div.innerHTML +=
//         '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
//         mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
//     }

//     return div;
//   };

//   legend.addTo(myMap);