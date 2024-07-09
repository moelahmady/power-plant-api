import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css"; // Ensure the CSS file is imported
import customMarkerImg from "./power-plant.png"; // Import the SVG file

const states = [
  { value: "", name: "All States" },
  { value: "AL", name: "Alabama" },
  { value: "AK", name: "Alaska" },
  { value: "AZ", name: "Arizona" },
  { value: "AR", name: "Arkansas" },
  { value: "CA", name: "California" },
  { value: "CO", name: "Colorado" },
  { value: "CT", name: "Connecticut" },
  { value: "DE", name: "Delaware" },
  { value: "FL", name: "Florida" },
  { value: "GA", name: "Georgia" },
  { value: "HI", name: "Hawaii" },
  { value: "ID", name: "Idaho" },
  { value: "IL", name: "Illinois" },
  { value: "IN", name: "Indiana" },
  { value: "IA", name: "Iowa" },
  { value: "KS", name: "Kansas" },
  { value: "KY", name: "Kentucky" },
  { value: "LA", name: "Louisiana" },
  { value: "ME", name: "Maine" },
  { value: "MD", name: "Maryland" },
  { value: "MA", name: "Massachusetts" },
  { value: "MI", name: "Michigan" },
  { value: "MN", name: "Minnesota" },
  { value: "MS", name: "Mississippi" },
  { value: "MO", name: "Missouri" },
  { value: "MT", name: "Montana" },
  { value: "NE", name: "Nebraska" },
  { value: "NV", name: "Nevada" },
  { value: "NH", name: "New Hampshire" },
  { value: "NJ", name: "New Jersey" },
  { value: "NM", name: "New Mexico" },
  { value: "NY", name: "New York" },
  { value: "NC", name: "North Carolina" },
  { value: "ND", name: "North Dakota" },
  { value: "OH", name: "Ohio" },
  { value: "OK", name: "Oklahoma" },
  { value: "OR", name: "Oregon" },
  { value: "PA", name: "Pennsylvania" },
  { value: "RI", name: "Rhode Island" },
  { value: "SC", name: "South Carolina" },
  { value: "SD", name: "South Dakota" },
  { value: "TN", name: "Tennessee" },
  { value: "TX", name: "Texas" },
  { value: "UT", name: "Utah" },
  { value: "VT", name: "Vermont" },
  { value: "VA", name: "Virginia" },
  { value: "WA", name: "Washington" },
  { value: "WV", name: "West Virginia" },
  { value: "WI", name: "Wisconsin" },
  { value: "WY", name: "Wyoming" },
];

// Override the default icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImg,
  iconRetinaUrl: customMarkerImg,
  iconSize: [32, 32], // Adjust the size as needed
  iconAnchor: [16, 32], // Adjust the anchor point as needed
  popupAnchor: [0, -32], // Adjust the popup anchor point as needed
  shadowUrl: null, // If you don't want a shadow, set this to null
});
const Map = () => {
  const [plants, setPlants] = useState([]);
  const [state, setState] = useState("");
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/plants/top?state=${state}&count=${topN}`)
      .then((response) => setPlants(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [state, topN]);

  return (
    <div className="map-container">
      <div className="controls">
        <label>
          State:
          <select onChange={(e) => setState(e.target.value)} value={state}>
            {states.map((stateItem) => (
              <option key={stateItem.value} value={stateItem.value}>
                {stateItem.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Top N:
          <input
            type="number"
            value={topN}
            onChange={(e) => setTopN(e.target.value)}
            min="1"
          />
        </label>
      </div>
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={5}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {plants.map((plant, index) => (
          <Marker key={index} position={[plant.latitude, plant.longitude]}>
            <Marker
              key={index}
              position={[plant.latitude, plant.longitude]}
            ></Marker>

            <Popup>
              {plant.plantName}
              <br />
              Net Generation: {plant.annualNetGeneration} <br />
              State Percentage: {plant.statePercentage}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
