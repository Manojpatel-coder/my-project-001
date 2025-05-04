mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 9
});

// Create popup first
const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h5>${listing.location}</h5>`);

// Create marker and attach popup
new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup) // attach the popup here
    .addTo(map);
