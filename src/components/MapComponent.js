import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl:
    "https://as1.ftcdn.net/v2/jpg/05/73/30/34/1000_F_573303462_IjCgLE7Q4G3NEGys2Wd2k4Cm9uoIgZWJ.webp",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = ({ outputData, position }) => {
  const [mapCenter, setMapCenter] = useState([
    position.latitude,
    position.longitude,
  ]);
  const [zoom, setZoom] = useState(13);

  const handleMarkerClick = (lat, lng) => {
    setMapCenter([lat, lng]);
    setZoom(18);
  };

  useEffect(() => {
    setMapCenter([position.latitude, position.longitude]);
    setZoom(13);
  }, [position]);

  return (
    <div>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {outputData.map((data, index) =>
          data.location && data.location.lat && data.location.lng ? (
            <Marker
              key={index}
              position={[data.location.lat, data.location.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () =>
                  handleMarkerClick(data.location.lat, data.location.lng),
              }}
            >
              <Popup>{`Marker ${outputData[index].name}`}</Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
