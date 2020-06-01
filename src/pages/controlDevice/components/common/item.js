import React from 'react';

const Item = ({ name, src, highLight, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className={`singleItem ${highLight === 1 || highLight === '1' ? 'active' : ''}`}
    >
      <div className="imgWrapper">
        <img src={src} />
      </div>
      <span style={{ fontSize: name.length > 4 ? '14px' : '', marginTop: '.2rem' }}>{name}</span>
    </div>
  );
};

export default Item;
