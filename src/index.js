import React from 'react';
import ReactDOM from 'react-dom';


function CatBrowser(props) {
  return (
      <div className="cat-browser">
        <div className="cat-dropdown">
          <h1>Cat Browser</h1>
        </div>
        <div className="cat-list">
        </div>
        <div className="cat-detail">
        </div>
      </div>
    );
}

// ========================================

ReactDOM.render(
  <CatBrowser />,
  document.getElementById('root')
);
