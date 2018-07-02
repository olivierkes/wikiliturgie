<template>
<v-container grid-list-md
             fill-height>
  <v-layout align-center
            justify-center>
    <v-flex xs12
            sm8
            md6>
      <!-- <v-progress-circular indeterminate
                           color="primary"></v-progress-circular> -->
      <v-card>
        <v-card-text>
          <h3 class="text-xs-center font-weight-light">Chargement des données</h3>
          <v-container>
            <v-layout row
                      align-center>
              <v-flex xs5>
                <v-progress-circular :rotate="360"
                                     :size="100"
                                     :width="15"
                                     :value="progress"
                                     color="teal"> {{ Math.round(progress) }}% </v-progress-circular>
              </v-flex>
              <v-flex xs7>
                <v-list dense>
                  <v-list-tile v-for="modules in dataLoadingProgress.modules">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ modules.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon v-if="!modules.loaded">cached</v-icon>
                      <v-icon v-if="modules.loaded"
                              color="green darken-2">check</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { db } from '@/firebase'
import Vuex from "vuex"
export default {
  computed: { ...Vuex.mapGetters({
      dataLoaded: "dataLoaded",
      dataLoadingProgress: "dataLoadingProgress"
    }),
    progress() {
      return this.dataLoadingProgress.total || 0
    }
  }
}
</script>
