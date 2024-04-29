// getting places from APIs
function loadPlaces(position) {
    const endpoint = `https://api.foursquare.com/v3/places/nearby?ll=${position.latitude},${position.longitude}&limit=30`;
    return fetch({
        url: endpoint,
        headers: {
            "Accept": "application/json",
            "Authorization": "fsq3Xd8yruhR+Efq1YHJP4dR3s78qmDxvKkJQDUzMxfqWj8="
        }
    })
        .then((res) => {
            return res.json()
                .then((resp) => {
                    console.log(res)
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');
    return navigator.geolocation.getCurrentPosition(function (position) {
         loadPlaces(position.coords)
                .then((places) => {
                    places.forEach((place) => {
                        const latitude = place.location.lat;
                        const longitude = place.location.lng;

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
                })
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};