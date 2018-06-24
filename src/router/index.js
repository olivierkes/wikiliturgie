import Vue from "vue"
import Router from "vue-router"
import SearchBar from "@/components/SearchBar"
import Profile from "@/components/User/Profile"
import Signin from "@/components/User/Signin"
import AddText from "@/components/Texts/Add"
import ViewText from "@/components/Texts/View"


Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      name: "SearchBar",
      component: SearchBar
    },
    {
      path: "/text/add",
      name: "AddText",
      component: AddText
    },
    {
      path: "/text/:id",
      name: "ViewText",
      component: ViewText,
      props: true,
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