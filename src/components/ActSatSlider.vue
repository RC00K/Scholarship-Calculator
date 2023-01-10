<template>
    <div>
        <h3>ACT/SAT Slider: <span>{{ actSatScore }}</span></h3>
        <label for="act-sat-slider"></label>
        <input type="range" min="0" max="36" step="1" v-model="actSatScore" id="act-sat-slider">
    </div>
</template>

<script>
export default {
    data() {
        return {
            actSatScore: 0,
        };
    },
};
</script>