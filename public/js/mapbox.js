/* eslint-disable */

// const locations = JSON.parse(document.getElementById('map').dataset.locations);

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9qaWpvc2VwaDA3IiwiYSI6ImNrY2J6ZG92ajJhNzYycnRpeWp0NW8wY2UifQ.qywxy-rnbmLwE1ijRLlshQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jojijoseph07/ckcbzs8mm0k8k1ipi706s94fe',
    scrollZoom: false,
    //   centre: [-118.25246, 34.025852],
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
