//AttachFamilyModal.vue
<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';
import AddDeductButton from './AddDeductButton.vue'

interface Member {
  id: string;
  name: string;
  type: string;
}

interface Family {
  idFamily: string;
  members: Member[];
}

interface IProps {
  families: Family[];
  newFamilyId: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['attachFamily', 'viewContacts', 'createFamily', 'modal-close']);

const contentRef = ref<HTMLDivElement>();
function handleAttachFamily(familyId: string) {
  emit('attachFamily', familyId);
}

function handleViewContacts(memberId: string) {
  emit('viewContacts', memberId);
}

function handleCreateFamily() {
  emit('createFamily', props.newFamilyId);
}

function closeModal(e: any) {
  const closeButton = e.target.closest('[data-close="true"]');
  if (closeButton || e.target === e.currentTarget) {
    emit('modal-close');
  }
}
</script>

<template>
  <div :id="'attach-family-modal-' + props.newFamilyId" class="modal-overlay" @mousedown="closeModal">
    <div class="modal-content">
      <div class="title-wrapper">
        <h1 class="title">Семьи</h1>
        <div id="close-modal-button" class="close-modal-container" data-close="true" @mousedown="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#A0ADBD" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_31502_82822)">
              <path
                d="M8.75 15C12.2018 15 15 12.2018 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15Z"
                stroke="#366AF3" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13.1694 13.1694L17.4999 17.4999" stroke="#366AF3" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_31502_82822">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <input type="text" name="family-search" placeholder="Поиск по семьям" />
        </div>
        <button id="create-family" @click="handleCreateFamily"><svg width="18" height="18" viewBox="0 0 18 18"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_31820_1756)">
              <path d="M2.8125 9H15.1875" stroke="white" stroke-width="1.125" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M9 2.8125V15.1875" stroke="white" stroke-width="1.125" stroke-linecap="round"
                stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_31820_1756">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg> <span>Создать новую</span></button>
      </div>
      <div :id="'family-list-' + props.newFamilyId" class="family-list">
        <div v-for="(family) in props.families" :key="family.idFamily" class="family-item">
          <div class="family-info">
            <div class="parent">
              <h3>Родители</h3>
              <template v-for="(member) in family.members" :key="member.id">
                <div v-if="member.type === 'Родители'" class="member">
                  {{ member.name }}
                </div>
              </template>
            </div>
            <div class="child">
              <h3>Дети</h3>
              <template v-for="(member) in family.members" :key="member.id">
                <div v-if="member.type === 'Дети'" class="member">
                  {{ member.name }}
                </div>
              </template>
            </div>
            <div class="add-family-button">
              <AddDeductButton type='add' title="Прикрепить" :limit="10" :loading="false"
                @click="handleAttachFamily(family.idFamily)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(242, 242, 242, 0.7);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.close-modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  cursor: pointer;
  z-index: 1
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 620px;
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
}

.title-wrapper {
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding-bottom: 24px;

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    font-family: 'PT Sans', sans-serif;
    color: #000;
    margin: 0;
  }
}

.search-wrapper {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  display: flex;
  justify-content: flex-starts;
  width: 391px;
  height: 36px;
  padding: 8px 12px 8px 10px;
  font-family: 'PT Sans', sans-serif;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #F5F5F5;
  border: none;
  margin-right: 12px;
}

.search-input input {
  width: 100%;
  border: none;
  background-color: transparent;
  padding-left: 10px;
  appearance: none;
  box-shadow: none;

  &:focus {
    border: none;
    outline: none;
    outline: none;
    background-color: transparent;
  }

  &:not(:placeholder-shown) {
    border: none;
    background-color: transparent;
  }
}

#create-family {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #366AF3;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 169px;
  height: 36px;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  font-family: 'PT Sans', sans-serif;
  padding: 0;

  span {
    padding-left: 6px;
  }
}

#create-family:hover {
  background-color: #0069d9;
}

.family-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow-y: scroll;
  padding-right: 12px;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    width: 3px;
    height: 120px;
    border-radius: 10px;
    background-color: #A6AAB5;
  }

  &::-webkit-scrollbar-track {
    background-color: #F5F5F5;
  }
}

.family-item {
  flex: 0 0 50%;
  background-color: #fff;
  padding: 20px;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #EBEBEB;
  min-width: 100%;
  box-sizing: border-box;
}

.family-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.parent,
.child {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 208px;
  gap: 12px;
}

.member {
  margin: 0;
  width: 100%;
  text-align: start;
  color: #366AF3;
  font-family: 'PT Sans', sans-serif;
  text-decoration: underline;
  cursor: pointer;
}

.parent h3,
.child h3 {
  width: 208.5px;
  height: 32px;
  font-size: 15px;
  font-family: 'PT Sans', sans-serif;
  line-height: 32px;
  font-weight: 700;
  color: #1E1E1E;
  padding: 0;
  margin: 0;
  text-align: start;
}

.view-contacts,
.attach-family {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  margin: 10px;
}

.view-contacts:hover,
.attach-family:hover {
  background-color: #f2f2f2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.view-contacts:active,
.attach-family:active {
  background-color: #d0d0d0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.add-family-button {
  width: 116px;
  align-self: center;
}
</style>
