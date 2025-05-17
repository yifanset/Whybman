import { Routes, Route } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import TeamPage from './components/pages/TeamPage';
import PageHeader from './components/page/PageHeader';
import './App.css';

function App() {
  return (
    <>
      <PageHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Routes>
    </>
  );
}

export default App;
