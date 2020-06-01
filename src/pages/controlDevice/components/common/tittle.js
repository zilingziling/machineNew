import React from 'react';

const Title = ({ title }) => {
  return (
    <div className="leftTitle">
      <div className="verticalIcon"></div>
      <span>{title}</span>
    </div>
  );
};
export default Title;
