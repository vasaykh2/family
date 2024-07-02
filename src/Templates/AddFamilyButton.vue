//AddFamilyButton.vue
<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, withDefaults } from 'vue'
import spinner from '../assets/images/Spinner.svg'

interface IProps {
  title: string,
  limit: number,
  loading: boolean
}

const emit = defineEmits(['click'])
const props = withDefaults(defineProps<IProps>(), {
  title: '+ Прикрепить'
})
const isLimit = ref(props.limit > 0)
const isLoading = ref(props.loading)

watch(() => props.limit, (newVal) => {
  isLimit.value = newVal > 0
})

watch(() => props.loading, (newVal) => {
  isLoading.value = newVal
})

function handleClick() {
  if (isLimit.value && !isLoading.value) {
    emit('click')
    console.log('handleClick в AddFamilyButton.vue')
  }
}
</script>

<template>
  <div class="button" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-inner">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
.button {
  padding: 6px;
  background-color: #E9F4FF;
  border-radius: 12px;
  color: #366AF3;
  font-size: 13px;
  font-family: 'PT Sans', sans-serif;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: relative;
  max-width: 255px;
  height: 25px;
  box-sizing: border-box;

  .button-inner {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    .button-limit {
      display: block;
    }
  }

  .button-limit {
    display: none;
    color: #366AF3;
    background-color: #E9F4FF;
    padding: 8px;
    border-radius: 12px;
    position: absolute;
    left: calc(100% + 5px);
    top: 0;
    z-index: 999;

    &::before {
      width: 0;
      height: 0;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-right: 3px solid #2f2f2f;
      font-size: 0;
      line-height: 0;
      float: left;
      content: '';
      position: absolute;
      left: -3px;
      top: calc(50% - 3px);
    }
  }

  .loader {
    img {
      -webkit-animation: spin 4s infinite linear;
      animation: spin 4s infinite linear;
    }
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>
