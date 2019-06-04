<template>
    <v-app id="home">
        <Header v-on:located="receiveLocation"></Header>
        <v-content>
            <v-container fluid grid-list-lg>
                <v-layout row wrap fill-height>
                    <v-flex v-for="(shop,index) in shops" v-bind:key="index" lg3 md4 xs12>
                        <Card :shop="shop" v-on:chosen="goTo"></Card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Card from "@/components/ShopCard";
import Header from "@/components/HeaderC";
import axios from "@/plugins/axios";
import { distanceFunc } from "../../../utils/util";

export default {
    components: {
        Card,
        Header
    },
    data() {
        return {
            shops: []
        };
    },
    methods: {
        receiveLocation(address) {
            axios.get("/api/shops").then(res => {
                this.shops = res.data.filter(
                    shop =>
                        distanceFunc(
                            shop.address.lng,
                            shop.address.lat,
                            address.lng,
                            address.lat
                        ) < 100
                );
            });
            this.shops = this.shops.filter(shop => {
                let dis = distanceFunc(
                    shop.address.lng,
                    shop.address.lat,
                    address.lng,
                    address.lat
                );
                if (dis < 100) {
                    return true;
                } else return false;
            });
        },
        goTo(shop) {
            window.location.href = "/yummy/customer/shop?shopId=" + shop.id;
        }
    }
    // created() {
    //     let vue = this;

    // }
};
</script>

<style>
</style>

