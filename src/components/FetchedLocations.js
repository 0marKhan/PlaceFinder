import React from "react";

const FetchedLocations = ({ outputData }) => {
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {outputData.map((location) => (
        <div className="mb-4" key={location.id}>
          <div className="font-bold">{location.name}</div>
          <div className="text-slate-700 text-sm">
            Address: {location.address}
          </div>
          <div className="text-slate-700 text-sm">
            Phone: {location.phone_number}
          </div>
          <div className="text-blue-700 text-sm border-b-2">
            <span className="text-slate-700">Website: </span>
            <a href={location.website}>{location.website}</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchedLocations;
