import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider} from '@vis.gl/react-google-maps';
import Map3D from './map-3d';

import './styles.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} version="nightly">
      <Map3D
        defaultCenter={{lat: 37.72809, lng: -119.64473}}
        defaultZoom={12}
        mapId="749ac551edae0fb443b62a4e"
        style={{width: '1000px', height: '1000px'}}
      />
    </APIProvider>
  );
};
export default App;

const root = createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
