import React from 'react';

const colors = ['#FFF', '#EEE', '#EEE', '#DDD', '#CCC', '#BBB', '#AAA', '#999', '#888', '#777'];
export default ({ value }) => {
  const style = {
    background: colors[value === 0 ? 0 : Math.log2(value) + 1],
  };
  return (
    <div className="tile" style={style}>
      {value > 0 ? value : null}
    </div>
  );
};
