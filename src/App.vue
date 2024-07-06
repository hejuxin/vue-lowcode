<template>
  <div class="app">
    <Editor v-model="state"></Editor>
    <!-- <Editor :modalValue="state" @update:modalValue></Editor> -->
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import Editor from './packages/editor';
import data from './data.json';
import { registerConfigInfo as config } from './utils/register';

const state = ref(data);
provide('config', config);
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
