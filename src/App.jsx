import './App.css'
import Users from "./components/Users"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <Users/>
    <ToastContainer/>
    </>
  )
}

export default App
