let map = L.map('map').setView([37.8, -96], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(value) {
  let minValue = 0;
  let maxValue = 100;
  let color = "";
  let colorScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range(["green", "red"]);
  color = colorScale(value);
  return color;
}
//Load data from json 
d3.json(url)
  .then(function (data) {

    function getColor(value) {
      if(value>=-10 && value<10) return "#A3F600"
      if(value>=10 && value<30) return "#DCF400"
      if(value>=30 && value<50) return "#F7DB11"
      if(value>=50 && value<70) return "#FDB72A"
      if(value>=70 && value<90) return "#FCA35D"
      if(value>=90) return "#FF5F65"
    }


    for (let i = 0; i < data.features.length; i++) {

      let depth = data.features[i].geometry.coordinates[2]
      let long = data.features[i].geometry.coordinates[0]
      let lat = data.features[i].geometry.coordinates[1]
      let circle = L.circle([lat, long], {
        color: getColor(depth),
        fillOpacity: 0.5,
        radius: 5000 * data.features[i].properties.mag
      }).addTo(map);
      circle.bindPopup(`Place: ${data.features[i].properties.place}, Time: ${new Date(data.features[i].properties.time).toLocaleDateString()}, Magnitude: ${data.features[i].properties.mag}`);
    }
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend');
      let levels = [-10, 10, 30, 50, 70, 90]

      div.style.background = '#fff'
      div.style.padding = '10px'

      for (let i = 0; i < levels.length; i++) {
        div.innerHTML +=
          '<span style="background:' + getColor(levels[i] ) + '; width:15px; height:15px; display: inline-block" ></span> ' +
          levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);
  })

