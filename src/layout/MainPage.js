import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import FetchedLocations from "../components/FetchedLocations";
import ScrollToTopArrow from "../components/ScrollToTopArrow";
import FormBody from "../components/FormBody";
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
  { value: "park", label: "park" },
];

const rapidAPIKey = process.env.REACT_APP_RAPIDAPI_KEY;
const ninjasAPIKey = process.env.REACT_APP_NINJAS_API_KEY;

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
  const [enteredCityError, setEnteredCityError] = useState("");
  const [coordinatesLoaded, setCoordinatesLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [locationDataLoaded, setLocationDataLoaded] = useState(false);
  const [isValidCoordinates, setIsValidCoordinates] = useState(true);
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
      "X-RapidAPI-Key": rapidAPIKey,
      "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
    },
  };

  // initialize the coordiates with the default ones if invalid input
  useEffect(() => {
    if (
      (coordinates.latitude === undefined ||
        coordinates.longitude === undefined) &&
      coordinates.name === "" &&
      coordinates.country === "" &&
      coordinates.state === ""
    ) {
      // Set the coordinates to the default value if it is empty
      setIsValidCoordinates(false);
      setCoordinates({
        name: "London",
        latitude: 51.5073219,
        longitude: -0.1276474,
        country: "GB",
        state: "England",
      });
    } else {
      setIsValidCoordinates(true);
    }
  }, [coordinates]);

  // call the get location api in here and get place api within it

  const getCoordinates = async () => {
    const apiKey = ninjasAPIKey;

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

      // Checking if response.data is not undefined before accessing properties
      if (response.data && response.data[0]) {
        const { latitude, longitude } = response.data[0];
        if (latitude === undefined || longitude === undefined) {
          // Set default coordinates if latitude or longitude is missing
          setCoordinates({
            name: "London",
            latitude: 51.5073219,
            longitude: -0.1276474,
            country: "GB",
            state: "England",
          });
        } else {
          // Setting coordinates for place entered
          setCoordinates(response.data[0]);
        }
      } else {
        // Set default coordinates if response.data is empty or undefined
        setCoordinates({
          name: "London",
          latitude: 51.5073219,
          longitude: -0.1276474,
          country: "GB",
          state: "England",
        });
      }

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

  const loading = <h1 className=" items-center">Loading...</h1>;

  if (!isValidCoordinates) {
    return <p>Invalid City or Country Input</p>;
  }

  return (
    <div>
      <div>
        <ScrollToTopArrow />
        {coordinatesLoaded ? (
          <FormBody
            submitHandler={submitHandler}
            enteredCountryHandler={enteredCountryHandler}
            enteredCountryError={enteredCountryError}
            enteredCityHandler={enteredCityHandler}
            enteredCityError={enteredCityError}
            selectedValue={selectedValue}
            handleSelectionChange={handleSelectionChange}
            selectOptions={selectOptions}
          />
        ) : (
          loading
        )}
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
                <h1 className="justify-center">Loading...</h1>
              )}
            </div>
          </div>
        </div>
      </div>
      )
    </div>
  );
};

export default MainPage;
