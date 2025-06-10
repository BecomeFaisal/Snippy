import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import './CodeEditor.css';
import CopySessionLink from './CopySessionLink';

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL, { transports: ['websocket'] });



export default function CodeEditor() {
  const { sessionId } = useParams();
  const [code, setCode] = useState('//Start Coding...');

  useEffect(() => {
    socket.emit('join', { sessionId });

    fetch(`${API_URL}/api/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.code !== undefined) {
          setCode(data.code);
        }
      });

    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('codeChange');
      socket.disconnect();
    };
  }, [sessionId]);

  const handleChange = (value) => {
    setCode(value);
    socket.emit('codeChange', { sessionId, code: value });
  };

  return (
    <div className="editor-container dark">
      <CopySessionLink></CopySessionLink>
      <CodeMirror
        value={code}
        height="90vh"
        extensions={[javascript()]}
        theme={oneDark}
        onChange={(value) => handleChange(value)}
      />
    </div>
  );
}
