
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: island.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
    });

 new mapboxgl.Marker()
      .setLngLat(island.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
          `<h3>${island.title}</h3><p>${island.location}</p>`
        )
      )
      .addTo(map)