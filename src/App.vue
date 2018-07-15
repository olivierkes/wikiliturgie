<template>
<v-app>
  <v-navigation-drawer clipped
                       v-model="leftDrawer"
                       app
                       v-if="$vuetify.breakpoint.smAndDown">
    <v-list>
      <v-list-tile value="true"
                   v-for="(item, i) in menuItems"
                   :key="i"
                   :to="item.link">
        <v-list-tile-action>
          <v-icon v-html="item.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <!-- Profile -->
      <v-subheader v-if="userIsAuthenticated">Profile</v-subheader>
      <v-list-tile to="/profile"
                   v-if="userIsAuthenticated">
        <v-list-tile-action>
        <v-badge color="red"><span slot="badge"
                v-if="notificationsForUser">{{notificationsForUser}}</span>
          <v-avatar size="36px"><img :src="user.photoURL" /></v-avatar>
        </v-badge>
        </v-list-tile-action>
        <v-list-tile-content> {{ user.displayName }} </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app
             clipped-left
             clipped-right
             class="grey lighten-5"
             flat
             dense>
    <v-toolbar-side-icon v-if="$vuetify.breakpoint.xs"
                         @click.stop="leftDrawer = !leftDrawer"></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link to="/"
                   tag="span"
                   style="cursor: pointer">{{ title }}</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="!$vuetify.breakpoint.xs">
      <v-btn flat
             v-for="(item, i) in menuItems"
             :key="i"
             :to="item.link">
        <v-icon left>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>
      <v-btn flat
             to="/profile"
             v-if="userIsAuthenticated">
             <v-badge color="red"><span slot="badge"
                     v-if="notificationsForUser">{{notificationsForUser}}</span>
        <v-avatar size="36px"><img :src="user.photoURL" /></v-avatar>
      </v-badge>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-content>
    <v-divider></v-divider>
    <data-loading-status v-if="!dataLoaded"></data-loading-status>
    <router-view v-if="dataLoaded"></router-view>
  </v-content>
  <snackbar></snackbar>
  <custom-dialog></custom-dialog>
  <v-footer :fixed="fixed"
            app> <span>&copy; 2017</span> </v-footer>
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
      userIsAuthenticated: "users/isAuthenticated",
      user: "users/user",
      avatar: "users/avatar",
      notificationsForUser: "users/notificationsForUser"
    }),
    dataLoaded() {
      return this.$store.getters.dataLoaded
    },
    menuItems() {
      var res = [{
        icon: "help",
        title: "Aide",
        link: "/doc"
      },{
        icon: "info",
        title: "Blog",
        link: "/blog"
      },]
      if (!this.userIsAuthenticated) {
        return res.concat([{
          icon: "person",
          title: "Connexion",
          link: "/signin"
        }])
      } else {
        return res.concat([{
          icon: "dns",
          title: "Tags",
          link: "/tags"
        }])
      }
    }
  }
}
</script>

<style>
  /* SimpleMDE: https://github.com/F-loat/vue-simplemde */
  @import '~simplemde-theme-base/dist/simplemde-theme-base.min.css';
</style>
