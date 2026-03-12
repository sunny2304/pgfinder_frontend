import { createBrowserRouter,RouterProvider } from "react-router-dom"
import { Login } from "../components/Login"
import { Signup } from "../components/Signup"
import { UserNavbar } from "../components/user/UserNavbar"
import { AdminSidebar } from "../components/admin/AdminSidebar"
import { UserHome } from "../components/user/UserHome"
import UserProfile from "../components/user/UserProfile"
import SavedPgs from "../components/user/SavedPgs"
import MyBookings from "../components/user/MyBookings"
import { UseEffectDemo } from "../components/user/UseEffectDemo"
import { GetApiDemo } from "../components/user/GetApiDemo"
const router = createBrowserRouter([
    {path:"/",element:<Login/>},
    {path:"/signup",element:<Signup/>},
    {path:"/user",element:<UserNavbar/>,
        children:[
            {path:"home",element:<UserHome/>},
            {path:"bookings",element:<MyBookings/>},
            {path:"savedpgs",element:<SavedPgs/>},
            {path:"profile",element:<UserProfile/>},
            {path:"useeffectdemo",element:<UseEffectDemo/>},
            {path:"getapidemo",element:<GetApiDemo/>}
        ]
    },
    {path:"/admin",element:<AdminSidebar/>}

])

const AppRouter = ()=>{
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter