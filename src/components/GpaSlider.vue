<template>
    <div>
        <h3>GPA Slider: <span>{{ gpa }}</span></h3>
        <label for="gpa-slider"></label>
        <div class="slider-component">
            <div class="slidecontainer">
                <input class="slider" type="range" min="0" max="4" step="0.01" v-model="gpa" id="gpa-slider">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gpa: 0,
        };
    },
};
</script>

<style scoped>
.slider-component .slidecontainer .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    border-radius: 2px;
    background: #c2c2c2;
    outline: none;
    opacity: 0.5;
    -webkit-transition: 0.2s;
    transition: 0.2s;
}
</style>