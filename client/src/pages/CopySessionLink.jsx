import {toast} from 'react-toastify';

const CopySessionLink = ({ sessionId }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Session link copied to clipboard!');
  };

  return <button onClick={copyToClipboard}>Copy Session Link</button>;
};

export default CopySessionLink;
