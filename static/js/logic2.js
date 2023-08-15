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
  0: "Cluster 0: Top Shelf (4.7-5.0)",
  4: "Cluster 4: Aspirational Top Shelf (4.5-4.6)",
  1: "Cluster 1: Middle of the Road (4.2-4.4)",
  3: "Cluster 3: A Step Above Rock Bottom (3.7-4.1)",
  2: "Cluster 2: Rock Bottom (2.9-3.6)"
};

// Create layer groups for different clusters
const clusterLayers = {};

// Assemble the API query URL.
let url = "/api/restaurants";
let data = d3.json(url);

// Get the data with d3.
data.then(function (response) {
  const restaurantList = document.getElementById("restaurantList");

  // Sort the restaurants by name in alphabetical order
  const sortedRestaurantsByName = response.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Loop through the data.
  for (let i = 0; i < sortedRestaurantsByName.length; i++) {
    let lat = sortedRestaurantsByName[i].lat;
    let lng = sortedRestaurantsByName[i].lng;
    let clusterLabel = sortedRestaurantsByName[i].cluster;

    // Get the meaningful name for the cluster
    let clusterName = clusterNames[clusterLabel];

    // Check if latitude and longitude exist.
    if (lat && lng) {
      // Create the HTML content for the popup.
      let popup = `<h3>${sortedRestaurantsByName[i].name}</h3>
        <p>Score: ${sortedRestaurantsByName[i].score}</p>
        <p>Price Range: ${sortedRestaurantsByName[i].price_range}</p>
        <p>${clusterName}</p>`;

      //Create the dropdown option for user input
      const option = document.createElement('option');
      option.value = sortedRestaurantsByName[i].name;
      option.innerHTML = sortedRestaurantsByName[i].name;
      option.dataset.category = sortedRestaurantsByName[i].category;
      option.dataset.priceRange = sortedRestaurantsByName[i].price_range;
      option.dataset.address = sortedRestaurantsByName[i].address;
      option.dataset.cluster = clusterLabel;
      restaurantList.append(option)

      let marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          iconSize: [30, 30],
          html: `<div style="background-color: ${getColorForCluster(clusterLabel)}" class="marker-circle"></div>`
        }),
      });

      marker.bindPopup(`<div class="popup-content">${popup}</div>`);

      //Check to see if the cluster label exists in the layers array, if it does, add it as a layer on the map
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
  const baseMaps = {
    "All Restaurants": L.layerGroup(Object.values(clusterLayers)) // Show all markers initially
  };

  // Define the desired order of cluster labels
  const desiredClusterOrder = [0, 4, 1, 3, 2];

  // Add each cluster layer to the overlayMaps
  desiredClusterOrder.forEach(clusterLabel => {
    baseMaps[clusterNames[clusterLabel]] = clusterLayers[clusterLabel];
  });

  // Add a control for toggling layers
  const layerControl = L.control.layers(baseMaps).addTo(myMap);

  // Initialize the map with all markers shown initially
  myMap.addLayer(baseMaps["All Restaurants"]);

  // Select the "All Restaurants" option in the layer control
  layerControl.getContainer().querySelector('input[type="radio"][value="All Restaurants"]');
});

// Function to get color for each cluster
function getColorForCluster(clusterLabel) {
  // Define color codes for clusters
  const colorCodes = {
    0: "#FF8674", // sea green Green for Top Shelf
    4: "#7D0552", // plum velvet for aspirational top shelf
    1: "#5453A6", // periwinkle for middle of the road
    3: "#1899de", // Light blue for a step above rock bottom
    2: "#C71585" // Medium Violet Red for Rock Bottom

  };

  return colorCodes[clusterLabel]; // Return the color code for the given cluster label
}
restaurantList.addEventListener("change", function (event) {
  const address = this.options[this.selectedIndex].getAttribute('data-address');
  document.getElementById('address').innerHTML = address;
  const priceRange = this.options[this.selectedIndex].getAttribute('data-price-range');
  document.getElementById('priceRange').innerHTML = priceRange;
  const category = this.options[this.selectedIndex].getAttribute('data-category');
  document.getElementById('category').innerHTML = category;
  const cluster = this.options[this.selectedIndex].getAttribute('data-cluster');
  document.getElementById('clusterName').innerHTML = cluster;
});

// Function to switch tabs
function openTab(tabName) {
  var tabContents = document.getElementsByClassName("tab-content");

  // Hide all tab content
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  // Show the selected tab content
  document.getElementById(tabName).style.display = "block";

  // If switching to the business tab, hide the map and show the chart
  if (tabName === 'consultingTab') {
    document.getElementById('map').style.display = 'none';
    document.getElementById('chartContainer').style.display = 'block';
  } else {
    // Otherwise, show the map and hide the chart
    document.getElementById('map').style.display = 'block';
    document.getElementById('chartContainer').style.display = 'none';
  }
}

// Show the initial tab
document.getElementById("infoTab").style.display = "block";