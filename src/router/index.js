import Vue from "vue"
import Router from "vue-router"
import Search from "@/components/Search"
import Profile from "@/components/User/Profile"
import Signin from "@/components/User/Signin"
import AddText from "@/components/Texts/Add"
import ViewText from "@/components/Texts/View"
import ViewTags from "@/components/Tags/View"
import Users from "@/components/User/Users"
import Doc from "@/components/Doc/Doc"

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
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
      path: "/users",
      name: "Users",
      component: Users
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/doc/:id",
      name: "Doc",
      component: Doc,
      props: true
    },
    {
      path: "/doc",
      name: "Doc",
      component: Doc
    },
  ],
  mode: "history"
})