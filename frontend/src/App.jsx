import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './App.css'
import Home from './pages/Home'
import Create from './pages/Create'
import Login from './pages/Login'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Review from './pages/Review'
import Save from './pages/Save'
import EditProfile from './pages/EditProfile'
import AllPhoto from './pages/AllPhoto'
import Admin from './pages/Admin'
import AllPlace from './pages/AllPlace'
import PlaceType from './pages/PlaceType'
import Province from './pages/Province'
import District from './pages/District'
import PlaceRequest from './pages/PlaceRequest'
import EditPlace from './pages/EditPlace'
import PlaceRequestEdit from './pages/PlaceRequestEdit'
import AllUser from './pages/AllUser'
import ReportUser from './pages/ReportUser'
import AllReview from './pages/AllReview'
import ReportReview from './pages/ReportReview'
import Question from './pages/Question'
import ResetPassword from './pages/ResetPassword'
import NotLoggedIn from './protectroute/NotLoggedIn'
import LoggedIn from './protectroute/LoggedIn'
import IsAdmin from './protectroute/IsAdmin'
import ShowQuestion from './pages/ShowQuestion'
import Notfound from './pages/Notfound'
import VerifyAccount from './pages/VerifyAccount'
import VerifyAccountRequest from './pages/VerifyAccountRequest'

function App() {

  return (
    <ConfigProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>

            <Route element={<NotLoggedIn />}>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Route>

            <Route element={<LoggedIn />}>
              <Route path='/create' element={<Create />} />
              <Route path='/save' element={<Save />} />
              <Route path='/edit-profile/:profileId' element={<EditProfile />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/edit-place/:placeId' element={<EditPlace />} />
              <Route path='/verify-account-request' element={<VerifyAccountRequest />} />
            </Route>

            <Route path='/' element={<Home />} />
            <Route path='/profile/:profileId' element={<Profile />} />
            <Route path='/search/:provinceId' element={<Search />} />
            <Route path='/review/:placeId' element={<Review />} />
            <Route path='/all-photo/:placeId' element={<AllPhoto />} />
            <Route path='/show-question' element={<ShowQuestion />} />
            <Route path='*' element={<Notfound />} />

            <Route element={<IsAdmin />}>
              <Route path='/admin' element={<Admin />} />
              <Route path='/all-place' element={<AllPlace />} />
              <Route path='/place-type' element={<PlaceType />} />
              <Route path='/province' element={<Province />} />
              <Route path='/district' element={<District />} />

              <Route path='/place-request' element={<PlaceRequest />} />
              <Route path='/place-request-edit' element={<PlaceRequestEdit />} />
              <Route path='/all-user' element={<AllUser />} />
              <Route path='/report-user' element={<ReportUser />} />

              <Route path='/all-review' element={<AllReview />} />
              <Route path='/report-review' element={<ReportReview />} />
              <Route path='/all-question' element={<Question />} />
              <Route path='/verify-account' element={<VerifyAccount />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  )
}

export default App
