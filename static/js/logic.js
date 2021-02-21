// Store our API inside a queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Create a function and send data.features to the function
  createFeatures(data.features);
  console.log(data.features)
});


//Create a function createFeatures with the pop-up data
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  };

  // Define function to create the circle based on the magnitude
  function radiusSize(magnitude) {
    return magnitude * 20000;
  };

  // Define function to set the circle color based on the magnitude
  function circleColor(depth) {
    if (depth > 90) {
      return "#EA2C2C"
    }
    else if (depth > 70) {
      return "#EA822C"
    }
    else if (depth > 50) {
      return "#EE9C00"
    }
    else if (depth > 30) {
      return "#EECC00"
    }
    else if (depth > 10) {
      return "#D4EE00"
    }
    else {
      return "#9EF823"
    }
  };
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.geometry.coordinates[2]),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};

//Create map
function createMap(earthquakes) {

  // Define outdoormap, satellitemap, and grayscalemap layers
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var tectonicplates = new L.LayerGroup();

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoorsmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // color function to be used when creating the legend
  function getColor(d) {
    return d > 5 ? '#ff3333' :
      d > 4 ? '#ff6633' :
        d > 3 ? '#ff9933' :
          d > 2 ? '#ffcc33' :
            d > 1 ? '#ffff33' :
              '#ccff33';
  }

  // Add legend to the map
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function () {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#EA2C2C",
      "#EA822C",
      "#EE9C00",
      "#EECC00",
      "#D4EE00",
      "#9EF823"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap)
};