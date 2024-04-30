// getting places from APIs
function loadPlaces(position) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3/1mSuY0oIt/DqWKGoLKWxrHeIPD8oHDo1BZmGhl7yBs='
        }
    };
    const scene = document.querySelector('a-scene');
    fetch(`https://api.foursquare.com/v3/places/nearby?ll=${position.latitude},${position.longitude}&limit=30`, options)
        .then(response => {
            console.log(response)
            response.json().then((resp) => {
                const places = resp.results;
                console.log("places:" + places)
                places.forEach((place) => {
                    if(place.geocodes.main){
                        console.log("place:" + JSON.stringify(place))
                        const latitude = place.geocodes.main.latitude;
                        const longitude = place.geocodes.main.longitude;
                        const placeText = document.createElement('a-link');
                        placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                        placeText.setAttribute('title', place.name);
                        placeText.setAttribute('scale', '15 15 15');
                        placeText.addEventListener('loaded', () => {
                            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                        });
                        scene.appendChild(placeText);
                    }

                });
                const tempText = document.createElement('a-link');
                tempText.setAttribute('gps-entity-place', `latitude: 45.8234; longitude: -119.7257;`);
                tempText.setAttribute('title', '新荟城');
                tempText.setAttribute('scale', '15 15 15');
                tempText.addEventListener('loaded', () => {
                    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                });
                scene.appendChild(tempText);
            })
        })
        .catch(err => console.error(err));
};


window.onload = () => {

    return navigator.geolocation.getCurrentPosition(async function (position) {
            await loadPlaces(position.coords)
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
