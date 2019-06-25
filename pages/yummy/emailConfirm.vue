<template>
  <v-app id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Email Confirm Result</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>验证成功，请前往登录页登录</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="white--text" to="/yummy/login">Go to Sign in</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    const userType =
      window.location.href.indexOf("customer") > 0 ? "customer" : "shop";
    axios.get("/api/emailConfirm", {
      params: {
        userType: userType,
        email: decodeURI(window.location.search.split("mailto=")[1])
      }
    });
  }
};
</script>

<style>
</style>
