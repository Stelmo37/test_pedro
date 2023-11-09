document.addEventListener("DOMContentLoaded", async () => {
	// On crée une carte
	const map = L.map('map'); // On passe l'identifiant du conteneur

	// On ajoute un fond de carte
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: "© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors"
	}).addTo(map);

	const response = await fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=5000');
	const data = await response.json();
	
	data.records.forEach((point) => {
    const marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]]);
    
	const additionalInfo =` ${point.fields['Station']}</p>`;
	const additionalInfo2 =`${point.fields['numbikesavailable']}</p>`;
	const additionalInfo3 = `${point.fields['numdocksavailable']}</p>`;
    
    const popupContent = `${point.fields['name']} ${additionalInfo} ${additionalInfo2} ${additionalInfo}`;
	marker.bindPopup(`${ popupContent}`);
    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());
    marker.on('click', () => {
    });
    marker.addTo(map);
  });
    const centerPoint = [
    d3.sum(data.records, ft => ft.geometry.coordinates[1]) / data.records.length,
    d3.sum(data.records, d => d.geometry.coordinates[0]) / data.records.length,
  ]
  
	map.setView(centerPoint, 11);

  // Créez des icônes personnalisées pour chaque catégorie de valeur
	  function createCustomIcon(value) {
		if (value < 33) {
			return new L.Icon({
			iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		  });
		
		} else if (value >= 33 && value <= 66) {
			  return new L.Icon({
			  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
			  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			  iconSize: [25, 41],
			  iconAnchor: [12, 41],
			  popupAnchor: [1, -34],
			  shadowSize: [41, 41]
			  });
		} else {
			  return new L.Icon({
			  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
			  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			  iconSize: [25, 41],
			  iconAnchor: [12, 41],
			  popupAnchor: [1, -34],
			  shadowSize: [41, 41]
		  });
		}
	  }
	  
	  // Parcourez la liste de points et ajoutez des marqueurs à la carte avec des icônes personnalisées
	  data.records.forEach((point)=>  {
		const customIcon = createCustomIcon((point.fields.numbikesavailable/point.fields.capacity)*100);
		L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], { icon: customIcon }).addTo(map);
	  });
      //PARTIE GRAPHIQUES

	const places_libres = data.records.map(records => records.fields["numdocksavailable"])
	const velos_mecaniques = data.records.map(records => records.fields["ebike"]) 
	const velos_electriques = data.records.map(records => records.fields["mechanical"]) 

	Plot.plot({
  marks: [
    Plot.barY(
     
      Plot.barY(data, {
        x: ["Places libres", "Vélos électriques", "Vélos mécaniques"],
        y: ["places_libres", "velos_electriques", "velos_mecaniques"],
        fill: ["Type de vélo"],
        text: ["électrique", "mécanique"],
      })
    ),
  ],
});
 	});