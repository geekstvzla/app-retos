<template>

    <DatesCarousel :datesGroup="datesGroup" />

    <h5 class="paid-pool">Esta quiniela es
        <span :class="'badge '+ paidPool.class">{{ paidPool.text }}
        <i class="bi bi-info-circle-fill"
           :data-bs-title="paidPool.tooltip"
           data-bs-toggle="tooltip"></i></span>
    </h5>

    <div id="gamesCarousel" class="carousel slide">
        <div class="carousel-inner">
            <div :class="(groupIndex === 0) ? 'carousel-item active' : 'carousel-item'" v-for="(group, groupIndex) in gameGroup" :key="groupIndex">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <h5 class="card-title">{{ group.fullDate }}</h5>
                            </div>
                            <div class="col card-save-button">
                                <button @click="confirmScores" class="btn btn-secondary" type="button" id="liveToastBtn">Guardar</button>
                            </div>
                        </div>
                        <div class="container-fluid" v-for="(game, gameIndex) in group.games" :key="gameIndex">
                            <div class="row">
                                <div class="col-12">
                                    <h2 class="group-title">{{ game.group }}</h2>
                                    <div class="table-responsive">
                                        <table class="table">
                                            <caption>
                                                <div>
                                                    <span>Hora del juego:</span> {{ game.hour }}
                                                </div>
                                                <div v-if="game.countdown > 0">
                                                    <span>Cambios hasta:</span>
                                                    <vue-countdown @end="game.countdown = 0"
                                                                   class="countdown"
                                                                   :time="game.countdown"
                                                                   v-slot="{ days, hours, minutes, seconds }">
                                                        <span>{{ days }} días {{ hours }} horas {{ minutes }} minutos {{ seconds }} segundos</span>
                                                    </vue-countdown>
                                                </div>
                                                <div>
                                                    <span>Estadio:</span> {{ game.stadium }}
                                                </div>
                                                <div>
                                                    <span :class="'badge '+ statusColor(game.status_id)">{{ game.status }}</span>
                                                </div>
                                            </caption>
                                            <thead>
                                                <tr>
                                                    <th scope="col" colspan="2">Equipo</th>
                                                    <th scope="col">Goles</th>
                                                    <th scope="col">Penalti</th>
                                                    <th scope="col">Resultado</th>
                                                    <th scope="col">Penalti</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="td-flag">
                                                        <img class="flag" :src="`/images/teams/flags/${ game.local_team_flag }`">
                                                    </td>
                                                    <td class="td-team-name">
                                                        <span class="name">{{ game.local_team }}</span>
                                                    </td>
                                                    <td>
                                                        <input @change="evaluateScore(groupIndex, gameIndex, 'user_local_score', 'user_visitor_score')"
                                                               @keypress="isNumber($event)"
                                                               class="form-control score-input"
                                                               :disabled="enableScore(game)"
                                                               v-model="game.user_local_score">
                                                    </td>
                                                    <td>
                                                        <input @change="evaluateScore(groupIndex, gameIndex, 'user_local_penalty_score', 'user_visitor_penalty_score')"
                                                               @keypress="isNumber($event)"
                                                               class="form-control score-input"
                                                               :disabled="enablePenalty(game.has_penalty, groupIndex, gameIndex)"
                                                               v-model="game.user_local_penalty_score">
                                                    </td>
                                                    <td>
                                                        <input class="form-control score-input" disabled="disabled" v-model.number="game.local_score">
                                                    </td>
                                                    <td>
                                                        <input class="form-control score-input" disabled="disabled" v-model.number="game.local_penalty_score">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-flag">
                                                        <img class="flag" :src="`/images/teams/flags/${ game.visitor_team_flag }`">
                                                    </td>
                                                    <td class="td-team-name">
                                                        {{ game.visitor_team }}
                                                    </td>
                                                    <td>
                                                        <input @change="evaluateScore(groupIndex, gameIndex, 'user_visitor_score', 'user_local_score')"
                                                               @keypress="isNumber($event)"
                                                               :disabled="enableScore(game)"
                                                               class="form-control score-input"
                                                               v-model="game.user_visitor_score">
                                                    </td>
                                                    <td>
                                                        <input @change="evaluateScore(groupIndex, gameIndex, 'user_visitor_penalty_score', 'user_local_penalty_score')"
                                                               @keypress="isNumber($event)"
                                                               class="form-control score-input"
                                                               :disabled="enablePenalty(game.has_penalty, groupIndex, gameIndex)"
                                                               v-model.number="game.user_visitor_penalty_score">
                                                    </td>
                                                    <td>
                                                        <input class="form-control score-input" disabled="disabled" v-model.number="game.visitor_score">
                                                    </td>
                                                    <td>
                                                        <input class="form-control score-input" disabled="disabled" v-model.number="game.visitor_penalty_score">
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Toast :actionButton="toastStore.state.actionButton"
           :autohide="toastStore.state.autohide"
           :closeButton="toastStore.state.closeButton"
           :ids="['confirmSaveUserScore']"
           :loading="toastStore.state.loading"
           :message="toastStore.state.message"
           :placement="toastStore.state.placement"
           :title="toastStore.state.title"
           :type="toastStore.state.type"
           @actionClicked="saveScores"
           @toastClosed="toastStore.close()" />

