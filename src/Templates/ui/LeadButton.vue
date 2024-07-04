<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, withDefaults } from 'vue'
import spinner from '@/assets/images/Spinner.svg'
interface IProps {
  title: string,
  limit: number,
  loading: boolean
}
const emit = defineEmits(['click'])
const props = withDefaults(defineProps<IProps>(), {
  title: '+ Добавить семью'
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
  }
}
</script>

<template>
  <div class="button" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-inner">{{ title }} <span v-if="limit">({{ limit }})</span></span>
    <div class="button-limit" v-if="!isLimit">Лимит превышен</div>
  </div>
</template>

<style scoped lang="scss">
.button {
  padding: 8px 16px;
  background-color: rgba(233, 244, 255, 1);
  border-radius: 3px;
  color: rgba(54, 106, 243, 1);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  gap: 5px;
  position: relative;
  max-width: 150px;

  .button-inner {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.limited {
    background: rgba(245, 245, 245, 1);
    color: rgba(95, 108, 120, 1);
  }

  &:hover {
    .button-limit {
      display: block;
    }
  }

  .button-limit {
    display: none;
    color: rgba(245, 245, 245, 1);
    background: rgba(80, 81, 81, 1);
    padding: 8px;
    border-radius: 3px;
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
