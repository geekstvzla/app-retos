<template>
    <div class="container" id="wrapper-menu">
        <div class="row d-flex">
            <div class="col-auto me-auto">
                <router-link :to="{ name: 'home' }" class="navbar-brand">
                    Sumando Kilómetros
                </router-link>
            </div>
            <div class="col-auto">
                <nav class="navbar navbar-expand-lg">
                    <button class="navbar-toggler"
                            data-bs-toggle="collapse"
                            data-bs-target="#headerMenu">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="headerMenu">
                        <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Eventos
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Caminata</a></li>
                                    <li><a class="dropdown-item" href="#">Carrera</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div class="col-auto">
                <div class="dropdown" v-if="userLogged">
                    <button aria-expanded="false"
                            class="btn dropdown-toggle user-account"
                            data-bs-toggle="dropdown"
                            type="button">
                        <img :src="userAccount.state.avatar" class="mx-auto d-block">
                        <i class="bi bi-caret-down-fill"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item">{{ userAccount.state.username }}</a>
                            <!-- <router-link :to="{ name: 'account', params: { user_id : userAccount.state.id } }" class="dropdown-item user_name">{{ userAccount.state.nickname }}</router-link> -->
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a @click="logout" class="dropdown-item">Salir</a></li>
                    </ul>
                </div>
                <div class="btn-group" role="group">
                    <router-link :to="{ name: 'sign-in' }" class="btn" v-if="showLogin">Entrar</router-link>
                    <router-link :to="{ name: 'sign-up' }" class="btn" v-if="showSignUp">Registrarse</router-link> 
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useUserAccountStore } from '../../stores/UserAccount.js'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    setup() {

        const route = useRoute()
        const userAccount = useUserAccountStore()

        const showLogin = computed(function() {
            return (route.name !== 'sign-in' && userAccount.state.id === null)
        })

        const showSignUp = computed(function() {
            return (route.name !== 'sign-up' && userAccount.state.id === null)
        })

        const userLogged = computed(function() {
            return userAccount.state.id !== null
        })

        const logout = function() {

            localStorage.clear();
            userAccount.updateState()
            this.$router.push({ name: "home" });

        }

        return {
            logout,
            route,
            showLogin,
            showSignUp,
            userAccount,
            userLogged
        }

    }
})

</script>

<style lang="less" scoped src="../../assets/less/components/Menu.less"></style>
