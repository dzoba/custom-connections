import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Create from './Create';
import Play from './Play';
import './index.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
