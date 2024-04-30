// getting places from APIs
function  loadPlaces(position) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3/1mSuY0oIt/DqWKGoLKWxrHeIPD8oHDo1BZmGhl7yBs='
        }
    };

    fetch(`https://api.foursquare.com/v3/places/nearby?ll=${position.latitude},${position.longitude}&limit=30`, options)
        .then(response => {
            console.log(response)
            response.json().then((resp) => {
                return resp.results;
            })
        })
        .catch(err => console.error(err));
};


window.onload = () => {
    const scene = document.querySelector('a-scene');
    return navigator.geolocation.getCurrentPosition(async function (position) {
            const places = await loadPlaces(position.coords)
            if (places) {
                places.forEach((place) => {
                    console.log("place:" + JSON.stringify(place))
                    const latitude = place.geocodes.main.latitude;
                    const longitude = place.geocodes.main.longitude;

                    // add place name
                    const placeText = document.createElement('a-link');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.name);
                    placeText.setAttribute('scale', '15 15 15');

                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            }

        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
