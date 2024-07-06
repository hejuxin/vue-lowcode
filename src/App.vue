<template>
  <div class="app">
    <Editor v-model="state"></Editor>
    <!-- <Editor :modalValue="state" @update:modalValue></Editor> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Editor from './packages/editor';
import data from './data.json';

const state = ref(data);
</script>

<style lang="scss">
.app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
