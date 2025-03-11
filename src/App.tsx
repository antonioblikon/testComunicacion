import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [countMessage, setCountMessage] = useState(0);
  const [response, setResponse] = useState('');
  const [cookieValue, setCookieValue] = useState('');

  const sendMessageToiOS = () => {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.iosListener
    ) {
      window.webkit.messageHandlers.iosListener.postMessage(
        'Hola desde React en WebView!'
      );
    }
  };

  const setCookie = () => {
    axios.post(
      'https://authentication-api-v3.blikondev.com/api/v3/cookies/create_custom_cookie',
      {
      cookie_name: 'test_cookie',
      cookie_value: '567890',
      http_only: true,
      secure: false,
      same_site: 'strict',
      expiration_minutes: 5,
      domain: '.vercel.app',
      },
      {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhcGlfdXNlciIsInJvbGVzIjpbImFwaV91c2VyIl0sImV4cCI6MTgwMDIwNDMyOX0.q3p4lv5nTkTQ72LYTWrzkoIYwgQWiEw1mXuTbqsM-p8',
      },
      withCredentials: true,
      }
    )
      .then((response) => {
      setResponse(response.data);
      })
      .catch((error) => {
      console.error('Error:', error);
      });
  };

  // Listener para detectar cambios en la cookie "test_cookie"
  useEffect(() => {
    const checkCookieChange = () => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies['test_cookie'] !== cookieValue) {
        console.log('La cookie ha cambiado:', cookies['test_cookie']);
        setCookieValue(cookies['test_cookie'] || '');
      }
    };

    const interval = setInterval(checkCookieChange, 1000); // Revisa cada 1s

    return () => clearInterval(interval);
  }, [cookieValue]);

  window.receiveMessageFromiOS = function (
    message: string | Record<string, unknown>
  ) {
    console.log('Mensaje recibido desde iOS:', message);
    setCountMessage((prev) => prev + 1);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Mensajes recibidos de iOS: {countMessage}</p>
        <p>Valor actual de la cookie: {cookieValue || 'No disponible'}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <h1>Response:</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>

      <button onClick={sendMessageToiOS}>Enviar mensaje a iOS</button>
      <button onClick={setCookie}>Set cookie</button>
    </>
  );
}

export default App;