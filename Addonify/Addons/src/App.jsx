import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AdminRequests from "./pages/AdminPages/AdminRequests";
import AdminSearchUsers from "./pages/AdminPages/AdminSearchUsers";
import RootLayout from "./layouts/RootLayout";
import Create from "./pages/Create";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SingleAddonPage from "./pages/SingleAddonPage";
import Profile from "./pages/Profile";
import SingleUserPage from "./pages/SingleUserPage";
import AdminVerifyUsers from "./pages/AdminPages/AdminVerifyUsers";
import ForgotPassword from "./pages/ForgotPassword";
import SuccessPurchasePage from "./pages/SuccessPurchasePage";
import AppInitializers from "./AppInitializers";
import MainPage from "./pages/MainPage";
import NewsFeedPage from "./pages/NewsFeedPage";
import Footer from "./components/Footer/Footer";
import ChatButton from "./components/ChatButton/ChatButton";
import PageNotFound from "./pages/PageNotFound";
import About from "./components/About/About";
import AddonIdeas from "./pages/AddonIdeas";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<MainPage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/about" element={<About />} />
      <Route path="create" element={<Create />} />
      <Route path="profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/resetPassword" element={<ForgotPassword />} />
      <Route path="/single-addon-view/:addonId" element={<SingleAddonPage />} />
      <Route path="/adminSearchUsers" element={<AdminSearchUsers />} />
      <Route path="/adminRequests" element={<AdminRequests />} />
      <Route path="/adminVerifyUsers" element={<AdminVerifyUsers />} />
      <Route path="/view-user/:userId" element={<SingleUserPage />} />
      <Route path="/newsFeed" element={<NewsFeedPage />} />
      <Route path="/newsFeed/view-user/:userId" element={<SingleUserPage />} />
      <Route
       
        path="/single-addon-view/:addonId/view-user/:userId"
       
        element={<SingleUserPage />}
     
      />
      <Route path="/addon-ideas" element={<AddonIdeas />} />
      <Route path="/success" element={<SuccessPurchasePage />}></Route>
    </Route>
  )
);

function App() {
  return (
    <AppInitializers>
      <RouterProvider router={router} />
      <ChatButton />
      <Footer />
    </AppInitializers>
  );
}

export default App;
