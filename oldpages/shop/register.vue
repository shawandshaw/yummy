<template>
  <v-app id="register">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>Register form</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  prepend-icon="person"
                  v-model="username"
                  :rules="nameRules"
                  required
                  name="username"
                  label="Username"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  prepend-icon="lock"
                  v-model="passwordAgain"
                  :rules="passwordAgainRules"
                  name="passwordAgain"
                  label="Password Again"
                  id="passwordAgain"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn to="/shop/login" flat>
                <v-icon>arrow_back</v-icon>Login
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey darken-2" @click="submit" class="white--text">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <Footer/>
  </v-app>
</template>

<script>
import axios from '@/assets/axios'
import MD5 from 'crypto-js/md5'
import Footer from '@/components/Footer'
export default {
  components: {
    Footer
  },
  data() {
    let vue=this;
    return {
      username: "",
      password: "",
      passwordAgain: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      passwordRules: [
        v => !!v || "password is required",
        v => (v && v.length >= 6) || "Password must be more than 6 characters"
      ],
      passwordAgainRules: [
        v => !!v || "password is required",
        v => (v && v == vue.password) || "Passwords are not the same"
      ]
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        let salt=(Math.floor(Math.random()*10000));
        let passwordHash=MD5(this.password).toString();
        axios.post("/api/register", {
          salt: salt,
          username: this.username,
          password: passwordHash
        }).then(res=>{
          if(res.data.status=="success"){
            alert("register successfully!")
            this.$router.push('/shop/login')
          }else{
            alert(res.data.message)
          }
        })
      }
    }
  }
};
</script>

<style>
</style>
