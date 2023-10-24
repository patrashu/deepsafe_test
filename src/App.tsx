import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthenticationPage from './components/authentication/AuthenticationPage';
import './App.css'

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

export default function App() {
  return (
    <div className="app">
      <Routes>
        {/* <Route path="/" element={<AuthenticationPage />} /> */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
}
