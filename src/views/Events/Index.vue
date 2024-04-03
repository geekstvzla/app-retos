<template>
  <div class="container">
    <h1 class="title">Eventos disponibles</h1>
    <div class="row">
      <div class="col-3" v-for="(event, index) in events" :key="index">
        <EventCard :data="event" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { ajax } from '../../utils/AjaxRequest'
import EventCard from './EventCard.vue'

export default defineComponent({
  components: {
    EventCard
  },
  setup() {
    const events = ref()

    onMounted(() => {
      activeEvents()
    })

    const activeEvents = () => {
      let ajaxData = {
        method: 'get',
        url: import.meta.env.VITE_API_BASE_URL + '/events/active-events'
      }

      ajax(ajaxData)
        .then(function (response) {
          console.log(response.data.response.events)
          events.value = response.data.response.events
        })
        .catch((error) => {
          console.log('=======')
          console.log(error)
        })
    }

    return {
      events
    }
  }
})
</script>

<style lang="less" scoped src="../../assets/less/events/Index.less"></style>
