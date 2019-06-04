const pkg = require("./package");

module.exports = {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    script: [
      {
        src:
          "http://api.map.baidu.com/api?v=3.0&ak=YqumXWri3yTAfPLQ3AWuwGKaM8Lx64FE"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: ["~/assets/style/app.styl"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/vuetify"
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    // "@nuxtjs/axios"
  ],
  /*
   ** Axios module configuration
   */
  // axios: {
  //   credentials: true    
  //   // See https://github.com/nuxt-community/axios-module#options
  // },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // transpile: ["vue-baidu-map"],
    extend(config, ctx) { }
  },
  generate: {
    /*
     ** You can extend webpack config here
     */
    // transpile: ["vue-baidu-map"],
    extend(config, ctx) { }
  }

};
