<template>
<v-app>
  <v-navigation-drawer clipped
                       v-model="leftDrawer"
                       app
                       v-if="$vuetify.breakpoint.smAndDown">
    <v-list>
      <v-list-tile value="true"
                   v-for="(item, i) in items"
                   :key="i">
        <v-list-tile-action>
          <v-icon v-html="item.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer right
                       v-model="rightDrawer"
                       app
                       clipped
                       v-if="$vuetify.breakpoint.smAndDown">
    <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>compare_arrows</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Liturgie</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app
             clipped-left
             clipped-right
             class="primary"
             dark
             flat
             dense>
    <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer"></v-toolbar-side-icon>
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
             :to="item.link">
        <v-icon left>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>
      <v-btn flat
             to="/profile"
             v-if="userIsAuthenticated">
        <v-avatar size="36px"><img :src="avatarUrl" /></v-avatar>
      </v-btn>
    </v-toolbar-items>
    <v-btn icon
           @click.stop="rightDrawer = !rightDrawer">
      <v-icon>menu</v-icon>
    </v-btn>
  </v-toolbar>
  <v-content>
    <v-container fluid
                 fill-height
                 grid-list-md>
      <v-layout row
                wrap>
        <v-flex xs12
                md3
                v-if="$vuetify.breakpoint.mdAndUp">
          <v-card v-if="leftDrawer">
            <v-card-title>Comme ça</v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12
                md6>
          <!-- <SearchBar/> -->
          <router-view></router-view>
        </v-flex>
        <v-flex xs12
                md3
                v-if="$vuetify.breakpoint.mdAndUp">
          <v-card v-if="rightDrawer">
            <v-card-title>Comme ça</v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  <v-footer :fixed="fixed"
            app> <span>&copy; 2017</span> </v-footer>
</v-app>
</template>

<script>
import SearchBar from './components/SearchBar'
export default {
  name: 'App',
  components: {
    SearchBar
  },
  data() {
    return {
      clipped: false,
      leftDrawer: false,
      fixed: false,
      items: [{
        icon: 'filters',
        title: 'Filters'
      }],
      rightDrawer: false,
      title: 'WikiLiturgie'
    }
  },
  computed: {
    userIsAuthenticated() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    avatarUrl() {
      return this.$store.getters.user["providerData"][0]["photoURL"]
    },
    menuItems() {
      if (!this.userIsAuthenticated) {
        return [{
          icon: "person",
          title: "Connexion",
          link: "/signin"
        }]
      } else {
        return []
      }
    }
  }
}
</script>
