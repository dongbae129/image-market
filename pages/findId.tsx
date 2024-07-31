import React from 'react';
function FindId() {
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    await fetch('/api/find', {
      method: 'GET'
    });
  };
  return (
    <div>
      <form onSubmit={onSubmitHandle}>
        <button type="submit">전송</button>
      </form>
    </div>
  );
}

export default FindId;
