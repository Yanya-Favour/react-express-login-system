import { useEffect } from 'react';
import { useAuth } from './components/AuthContext';
import api from './api';
import Login from './components/Login';
import Protected from './components/Protected';
import './App.css';

let hasFetched = false; // Prevents unnecessary duplicate requests.

function App() {
  const { user, setUser } = useAuth();

  async function fetchProfile() {
    if (hasFetched) return;
    hasFetched = true;

    try {
      const response = await api.get('/profile', { withCredentials: true });

      if (response.data && response.data.email) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('There has been an Error', error);
      setUser(null);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [setUser]);

  return user ? <Protected /> : <Login />;
}

export default App;