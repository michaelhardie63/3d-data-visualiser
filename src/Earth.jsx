import { useState, useEffect, useRef } from 'react';
import { Preload } from '@react-three/drei';
import Loader from './Loader';
import Globe from 'react-globe.gl';
import * as topojson from "topojson-client";
import * as d3 from "d3";
import './App.css'

const Earth = () => {
	const [countries, setCountries] = useState({ features: []});
   const [landPolygons, setLandPolygons] = useState([]);
	const [popData, setPopData] = useState([]);
   const [places, setPlaces] = useState([]);

	const globeEl = useRef();

   useEffect(() => {
      fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
   }, []);
   
	
   useEffect(() => {
      fetch('//unpkg.com/world-atlas/land-110m.json').then(res => res.json())
      .then(landTopo => {
         setLandPolygons(topojson.feature(landTopo, landTopo.objects.land).features);
      });
   }, []);

   useEffect(() => {
      let to;
      (function check() {
        	if (globeEl.current) {
          	globeEl.current.controls().autoRotate = true;
          	globeEl.current.controls().autoRotateSpeed = 0.1;
          	globeEl.current.pointOfView({ lat: -20.8136, lng: 144.9631, altitude: 1.2 });
          	globeEl.current.p
        	} else {
          	to = setTimeout(check, 1000);
        	}
      })();
      return () => {
        	if (to) {
          	clearTimeout(to);
        	}
      };
   }, []);

   const N = 28;
   const locations = [
      { startLat: -31.9523, startLng: 115.8613 }, // Perth
      { startLat: -34.9285, startLng: 138.6007 }, // Adelaide
      { startLat: -37.8136, startLng: 144.9631 }, // Melbourne
      { startLat: -33.8688, startLng: 151.2093 }, // Sydney
      { startLat: -27.4698, startLng: 153.0251 }, // Brisbane
      { startLat: -42.8826, startLng: 147.3280 }, // Hobart
      { startLat: -12.4634, startLng: 130.8456 }, // Darwin
      { startLat: -35.2809, startLng: 149.1300 }, // Canberra
      // { startLat: -32.5361, startLng: 115.7427 }, // Mandurah
      // { startLat: -16.9203, startLng: 145.7709 }, // Cairns
      // { startLat: -20.7337, startLng: 116.8447 }, // Karratha
      // { startLat: -30.7490, startLng: 121.4660 }, // Kalegoorlie
      // { startLat: -33.3270, startLng: 115.6409 }, // Bunbury
      // { startLat: -33.9535, startLng: 115.0630 }, // Margaret River
      // { startLat: -33.8614, startLng: 121.8913 }, // Esperence
      // { startLat: -34.4512, startLng: 140.5698 }, // Loxton
      // { startLat: -34.5333, startLng: 138.9500 }, // Barossa Valley
      // { startLat: -35.5503, startLng: 138.6209 }, // Victor Harbour
      // { startLat: -32.1260, startLng: 133.6763 }, // Ceduna
      // { startLat: -29.0135, startLng: 134.7544 }, // Coober Pedy
      // { startLat: -23.6980, startLng: 133.8807 }, // Alice Springs
      // { startLat: -31.9596, startLng: 141.4608 }, // Broken Hill
      // { startLat: -34.2069, startLng: 142.1367 }, // Mildura
      // { startLat: -32.9283, startLng: 122.2370 }, // Newcastle
      // { startLat: -32.2444, startLng: 148.6144 }, // Dubbo
      // { startLat: -38.1493, startLng: 144.3598 }, // Geelong
      // { startLat: -36.3821, startLng: 145.4072 }, // Shepparton
      // { startLat: -23.4403, startLng: 144.2506 }, // Longreach
      // { startLat: -17.9618, startLng: 122.2370 }, // Broome
      // { startLat: -24.8838, startLng: 113.6571 }, // Carnarvon
    ];

   const arcsData = [...Array(N).keys()].map(() => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      return {
        	startLat: -23.6980,
        	startLng: 133.8807,
        	endLat: randomLocation.startLat,
        	endLng: randomLocation.startLng,
      };
   });

   useEffect(() => {
      fetch('../datasets/ne_110m_populated_places_simple.geojson').then(res => res.json())
      .then(({ features }) => setPlaces(features));
   }, []);

   useEffect(() => {
      fetch('../datasets/world_population.csv').then(res => res.text())
      .then(csv => d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop })))
   	.then(setPopData);
   }, []);

   const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
   .domain([0, 1e7]);

   return (
    	<div className='container'>
    		<div className='content'>
    			<img 
     				src='../public/images/logo.svg'
      			alt='logo'
      			className='logo'
    			/>
    			<h1>Keeping Your Data Safe and Protected.</h1>
				<p>
					At Medibank, we understand the importance of safeguarding our members personal 
					information and are dedicated to maintaining and improving the highest standards 
					of data protection, <strong>we prioritize the security and privacy of our members' data</strong>. 
				</p>
				<p>
					Your trust is important to us, and we will continue to invest in the latest technologies 
					and security measures to ensure the ongoing protection of your data is kept. Learn how we are 
					protecting your data.
				</p>  

				<button>
					Find out more
				</button>
			</div>
			<div className='globe'>
				<Globe
					ref={globeEl}
					globeImageUrl="../public/images/earth-white.jpg"
					arcsData={arcsData}
					arcColor={() => "#dd0822"}
					arcDashLength={() => Math.random()}
					arcDashGap={4}
					arcDashAnimateTime={() => Math.random() * 2000 + 500}
					arcStroke={0.4}

					backgroundColor="rgba(255,255,255,1)"
					showGlobe={false}
					showAtmosphere={true}
					atmosphereAltitude={-0.5}
					atmosphereColor='white'
					
					labelsData={places}
					labelLat={d => d.properties.latitude}
					labelLng={d => d.properties.longitude}
					labelText={d => d.properties.name}
					labelSize={d => Math.sqrt(d.properties.pop_max) * 4e-4}
					labelDotRadius={d => Math.sqrt(d.properties.pop_max) * 4e-4}
					labelColor={() => '#dd0822'}
					labelResolution={2}
					
					polygonSideColor={() => 'rgba(255, 255, 255, 1)'}

					hexPolygonsData={countries.features}
					hexPolygonResolution={3}
					hexPolygonMargin={0.5} //was 0.3
					hexPolygonColor={() => 'rgba(211, 211, 211, 1)'}
					hexPolygonLabel={
						({ properties: d }) => `
							<b>${d.ADMIN} (${d.ISO_A2})</b> <br />
						Population: <i>${d.POP_EST}</i>`}
				/>
			</div>
   	</div>
	);
}

export default Earth;
