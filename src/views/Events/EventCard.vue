<template>
  <div class="card" style="width: 18rem">
    <img :alt="props.data.event_name" :src="coverImage" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">{{ props.data.event_name }}</h5>
      <router-link
        :to="{ name: 'event', params: { event_id: props.data.event_id } }"
        class="btn btn-primary d-block"
        >Ver más información</router-link
      >
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  props: {
    data: Object
  },
  setup(props) {
    const coverImage =
      import.meta.env.VITE_API_BASE_URL +
      '/images/events/' +
      props.data.event_id +
      '/' +
      props.data.event_cover_image

    return {
      coverImage,
      props
    }
  }
})
</script>

<style lang="less" scoped src="../../assets/less/events/EventCard.less"></style>
