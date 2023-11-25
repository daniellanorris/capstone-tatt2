export function calculateDistance(lat1, lon1, lat2, lon2) {
    console.log('lon1'+ lon1, 'lat1' + lat1, 'lon2'+ lon2, 'lat2'+ lat2)
    lon1 = lon1 * (Math.PI / 180);
    lon2 = lon2 * (Math.PI / 180);
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);


    console.log('lon1'+ lon1, 'lat1' + lat1, 'lon2'+ lon2, 'lat2'+ lat2)
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    console.log(dlon, dlat)
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const rMiles = 3958.8; 
  
    return c * rMiles;
}