import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MapContainer = ({ addHospitalData, setAddHospitalData, ...props }) => {
    const [places, setPlaces] = useState([]);
    const [map, setMap] = useState(null);
    const [mapInput, setMapInput] = useState({
        lat: 31.48544799999999,
        lng: 74.3046761,
    });

    let searchBox;
    let markers = [];

    useEffect(() => {
        const input = document.getElementById('pac-input');
        searchBox = new window.google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', onPlacesChanged);
    }, []);

    const onMapReady = (mapProps, map) => {
        const input = document.getElementById('pac-input');
        map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
        searchBox = new window.google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', onPlacesChanged);
    };

    const onPlacesChanged = () => {
        const newPlaces = searchBox?.getPlaces();

        if (newPlaces?.length === 0) {
            return;
        }

        setPlaces(newPlaces);

        const bounds = new window.google.maps.LatLngBounds();

        newPlaces?.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                return;
            }

            const icon = {
                url: place.icon,
                size: new window.google.maps.Size(71, 71),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(17, 34),
                scaledSize: new window.google.maps.Size(25, 25),
            };

            markers.push(
                new window.google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        // Update the mapInput state with the first place's coordinates
        if (newPlaces?.length > 0) {
            const firstPlace = newPlaces[0];
            //   setMapInput({
            //     lat: firstPlace.geometry.location.lat(),
            //     lng: firstPlace.geometry.location.lng(),
            //   });
            setAddHospitalData((pre) => ({
                ...pre,
                lat: firstPlace?.geometry?.location.lat(),
                long: firstPlace?.geometry?.location.lng(),
                location: firstPlace?.geometry?.location.lat() + ', ' + firstPlace?.geometry?.location.lng(),
                address: firstPlace?.formatted_address,
            }))
        }

        map?.fitBounds(bounds);
    };

    const onMarkerDragEnd = (index, event, map) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const locationName = places[index]?.formatted_address;
        setAddHospitalData((pre) => ({
            ...pre,
            lat: lat,
            long: lng,
            location: lat + ', ' + lng,
        }))
        getAddressFromLatLng();
    }

    const getAddressFromLatLng = () => {
        const geocoder = new props.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: addHospitalData?.lat, lng: addHospitalData?.long } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    setAddHospitalData((pre) => ({
                        ...pre,
                        address: results[0]?.formatted_address,
                    }))
                }
            }
        });
    };


    return (
        <div className='doc-setting-input' >
            <input className=' pl-2' id="pac-input" type="text" placeholder="Enter a location" style={{ width: '63%', height:'41px', margin:'10px 0 0 0' }} />
            <div style={{ width: '100%' }}>
                <Map
                    google={props.google}
                    onReady={onMapReady}
                    initialCenter={{ ...addHospitalData, 'lng': addHospitalData?.long }}
                    zoom={13}
                    center={{ ...addHospitalData, 'lng': addHospitalData?.long }} // Set the map center to mapInput
                    mapTypeId="roadmap"
                    style={{ zIndex: '10', width: '96.2%', height: '400px', borderRadius: '5px' }}
                    className='Google-Map-modify'
                >
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            title={place.name}
                            position={{
                                lat: addHospitalData?.lat,
                                lng: addHospitalData?.long,
                            }}
                            // animation={window.google.maps.Animation.BOUNCE}
                            draggable={true}
                            onDragend={(t, map, coord) => onMarkerDragEnd(index, coord, map)}
                        />
                    ))}
                    {!places?.length > 0 ? <Marker
                        position={{
                            lat: addHospitalData?.lat,
                            lng: addHospitalData?.long,
                        }}
                        draggable={true}
                        onDragend={(t, map, coord) => onMarkerDragEnd(0, coord, map)}
                    // animation={window.google.maps.Animation.BOUNCE} 
                    /> : null}
                </Map>
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDk832eePRvQjCvxhHvqxtuGqzyjrFEGEY',
})(MapContainer);
