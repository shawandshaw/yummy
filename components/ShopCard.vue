<template>
  <v-card color="cyan darken-2" class="white--text">
    <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img>
    <v-layout>
      <v-flex>
        <v-card-title>
          <div>
            <div class="headline">
              {{shop.name}}
              <span class="body-1">
                <v-icon small>place</v-icon>
                {{shop.address.name}}
              </span>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout align-center>
              <v-icon>star</v-icon>
              {{shop.description}}
          </v-layout>
        </v-card-text>
      </v-flex>
    </v-layout>
    <v-divider light></v-divider>
    <v-card-actions class="pa-3">
      <v-layout align-center>
        <div>
          <v-icon small>class</v-icon>
          {{shop.type}}
        </div>
        <v-spacer/>
        <v-btn @click="bubleData()" icon>
          <v-icon>arrow_forward</v-icon>
        </v-btn>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["shop"],
  methods: {
    bubleData() {
      this.$emit("chosen", this.shop);
    }
  }
};
</script>


