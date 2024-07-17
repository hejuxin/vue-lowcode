<template>
  <div class="app">
    <Editor v-model="state"></Editor>
    <!-- 双向绑定 -->
    <!-- <Editor :modelValue="state" @update:modelValue></Editor> -->
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue';
import Editor from './packages/editor';
import data from './data.json';
import { registerConfigInfo as config } from './utils/register';

const state = ref(data);
watch(() => {
  const { queue, current } = state.value;
  console.log(queue, current)
  if(current === -1) return;
  state.value.blocks = queue[current]
})

provide('config', config);
const mock = [
  {
    "top": 100,
    "left": 100,
    "zIndex": 1,
    "key": "text"
  },
  {
    "top": 200,
    "left": 200,
    "zIndex": 1,
    "key": "button"
  },
  {
    "top": 300,
    "left": 300,
    "zIndex": 1,
    "key": "input"
  }
]
function init(data) {
  state.value.current += 1;
  const { queue } = state.value;
  queue[state.value.current] = data
}

init(mock);
console.log(state)
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
