//AddDeductButton.vue
<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, withDefaults } from 'vue'
import spinner from '../../assets/images/Spinner.svg'

interface IProps {
  type: 'add' | 'deduct' | 'edit' | 'text',
  title: string,
  // subtitle: string,
  limit: number,
  loading: boolean
}

const emit = defineEmits(['click'])
const props = withDefaults(defineProps<IProps>(), {
  title: 'Прикрепить',
  // subtitle: '+'
})
const isLimit = ref(props.limit > 0)
const isLoading = ref(props.loading)
const type = ref(props.type)

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
  <div v-if="type === 'add'" class="button-add" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-add-inner-subtitle">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_31820_69)">
          <path d="M1.875 6H10.125" stroke="#366AF3" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 1.875V10.125" stroke="#366AF3" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_31820_69">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </span>
    <span class="button-add-inner-title">{{ title }}</span>
  </div>
  <div v-if="type === 'deduct'" class="button-deduct" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-deduct-inner-subtitle">
      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_31502_83405)">
          <path d="M1.875 6.5H10.125" stroke="#FF8484" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_31502_83405">
            <rect width="12" height="12" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </span>
    <span class="button-deduct-inner-title">{{ title }}</span>
  </div>
  <div v-if="type === 'edit'" class="button-edit" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-edit-inner-subtitle">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.08832 1H7.01412C6.50729 1 6.06873 1.35265 5.95996 1.84767V1.84767C5.88475 2.18992 5.64808 2.47435 5.32521 2.61052L5.12002 2.69706C4.80219 2.8311 4.4358 2.80579 4.13742 2.63273V2.63273C3.71416 2.38723 3.17274 2.45227 2.82507 2.79656L2.78488 2.83637C2.44459 3.17336 2.38653 3.70251 2.64566 4.10527V4.10527C2.83118 4.39364 2.85838 4.75624 2.71794 5.06905L2.58706 5.36057C2.44757 5.67127 2.17277 5.90044 1.84207 5.98186L1.82688 5.9856C1.3413 6.10516 1 6.54068 1 7.04076V7.04076C1 7.53085 1.32805 7.96029 1.80088 8.08919L1.83944 8.0997C2.17238 8.19045 2.44623 8.42726 2.58407 8.74362L2.67049 8.94196C2.80442 9.24933 2.77985 9.60273 2.60468 9.88862V9.88862C2.35474 10.2965 2.4196 10.823 2.76109 11.1581L2.81925 11.2151C3.16537 11.5547 3.70279 11.6035 4.1044 11.3318V11.3318C4.39325 11.1364 4.76195 11.1022 5.08181 11.2412L5.31841 11.3439C5.64614 11.4863 5.88594 11.7769 5.96353 12.1257V12.1257C6.07716 12.6366 6.5303 13 7.05364 13H7.17076M6.91168 1H6.98588C7.49271 1 7.93127 1.35265 8.04004 1.84767V1.84767C8.11525 2.18992 8.35192 2.47435 8.67479 2.61052L8.87998 2.69706C9.19781 2.8311 9.5642 2.80579 9.86258 2.63273V2.63273C10.2858 2.38723 10.8273 2.45227 11.1749 2.79656L11.2151 2.83637C11.5554 3.17336 11.6135 3.70251 11.3543 4.10527V4.10527C11.1688 4.39364 11.1416 4.75624 11.2821 5.06905L11.4129 5.36057C11.5524 5.67127 11.8272 5.90044 12.1579 5.98186L12.1731 5.9856C12.6587 6.10516 13 6.54068 13 7.04076V7.04076C13 7.53085 12.672 7.96029 12.1991 8.08919L12.1606 8.0997C11.8276 8.19045 11.5538 8.42726 11.4159 8.74362L11.3295 8.94196C11.1956 9.24933 11.2201 9.60273 11.3953 9.88862V9.88862C11.6453 10.2965 11.5804 10.823 11.2389 11.1581L11.1807 11.2151C10.8346 11.5547 10.2972 11.6035 9.8956 11.3318V11.3318C9.60675 11.1364 9.23805 11.1022 8.91819 11.2412L8.68159 11.3439C8.35386 11.4863 8.11406 11.7769 8.03647 12.1257V12.1257C7.92284 12.6366 7.4697 13 6.94636 13H6.82924"
          stroke="#366AF3" />
        <path
          d="M8.76194 6.988C8.76194 8.00162 7.95893 8.80631 6.98913 8.80631C6.01932 8.80631 5.21631 8.00162 5.21631 6.988C5.21631 5.97438 6.01932 5.16968 6.98913 5.16968C7.95893 5.16968 8.76194 5.97438 8.76194 6.988Z"
          stroke="#366AF3" />
      </svg>
    </span>
    <span class="button-edit-inner-title">{{ title }}</span>
  </div>
  <div v-if="type === 'text'" class="button-text" :class="isLimit ? '' : 'limited'" @click="handleClick">
    <div class="loader" v-if="isLoading"><img :src="spinner" alt="" /></div>
    <span class="button-text-inner-title">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
.button-add {
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

  .button-add-inner-subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    color: #FF8484;
    padding: 0;
  }

  .button-add-inner-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    .button-add-limit {
      display: block;
    }
  }

  .button-add-limit {
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

.button-edit {
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

  .button-edit-inner-subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    color: #FF8484;
    padding: 0;
  }

  .button-edit-inner-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    .button-add-limit {
      display: block;
    }
  }

  .button-edit-limit {
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

.button-deduct {
  padding: 6px;
  background-color: #EBEBEB;
  border-radius: 12px;
  color: #000;
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

  .button-deduct-inner-subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    color: #FF8484;
    padding: 0;
  }

  .button-deduct-inner-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    .button-deduct-limit {
      display: block;
    }
  }

  .button-deduct-limit {
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
