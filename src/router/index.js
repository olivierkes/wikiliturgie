import Vue from "vue"
import Router from "vue-router"
import SearchBar from "@/components/SearchBar"
import Profile from "@/components/User/Profile"
import Signin from "@/components/User/Signin"

Vue.use(Router)

export default new Router({
 routes: [{
   path: "/",
   name: "SearchBar",
   component: SearchBar
  },
  {
   path: "/profile",
   name: "Profile",
   component: Profile
  },
  {
   path: "/signin",
   name: "Signin",
   component: Signin
  }
 ],
 mode: "history"
})