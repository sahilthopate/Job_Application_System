import { ToastContainer } from "react-toastify";
import { Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import UserHomePage from "./components/UserComponent/UserHomePage";
import RecruiterDashboard from "./components/RecruiterComponent/RecruiterDashboard";
import CreateJob from "./components/RecruiterComponent/CreatePost";
import MyPostedJob from "./components/RecruiterComponent/MyPostedJob";
import EditJob from "./components/RecruiterComponent/EditJob";
import AppliedJob from "./components/UserComponent/AppliedJob";
import ViewApplications from "./components/RecruiterComponent/ViewApplications";
import UserProfile from "./components/UserComponent/UserProfile";
import EditProfile from "./components/UserComponent/EditProfile";
import ChangePassword from "./components/UserComponent/ChangePassword";
import ProtectedRoute from "./ProtectedRoutes";
function App() {

  return (
    <>
      <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/*Users Routes*/}
        <Route element={<ProtectedRoute allowedRole='user'/>}>
          <Route path='/user/jobs' element={<UserHomePage />} />
          <Route path='/user/applied-jobs' element={<AppliedJob />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/edit-profile" element={<EditProfile />} />
          <Route path="/user/changePassword" element={<ChangePassword />} />
        </Route>


        {/* Recruiters Routes */}
        <Route element={<ProtectedRoute allowedRole='recruiter'/>}>
          <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
          <Route path='/recruiter/create-post' element={<CreateJob />} />
          <Route path="/recruiter/jobs" element={<MyPostedJob />} />
          <Route path="/recruiter/applications" element={<ViewApplications />} />
          <Route path="/recruiter/jobs/:jobId/edit" element={<EditJob />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  )
}

export default App
