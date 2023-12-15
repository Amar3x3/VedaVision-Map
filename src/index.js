import data from "./places.json" assert { type: "JSON" };


function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5.1,
    center: { lat: 22.449759, lng:80.108221 },
  });

  // Create the DIV to hold the control.
  const centerControlDiv = document.createElement("div");
  // Create the control.
  const centerControl = createCenterControl(map);

  // Append the control to the DIV.
  centerControlDiv.appendChild(centerControl);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  setSingleMarker(map);
}

function createCenterControl(map) {
  const controlButton = document.createElement("button");
  controlButton.id = "controlbtn";

  controlButton.textContent = "Center Map";
  controlButton.title = "Click to recenter the map";
  controlButton.type = "button";
  controlButton.addEventListener("click", () => {
    map.setCenter({ lat: 24.449759, lng:80.108221 });
    map.setZoom(5.1);
  });
  return controlButton;
}



function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setSingleMarker(map) {
  const infowindow = new google.maps.InfoWindow();

  const indexFromUrl = getParameterByName('index');

  if (indexFromUrl !== null) {
    const index = parseInt(indexFromUrl, 10);
    const place = data.plants[index];

    if (place) {
      const plantName = document.getElementById("plant-name");
      plantName.innerHTML = place.name

      const location = document.getElementById("plant-location");
      location.innerHTML = place["location-grown"]
      const circle = new google.maps.Circle({
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.35,
        map,
        center: { lat: place.coordinates[0], lng: place.coordinates[1] },
        radius: 300000, // You can adjust the radius as needed
      });

      console.log(circle);

      circle.addListener("mouseover", () => {
        const info = card(place);
        infowindow.setContent(info);
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
      });

      circle.addListener("mouseout", () => {
        infowindow.close(map);
      });

      circle.addListener("click", () => {
        map.setZoom(15);
        map.setCenter(circle.getCenter());
        const info = card(place);
        infowindow.setContent(info);
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
      });
    } else {
      console.error('Invalid index or place not found.');
    }
  } else {
    console.error('Index not provided in the URL.');
  }
}


window.initMap = initMap;
