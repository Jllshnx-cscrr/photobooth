import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './contexts/SessionContext';
import { TemplateProvider } from './contexts/TemplateContext';
import { PhotoBoothApp } from './PhotoBoothApp';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <TemplateProvider>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<PhotoBoothApp />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </SessionProvider>
      </TemplateProvider>
    </BrowserRouter>
  );
}

export default App;