</template>

<script>

import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUtils } from '../../js/components/Utils.js'
import moment from 'moment/min/moment-with-locales'
import DatesCarousel from './DatesCarousel.vue'
import Toast from '../../js/components/Toast.vue'
import { useToastStore } from '../../js/components/stores/toast.js'
import { useUserAccountStore } from '../../js/stores/userAccount.js'
import * as bootstrap from 'bootstrap'
import VueCountdown from '@chenfengyuan/vue-countdown';

export default defineComponent({
    components: {
        DatesCarousel,
        Toast,
        VueCountdown
    },
    setup() {

        const datesGroup = reactive([])
        const gameGroup = reactive([])
        const paidPool = reactive({
            class: "",
            paid: false,
            text: "",
            tooltip: ""
        })
        const route = useRoute()
        const toast = ref()
        const toastStore = useToastStore()
        const userAccount = useUserAccountStore()
        const utils = useUtils()

        onMounted(() => {

            let toastEle = document.getElementById('confirmSaveUserScore')

            toastEle.addEventListener('hidden.bs.toast', () => {
                toastStore.close()
            })

            toast.value = bootstrap.Toast.getOrCreateInstance(toastEle)

            moment.locale('es')
            eventGames()

        })

        const eventGames = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventId: route.params.id,
                    poolId: (route.params.pool_id) ? route.params.pool_id : null
                },
                url: "/eventGames"
            }

            utils.ajaxRequest(ajaxData)
            .then(function (response) {

                var date = null;
                response.data.games.forEach((game, index) => {

                    game.user_local_penalty_score = validateScore(game.user_local_penalty_score)
                    game.user_local_score = validateScore(game.user_local_score)
                    game.user_visitor_penalty_score = validateScore(game.user_visitor_penalty_score)
                    game.user_visitor_score = validateScore(game.user_visitor_score)
                    game.hour = moment(game.date).format('hh:mm A')

                    let deadline = new Date(Date.parse(game.deadline))
                    let now = new Date();
                    game.countdown = (deadline > now) ? (deadline - now) : 0

                    const gamesDate = moment(game.date).format('DD MMMM YYYY')
                    if(gamesDate !== date) {

                        gameGroup.push({
                            fullDate: gamesDate,
                            games: [game]
                        })
                        datesGroup.push({
                            day: moment(game.date).format('ddd'),
                            date: moment(game.date).format('DD MMM'),
                        })
                        date = gamesDate

                    } else {
                        gameGroup[gameGroup.length - 1].games.push(game)
                    }

                });

                paidPool.class = (response.data.paid_pool) ? "text-bg-success" : "text-bg-warning"
                paidPool.paid = response.data.paid_pool
                paidPool.text = (response.data.paid_pool) ? "Paga" : "Gratis"
                paidPool.tooltip = (response.data.paid_pool) ? "Participa por el premio" : "No participa por el premio"

            })
            .catch(error => {


            })

        }

        const isNumber = (event, groupIndex, gameIndex, targetField) => {

            let regex = /^\d+$/;
            (
                !regex.test(event.key) ||
                event.target.value.length > 1 ||
                parseInt(event.target.value) === 0
            ) ? event.preventDefault() : true

        }

        const evaluateScore = (groupIndex, gameIndex, targetField, fieldToEvaluate) => {

            if(gameGroup[groupIndex].games[gameIndex][targetField] === '' && gameGroup[groupIndex].games[gameIndex][fieldToEvaluate] !== null) {
                gameGroup[groupIndex].games[gameIndex][targetField] = 0;
            }

            /*if(gameGroup[groupIndex].games[gameIndex][targetField] === '') {
                gameGroup[groupIndex].games[gameIndex][fieldToEvaluate] = null
            }else if(isNaN(gameGroup[groupIndex].games[gameIndex][targetField])) {
                gameGroup[groupIndex].games[gameIndex][fieldToEvaluate] = null
            }*/

        }

        const confirmScores = () => {

            if(userAccount.state.id !== null) {

                var toastData = {
                    actionButton: {
                        show: true,
                        text: "Guardar"
                    },
                    autohide: false,
                    closeButton: {
                        show: true
                    },
                    placement: "middle-center",
                    message: "¿Quieres guardar tus resultados?",
                    type: "warning"
                }

            } else {

                var toastData = {
                    closeButton: {
                        show: true,
                        text: "Ok"
                    },
                    message: "Debes iniciar sesión para participar",
                    placement: "middle-center",
                    type: "warning"
                }

            }

            toastStore.setToastState(toastData)
            toast.value.show()

        }

        const saveScores = () => {

            toastStore.loading(true)
            const games = []
            gameGroup.forEach((group, groupIndex) => {

                group.games.forEach((game, gameIndex) => {

                    games.push({
                        event_id: game.event_id,
                        game_id: game.game_id,
                        user_local_score: validateScore(game.user_local_score),
                        user_local_penalty_score: validateScore(game.user_local_penalty_score),
                        user_visitor_penalty_score: validateScore(game.user_visitor_penalty_score),
                        user_visitor_score: validateScore(game.user_visitor_score)
                    })

                })

            })

            let ajaxData = {
                method: "post",
                params: {
                    eventId: route.params.id,
                    poolId: (route.params.pool_id) ? route.params.pool_id : null,
                    scores: games
                },
                url: "/saveUserPool"
            }

            utils.ajaxRequest(ajaxData)
            .then(function (response) {

                toastStore.loading(false)
                toast.value.hide()

                if(response.data["response"] === false && response.data["logged"] === false) {

                    setTimeout(() => {

                        var toastData = {
                            closeButton: {
                                show: true,
                                text: "Ok"
                            },
                            message: "Tu sesión ha expirado, por favor inicie sesión.",
                            placement: "middle-center",
                            type: "warning"
                        }

                        toastStore.setToastState(toastData)
                        toast.value.show()

                    }, "800")

                }

            })
            .catch(error => {
                toastStore.loading(false)
                toast.value.hide()
            })

        }

        const validateScore = (score) => {
            return (typeof score === "undefined" || score === null) ? null : parseInt(score)
        }

        const enableScore = (game) => {

            if(game.status_id === 1 && game.countdown > 0) {
                return false
            }else if(game.status_id === 1 && game.countdown === 0) {
                return true
            }else{
                return true
            }

        }

        const enablePenalty = (hasPenalty, groupIndex, gameIndex) => {

            if(hasPenalty) {

                if(
                    gameGroup[groupIndex].games[gameIndex].user_local_score === '' ||
                    gameGroup[groupIndex].games[gameIndex].user_local_score === null ||
                    gameGroup[groupIndex].games[gameIndex].user_visitor_score === '' ||
                    gameGroup[groupIndex].games[gameIndex].user_visitor_score === null
                ) {

                    gameGroup[groupIndex].games[gameIndex].user_local_penalty_score = null
                    gameGroup[groupIndex].games[gameIndex].user_visitor_penalty_score = null
                    return true

                } else if(gameGroup[groupIndex].games[gameIndex].user_local_score !== gameGroup[groupIndex].games[gameIndex].user_visitor_score) {

                    gameGroup[groupIndex].games[gameIndex].user_local_penalty_score = null
                    gameGroup[groupIndex].games[gameIndex].user_visitor_penalty_score = null
                    return true

                } else {
                    return false
                }

            } else {

                gameGroup[groupIndex].games[gameIndex].user_local_penalty_score = null
                gameGroup[groupIndex].games[gameIndex].user_visitor_penalty_score = null
                return true

            }

        }

        const statusColor = (status) => {

            let badge = {
                1: "text-bg-primary",
                2: "text-bg-success",
                3: "text-bg-warning",
                4: "text-bg-primary",
                5: "text-bg-warning"
            }

            return (badge[status]) ? badge[status]: "text-bg-secondary"

        }

        return {
            confirmScores,
            datesGroup,
            enablePenalty,
            enableScore,
            evaluateScore,
            gameGroup,
            isNumber,
            paidPool,
            route,
            saveScores,
            statusColor,
            toastStore
        }

    }
})

</script>

<style lang="less" scoped src="../../less/events/pool.less"></style>
