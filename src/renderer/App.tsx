import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';

function Home() {
  const [data, setData] = useState('')
  useEffect(() => {
    // Define the event listener function
    const handleActionResult = (arg) => {
      console.log(arg);
      setData(JSON.stringify(arg))
    };

    // Add event listener
    window.electron.ipcRenderer.on('action-result', handleActionResult);

    window.electron.ipcRenderer.sendMessage('action', {
      action: 'save-product',
      params: {},
      payload: {
        name: '',
        description: '',
        quantity: 50,
      }
    });

    // Clean-up function to remove the event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeListener('action-result', handleActionResult);
    };
  }, []);
  return (
    <div>
      <h1>Next POS</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
      <pre>{data}</pre>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
