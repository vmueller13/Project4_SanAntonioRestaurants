let myMap = L.map("map", {
  center: [29.4252, -98.4946],
  zoom: 12
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create cluster labels for meaningful names
const clusterNames = {
  0: "Top Shelf (4.7-5.0)",
  1: "Middle of the Road (4.2-4.4)",
  2: "Rock Bottom (2.9-3.6)",
  3: "A Step Above Rock Bottom (3.7-4.1)",
  4: "Aspirational Top Shelf (4.5-4.6)"
};

// Create layer groups for different clusters
const clusterLayers = {};

// Assemble the API query URL.
let url = "/api/restaurants";
let data = d3.json(url);

// Get the data with d3.
data.then(function (response) {
  let listNames = [];
  let listScores = [];
  let listClusters = [];
  const restaurantList = document.getElementById("restaurantList");

  // Sort the restaurants by score in descending order
  var sortedRestaurants = response.sort(function (a, b) {
    return b.score - a.score;
  });
  // Determine the number of top restaurants you want to keep
  var topN = 10;
  // Keep only the top N restaurants
  var topRestaurants = sortedRestaurants.slice(0, topN);

  // Loop through the data.
  for (let i = 0; i < response.length; i++) {
    let lat = response[i].lat;
    let lng = response[i].lng;
    let clusterLabel = response[i].cluster;

    // Get the meaningful name for the cluster
    let clusterName = clusterNames[clusterLabel];

    // Check if latitude and longitude exist.
    if (lat && lng) {
      // Create the HTML content for the popup.
      let popup = `<h3>${response[i].name}</h3>
        <p>Score: ${response[i].score}</p>
        <p>Price Range: ${response[i].price_range}</p>
        <p>Cluster: ${clusterName}</p>`;

      if (topRestaurants.includes(response[i])) {
          listNames.push(response[i].name);
          listScores.push(response[i].score);
          listClusters.push(response[i].cluster);
      }
      const option = document.createElement('option');
      option.value = response[i].name;
      option.innerHTML = response[i].name;
      option.dataset.category = response[i].category;
      option.dataset.priceRange = response[i].price_range;
      option.dataset.address = response[i].address;
      restaurantList.append(option)

      let marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          iconSize: [30, 30],
          html: `<div style="background-color: ${getColorForCluster(clusterLabel)}" class="marker-circle"></div>`
        }),
      });

      marker.bindPopup(popup);

      if (clusterLabel in clusterLayers) {
        clusterLayers[clusterLabel].addLayer(marker);
      } else {
        // Create a new marker layer for individual markers
        const individualMarkerLayer = L.layerGroup([marker]);
        clusterLayers[clusterLabel] = individualMarkerLayer;
      }
    }
  }

  // Create an object for controlling layers
  const overlayMaps = {
    "All Restaurants": L.layerGroup(Object.values(clusterLayers)) // Show all markers initially
  };

  // Add each cluster layer to the overlayMaps
  for (const clusterLabel in clusterLayers) {
    overlayMaps[clusterNames[clusterLabel]] = clusterLayers[clusterLabel];
  }

  // Add a control for toggling layers
  L.control.layers(null, overlayMaps).addTo(myMap);

  // Initialize the map with all markers shown initially
  myMap.addLayer(overlayMaps["All Restaurants"]);
});

// Function to get color for each cluster
function getColorForCluster(clusterLabel) {
  // Define color codes for clusters
  const colorCodes = {
    0: "#043316", // Dk Green for Top Shelf
    1: "#0000ff", // Blue for middle of the road
    2: "#FF0000", // Red for Rock Bottom
    3: "#1899de", // Light blue for a step above rock bottom
    4: "#00ff00" // Green for aspirational top shelf
  };

  return colorCodes[clusterLabel] || "#808080"; // Gray for unknown clusters
}
restaurantList.addEventListener("change", function (event) {
    const address = this.options[this.selectedIndex].getAttribute('data-address');
    document.getElementById('address').innerHTML = address;
    const priceRange = this.options[this.selectedIndex].getAttribute('data-price-range');
    document.getElementById('priceRange').innerHTML = priceRange;
    const category = this.options[this.selectedIndex].getAttribute('data-category');
    document.getElementById('category').innerHTML = category;
  });
