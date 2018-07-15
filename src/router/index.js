import Vue from "vue"
import Router from "vue-router"
import Search from "@/components/Search"
import Profile from "@/components/User/Profile"
import Signin from "@/components/User/Signin"
import AddText from "@/components/Texts/Add"
import ViewText from "@/components/Texts/View"
import Doc from "@/components/About/Doc"
import Blog from "@/components/About/Blog"

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
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/doc/:id?",
      name: "Doc",
      component: Doc,
      props: true
    },
    {
      path: "/blog/:id?",
      name: "Blog",
      component: Blog,
      props: true
    }
  ],
  mode: "history"
})