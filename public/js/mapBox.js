/* eslint-disable */

export const displayMap = (locations) => {
  if (!!locations) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidHVuZ2FuaDI1MiIsImEiOiJja2I1enllaG8xMXJ2MnFueHVqaXVmdTFyIn0.Jn3RlAehU0-ay9FVSKU3fA';
    var map = new mapboxgl.Map({
      container: 'map', // container is id html
      style: 'mapbox://styles/tunganh252/ckb689pvw1ug51hlze11dtex4',
      scrollZoom: false,
      //   center: [-118.113491,34.111745],
      //   zoom: 4,
      //   interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
      // Add marker
      const el = document.createElement('div');
      el.className = 'marker';

      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      // Extend map bounds to include location
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
  }
};
