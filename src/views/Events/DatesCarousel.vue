<template>

    <div class="row mx-auto my-auto justify-content-center">
        <div class="col-11">
        <vueper-slides
            :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }"
            :bullets="false"
            class="no-shadow"
            :dragging-distance="200"
            disable-arrows-on-edges
            :fixed-height="true"
            :gap="1"
            id="datesCarousel"
            slide-multiple
            :slide-ratio="1 / 4"
            :visible-slides="6">
            <vueper-slide class="d-grid" v-for="(group, index) in props.datesGroup" :key="index" :title="index.toString()">
                <template #content>
                    <button aria-current="true"
                            :class="(index === 0) ? 'active btn' : 'btn'"
                            :data-bs-slide-to="index"
                            data-bs-target="#gamesCarousel"
                            type="button">
                                <div>{{ group.day }}</div>
                                <div>{{ group.date }}</div>
                    </button>
                </template>
                <template #arrow-left class="test">
                    <i class="icon icon-arrow-left" style="font-size:12px;" />
                </template>
                <template #arrow-right>
                    <i class="icon icon-arrow-right" />
                </template>
            </vueper-slide>
        </vueper-slides>
        </div>
    </div>

</template>

<script>

import { defineComponent } from 'vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default defineComponent({
    components: {
        VueperSlide,
        VueperSlides
    },
    props: {
        datesGroup: Object
    },
    setup(props) {

        return {
            props
        }

    }
})

</script>

<style lang="less" scoped src="../../less/events/datesGroup.less"></style>
