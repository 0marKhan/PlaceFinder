import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import FetchedLocations from "../components/FetchedLocations";
import ScrollToTopArrow from "../components/ScrollToTopArrow";
import axios from "axios";

const selectOptions = [
  { value: "bank", label: "bank" },
  { value: "gas_station", label: "gas station" },
  { value: "bus_station", label: "bus station" },
  { value: "school", label: "school" },
  { value: "post_office", label: "post office" },
  { value: "police_station", label: "police station" },
  { value: "university", label: "university" },
  { value: "supermarket", label: "supermarket" },
  { value: "shopping_center", label: "shopping center" },
  { value: "bar", label: "bar" },
  { value: "car_rental", label: "car rental" },
  { value: "hospital", label: "hospital" },
  { value: "electrician", label: "electrician" },
  { value: "amusement_park", label: "amusement park" },
  { value: "mosque", label: "mosque" },
  { value: "church", label: "church" },
  { value: "park", label: "park" },
];

const MainPage = () => {
  const [selectedValue, setSelectedValue] = useState("hospital");
  const [enteredCountry, setEnteredCountry] = useState("England");
  const [enteredCity, setEnteredCity] = useState("London");
  const [coordinates, setCoordinates] = useState({
    name: "London",
    latitude: 51.5073219,
    longitude: -0.1276474,
    country: "GB",
    state: "England",
  });
  const [selectValueError, setSelectValueError] = useState(false);
  const [enteredCountryError, setEnteredCountryError] = useState(false);
  const [enteredCityError, setEnteredCityError] = useState(false);
  const [coordinatesLoaded, setCoordinatesLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [locationDataLoaded, setLocationDataLoaded] = useState(false);

  const { latitude, longitude } = coordinates ?? { latitude: 0, longitude: 0 };

  const options = {
    method: "GET",
    url: "https://trueway-places.p.rapidapi.com/FindPlacesNearby",
    params: {
      location: `${latitude},${longitude}`,
      type: selectedValue,
      radius: 700,
      language: "en",
    },
    headers: {
      // "X-RapidAPI-Key": "83836b648amsh97b5e8ec6497369p134bb7jsna8e79cb8fed1",
      "X-RapidAPI-Key": "ec3cbc61e9msh9ad5b234268a2c5p1d0953jsnb764bafffaf8",
      "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
    },
  };

  // call the get location api in here and get place api within it

  const getCoordinates = async () => {
    const apiKey = "cLyk3QUP4+yENdKkRgjoQQ==5Orn0gO0FJdHNOiZ";

    const config = {
      headers: {
        "X-Api-Key": apiKey,
      },
      params: {
        city: enteredCity,
        country: enteredCountry,
      },
    };

    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/geocoding?city=${enteredCity}&country=${enteredCountry}`,
        config
      );
      // setting coordinates for place entered
      setCoordinates(response.data[0]);
      setFormSubmitted(false);
    } catch (error) {
      console.log(error);
    }
  };

  // calling get place api
  const getPlace = async (options, retryCount = 4) => {
    try {
      setLocationDataLoaded(false);
      const response = await axios.request(options);
      setLocationData(response.data.results);
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount > 0) {
        console.log("Rate limit exceeded. Retrying after 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await getPlace(options, retryCount - 1);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      getCoordinates();
    }
  }, [formSubmitted]);

  useEffect(() => {
    if (
      coordinates &&
      coordinates.latitude !== undefined &&
      coordinates.longitude !== undefined
    ) {
      getPlace(options);
      setCoordinatesLoaded(true);
    }
  }, [coordinates]);

  useEffect(() => {
    if (Object.keys(locationData).length !== 0) {
      setLocationDataLoaded(true);
      console.log(locationData);
    } else {
      setLocationDataLoaded(false);
    }
  }, [locationData]);

  // useEffect(() => {
  //   console.log(coordinates);
  // }, [coordinates]);

  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const enteredCountryHandler = (event) => {
    setEnteredCountry(event.target.value);
  };

  const enteredCityHandler = (event) => {
    setEnteredCity(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!enteredCountry) {
      setEnteredCountryError(true);
    }
    if (!enteredCity) {
      setEnteredCityError(true);
    }
    if (!selectedValue) {
      setSelectValueError(true);
    }
    if (enteredCity && enteredCountry && selectedValue) {
      setFormSubmitted(true);
    }
  };

  const loading = <h1>Loading...</h1>;

  const formJSX = (
    <form className="mx-4 lg:flex lg:justify-center" onSubmit={submitHandler}>
      <div className="group mt-8 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 ">
        <input
          className="w-full h-full outline-none"
          type="text"
          placeholder="Country"
          onChange={enteredCountryHandler}
        />
      </div>
      {enteredCountryError && (
        <label className="text-red-500 mt-1">Please enter a country</label>
      )}
      <div className="group mt-4 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 lg:mt-8 lg:ml-6">
        <input
          className="w-full h-full outline-none"
          type="text"
          placeholder="City"
          onChange={enteredCityHandler}
        />
      </div>
      {enteredCityError && (
        <label className="text-red-500 mt-1">Please enter a city</label>
      )}
      <div className="group mt-4 px-4 w-full border-gray-400 focus-within:border-purple-800 h-10 border-2 rounded-xl lg:w-80 lg:mt-8 lg:ml-6 ">
        <select
          value={selectedValue}
          onChange={handleSelectionChange}
          className="w-full h-full outline-none"
        >
          <option value="">Select an option</option>
          {selectOptions.map((selected) => (
            <option key={selected.value} value={selected.value}>
              {selected.label}
            </option>
          ))}
        </select>
      </div>
      {selectValueError && (
        <label className="text-red-500 mt-1">Please select an option</label>
      )}

      <button
        className="mt-6 w-full h-10 rounded-xl text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-900 lg:w-32 lg:mt-8 lg:ml-6"
        type="submit"
      >
        Submit
      </button>
    </form>
  );

  return (
    <div>
      <ScrollToTopArrow />
      {coordinatesLoaded ? formJSX : loading}
      <div className="lg:flex">
        <div className="mt-10 mx-4 lg:w-1/2 lg:mx-14 lg:mt-12 lg:pb-5">
          {coordinatesLoaded & locationDataLoaded ? (
            <MapComponent outputData={locationData} position={coordinates} />
          ) : (
            loading
          )}
        </div>
        <div className="lg:w-1/2">
          <div className="mt-10 mx-4">
            {locationDataLoaded ? (
              <FetchedLocations outputData={locationData} />
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
