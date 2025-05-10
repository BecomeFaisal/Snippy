import { useNavigate } from 'react-router-dom';
import JoinSession from './JoinSession';

export default function Home() {
  const navigate = useNavigate();

  console.log('Home component rendered');

  const createSession = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/create', {
        method: 'POST'
      });
      const data = await res.json();
      navigate(`/code/${data.sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Could not create session');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Snippy ✂️</h1>
      <button onClick={createSession} style={{ padding: '10px 20px', fontSize: '18px' }}>
        Create New Code Session
      </button>
      <br />
      <JoinSession> </JoinSession>
    </div>
  );
}
