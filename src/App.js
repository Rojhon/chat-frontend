import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainForm from './view/auth-view';
import MainChat from './view/chat-view';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path='/' element={<MainForm />} exact></Route>
          <Route path='/chat' element={<MainChat />} ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
