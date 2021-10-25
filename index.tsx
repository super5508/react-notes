import React from 'react';
import { render } from 'react-dom';
import './style.css';

import Tasks from './pages/Tasks';

const App = () => {
  return <Tasks />;
};

render(<App />, document.getElementById('root'));
