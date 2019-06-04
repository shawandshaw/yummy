
<template>
  <v-card>
    <v-toolbar color="pink" dark>
      <v-toolbar-title>
        <v-icon>place</v-icon>选择您的位置
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div>
      <baidu-map
        class="bm-view"
        @ready="mapReady"
        @load="load"
        :center="location"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @moving="syncCenterAndZoom"
        @moveend="syncCenterAndZoom"
        @zoomend="syncCenterAndZoom"
        ak="YqumXWri3yTAfPLQ3AWuwGKaM8Lx64FE"
      >
          <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 9999}">
          <v-text-field
            type="text"
            v-model="keyword"
            append-icon="search"
            placeholder="请输入搜索关键字"
            class="serachinput"
          ></v-text-field>          
          </bm-auto-complete>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
        ></bm-geolocation>
        <bm-view style="width: 100%; height:400px;"></bm-view>
        <bm-marker :position="{lng:marker.lng,lat:marker.lat}"></bm-marker>
      </baidu-map>
    </div>
    <v-layout justify-end>
      <v-btn @click="cancel">取消</v-btn>
      <v-btn @click="confirm">确定</v-btn>
    </v-layout>
  </v-card>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
import BmAutoComplete from 'vue-baidu-map/components/others/AutoComplete.vue'
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'
export default {
  props: ["initLocation"],
  components:{
    BaiduMap,
    BmView,
    BmMarker,
    BmNavigation,
    BmGeolocation,
    BmAutoComplete
  },
  data: function() {
    return {
      map: {},
      keyword: "",
      marker: { lng: 116.404, lat: 39.915 },
      zoom: 18,
      showComplete: false
    };
  },
  computed: {
    location() {
      if (this.keyword) {
        return this.keyword;
      } else {
        return this.initLocation.name;
      }
    }
  },
  methods: {
    mapReady({ BMap, map }) {
      let vue = this;
      this.map = map;
      this.showComplete = true;
      console.log("百度地图初始化完成");
      console.log("地图初始化地点:" + this.initLocation.name);
      map.centerAndZoom(
        { lng: this.initLocation.lng, lat: this.initLocation.lat },
        this.zoom
      );
    },
    /***
     * 地图点击事件。
     */

    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.marker.lng = lng;
      this.marker.lat = lat;
      this.zoom = e.target.getZoom();
    },
    /***
     * 确认
     */
    confirm: function() {
      const vue = this;
      if (this.keyword == this.location && this.location != "") {
        this.$emit("mapConfirm", {
          name: vue.location,
          lng: vue.marker.lng,
          lat: vue.marker.lat
        });
      } else {
        this.$emit("mapCancel");
      }
    },
    /***
     * 取消
     */
    cancel: function() {
      this.$emit("mapCancel");
    },
    load(e) {
      this.map.centerAndZoom(
        { lng: this.initLocation.lng, lat: this.initLocation.lat },
        this.zoom
      );
    }
  }
};
</script>
 
<style scoped>
</style>