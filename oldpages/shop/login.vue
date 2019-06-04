<template>
  <v-app id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>Login form</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  prepend-icon="person"
                  name="username"
                  label="Username"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  @keyup.enter="submit"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn to="/shop/register" flat>
                <v-icon>arrow_back</v-icon>Register
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey darken-2" class="white--text" @click="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <Footer/>
  </v-app>
</template>

<script>
import axios from "@/assets/axios";
import MD5 from "crypto-js/md5";
import Footer from '@/components/Footer'
export default {
  components: {
    Footer
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    submit: function() {
      const password = MD5(this.password).toString();
      axios
        .post("/api/login", {
          username: this.username,
          password: password
        })
        .then(res => {
          if (res.data.status == "success") {
              window.location.href = "/shop/home"
          }else{
            alert(res.data.message)
          }
        });
    }
  }
};
</script>

<style>
</style>
