import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const LocationForm = ({ google, locationProp, setLocationProp}) => {
  const zoom = 12;

  const mapStyles = {
    width: '97%',
    height: '300px',
    zIndex: 30
  };

  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const options = {
        types: ['geocode'] // Restrict results to geographical locations
      };
      setAutocomplete(new google.maps.places.Autocomplete(inputRef.current, options));

      // Add a listener to listen for the 'place_changed' event
      if (autocomplete) {
        autocomplete.addListener('place_changed', onPlaceChanged);
      }
    }
  }, [google.maps.places.Autocomplete]);

  const onMapClick = (mapProps, map, clickEvent) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    const geocoder = new google.maps.Geocoder();
    const location = { lat, lng };

  geocoder.geocode({ location }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        const placeName = results[0].formatted_address;
        setLocationProp(placeName)
        console.log("Selected Location:", locationProp);
        // Perform any additional operations with the selected location here
      }
    } else {
      console.error("Geocoder failed due to:", status);
    }
  });
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = { lat, lng };
        setLocationProp(place.formatted_address);
        console.log("Selected Location:", locationProp);
        // Perform any additional operations with the selected location here
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a place"
        style={{ width: '100%', padding: '10px' }}
        ref={inputRef}
      />
      <Map
        google={google}
        zoom={zoom}
        style={mapStyles}
        onClick={onMapClick}
        initialCenter={{ lat: 37.7749, lng: -122.4194 }} // Example: San Francisco
      >
        <Marker position={{ lat: 37.7749, lng: -122.4194 }} />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: '',
})(LocationForm);
