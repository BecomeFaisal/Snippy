import { useNavigate } from 'react-router-dom';
import './Home.css';
import JoinSession from './JoinSession';

export default function Home() {
  const navigate = useNavigate();

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
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Snippy ✂️</h1>
        <h2>Your ultimate platform for live code sharing, real-time collaboration, and seamless execution.</h2>
        <button onClick={createSession} className="home-button">
          Create New Code Session
        </button>
        <br />
        <JoinSession />
      </div>
      <div className="home-image">
        {/* Replace with your image URL or component */}
        <img src={require('./img.jpg')} alt="Snippy preview" />
      </div>
    </div>
  );
}
