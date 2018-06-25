import Vue from "vue"
import Router from "vue-router"
import Search from "@/components/Search"
import Profile from "@/components/User/Profile"
import Signin from "@/components/User/Signin"
import AddText from "@/components/Texts/Add"
import ViewText from "@/components/Texts/View"
import ViewTags from "@/components/Tags/View"


Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      name: "Search",
      component: Search
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
      path: "/tags",
      name: "ViewTags",
      component: ViewTags,
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