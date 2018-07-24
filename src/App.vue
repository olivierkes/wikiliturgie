<template>
<v-app>
  <v-toolbar app
             clipped-left
             clipped-right
             flat
             dense
             :dark="backgroundImage=='dark'"
             scroll-toolbar-off-screen
             :scroll-threshold="77"
             :class="backgroundImage ? 'bg' : ''">
             <v-toolbar-items v-if="arrowBackVisible">
               <v-btn flat icon @click.native.stop="$router.go(-1)">
                 <v-icon>arrow_back</v-icon>
               </v-btn>
             </v-toolbar-items>
    <v-toolbar-title>
      <router-link to="/"
                   tag="span"
                   style="cursor: pointer">{{ title }}</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat
             v-for="(item, i) in menuItems"
             :key="i"
             :icon="$vuetify.breakpoint.xs"
             :to="item.link">
        <v-icon :left="!$vuetify.breakpoint.xs">{{ item.icon }}</v-icon>{{ !$vuetify.breakpoint.xs? item.title : '' }}</v-btn>
      <v-btn flat
             to="/profile"
             v-if="userIsAuthenticated">
        <v-badge overlap
                 :color="userRole == 'admin' || userRole == 'modo'? 'red' : 'green'"> <span slot="badge"
                v-if="notificationsForUser">{{notificationsForUser}}</span>
          <v-avatar size="32px"><img :src="user.photoURL" /></v-avatar>
        </v-badge>
      </v-btn>
    </v-toolbar-items>
    <v-progress-linear v-if="loader"
                       slot="extension"
                       :indeterminate="true"
                       class="mt-0 mb-0"
                       height="4"
                       style="z-index: 3;"></v-progress-linear>
  </v-toolbar>
  <v-content>
    <data-loading-status v-if="!dataLoaded"></data-loading-status>
    <keep-alive include="Search">
      <router-view v-if="dataLoaded"></router-view>
    </keep-alive>
    <v-divider></v-divider>
  </v-content>
  <snackbar></snackbar>
  <custom-dialog></custom-dialog>
</v-app>
</template>

<script>
import Vuex from "vuex"
export default {
  name: 'App',
  data() {
    return {
      leftDrawer: false,
      fixed: false,
      title: 'WikiLiturgie'
    }
  },
  computed: { ...Vuex.mapGetters({
      userIsAuthenticated: "users/userIsAuthenticated",
      user: "users/user",
      userRole: "users/userRole",
      avatar: "users/avatar",
      notificationsForUser: "users/notificationsForUser",
      loader: "components/loader",
      backgroundImage: "components/backgroundImage",
      arrowBackVisible: "components/arrowBackVisible"
    }),
    dataLoaded() {
      return this.$store.getters.dataLoaded
    },
    menuItems() {
      var res = [{
        icon: "help",
        title: "Aide",
        link: "/doc"
      }, {
        icon: "info",
        title: "Blog",
        link: "/blog"
      }, ]
      if (!this.userIsAuthenticated) {
        return res.concat([{
          icon: "person",
          title: "Connexion",
          link: "/signin"
        }])
      } else {
        return res
      }
    }
  }
}
</script>

<style>
/* SimpleMDE: https://github.com/F-loat/vue-simplemde */

@import '~simplemde-theme-base/dist/simplemde-theme-base.min.css';
.v-toolbar__extension {
  height: auto !important;
  padding: 0;
}

main.v-content {
  padding: 48px 0px 32px !important;
}


.theme--light div.application--wrap>nav.v-toolbar.v-toolbar--fixed {
  border-bottom: thin solid #0000001f !important;
}
.theme--dark div.application--wrap>nav.v-toolbar.v-toolbar--fixed {
  border-bottom: thin solid #ffffff1f !important;
}

div.application--wrap>nav.v-toolbar.v-toolbar--fixed.bg {
  background-color: #ffffff33 !important;
}
</style>
