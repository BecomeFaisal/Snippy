import React from 'react';

const CopySessionLink = ({ sessionId }) => {
  const copyToClipboard = () => {
    const url = `${window.location.origin}/code/${sessionId}`;
    navigator.clipboard.writeText(url);
    alert('Session link copied!');
  };

  return <button onClick={copyToClipboard}>Copy Session Link</button>;
};

export default CopySessionLink;
