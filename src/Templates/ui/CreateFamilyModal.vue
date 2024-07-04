//AttachFamilyModal.vue
<script setup lang="ts">
import { defineEmits, defineProps, withDefaults, ref } from 'vue';
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
  idFamily: string;
  title: string;
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Прикрепить'
});
const emit = defineEmits(['attachFamily', 'modal-close']);

const countLimit = 20;
const parentsFirst: {
  id: string;
  name: string;
}[] = [];
const childrenFirst = [{ name: 'Masha', id: `${props.idFamily}-1` }];
const membersFirst = parentsFirst.concat(childrenFirst);
console.log(membersFirst)
// const members = ref(membersFirst);
const parents = ref(parentsFirst);
const children = ref(childrenFirst);
const countParents = ref(parents.value.length);
const countChildren = ref(children.value.length);
const members = ref(parents.value.concat(children.value));
const parentSearch = ref('');
const childSearch = ref('');
const countForId = ref(0);

function handleAttachFamily() {
  if (props.title === 'Новая семья') {
    console.log('Новая семья')
  }
  // ДОБАВИТЬ ОБРАБОТКУ families
  emit('attachFamily', props.idFamily);
}

function handleCreateMember(memberType: string, name: string) {
  countForId.value++
  const id = `${props.idFamily}-${countForId.value}`;
  if (memberType === 'parent') {
    parents.value.push({ name, id });
    parentSearch.value = '';
    countParents.value++;
  }
  if (memberType === 'child') {
    children.value.push({ name, id });
    childSearch.value = '';
    countChildren.value++;
  }
  updateMembers();
}

function handleDeductMember(memberId: string) {
  parents.value = parents.value.filter(member => member.id !== memberId);
  children.value = children.value.filter(member => member.id !== memberId);
}

function updateMembers() {
  members.value = parents.value.concat(children.value);
}

function closeModal(e: any) {
  const closeButton = e.target.closest('[data-close="true"]');
  if (closeButton || e.target === e.currentTarget) {
    emit('modal-close');
  }
}
</script>

<template>
  <div :id="'create-family-modal-' + props.idFamily" class="modal-overlay" @mousedown="closeModal">
    <div class="modal-content">
      <div class="title-wrapper">
        <div>
          <h1 class="title">{{ title }}</h1>
          <p class="description-title">ID <span>{{ props.idFamily }}</span></p>
        </div>
        <div id="close-modal-button" class="close-modal-container" data-close="true" @mousedown="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#A0ADBD" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <div class="parents">
        <div class="parents-title">
          <h3>Родители</h3>
          <p class="count">{{ countParents }}/{{ countLimit }}</p>
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
            <input type="text" v-model="parentSearch" name="member-search" placeholder="Поиск по родителям" />
          </div>
          <button id="create-parent" class="create-member" @click="handleCreateMember('parent', parentSearch)"><svg
              width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </svg> <span>Создать</span>
          </button>
        </div>
        <div class="wrapper-member-family-block" v-if="parents.length > 0">
          <div class="member-family-block" v-for="(member) in parents" :key="member.id">
            <div class="member">
              <p class="member-name">{{ member.name }}</p>
              <p class="id-family-block">ID <span>{{ props.idFamily }}</span></p>
            </div>
            <div class="deduct-family-button">
              <AddDeductButton type='deduct' title="Открепить" :limit="1200" :loading="false"
                @click="handleDeductMember(member.id)" />
            </div>
          </div>
        </div>
        <div class="wrapper-member-family-block" v-else>
          <div class="member-family-block" v-for="(member) in parents" :key="member.id">
            <div class="member">
              <p class="member-placeholder"> Выберите родителя из базы или создайте нового</p>
            </div>
          </div>
        </div>
      </div>
      <div class="children">
        <div class="children-title">
          <h3> Дети </h3>
          <p class="count">{{ countChildren }}/{{ countLimit }}</p>
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
            <input type="text" v-model="childSearch" name="member-search" placeholder="Поиск по детям" />
          </div>
          <button id="create-child" class="create-member" @click="handleCreateMember('child', childSearch)"><svg
              width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </svg> <span>Создать</span>
          </button>
        </div>
        <div class="wrapper-member-family-block" v-if="children.length > 0">
          <div class="member-family-block" v-for="(member) in children" :key="member.id">
            <div class="member">
              <p class="member-name">{{ member.name }}</p>
              <p class="id-family-block">ID <span>{{ props.idFamily }}</span></p>
            </div>
            <div class="deduct-family-button">
              <AddDeductButton type='deduct' title="Открепить" :limit="1200" :loading="false"
                @click="handleDeductMember(member.id)" />
            </div>
          </div>
        </div>
        <div class="wrapper-member-family-block" v-else>
          <div class="member-family-block" v-for="(member) in children" :key="member.id">
            <div class="member">
              <p class="member-placeholder"> Выберите ребёнка из базы или создайте нового</p>
            </div>
          </div>
        </div>
      </div>
      <div class="wrapper-attach-family" v-if="children.length > 0 && parents.length > 0">
        <button id="attach-family" class="attach-family" :class="title === 'Новая семья' ? '' : 'deduct'"
          @click="handleAttachFamily">
          <svg v-if="title === 'Новая семья'" width="18" height="18" viewBox="0 0 18 18" fill="none"
            xmlns="http://www.w3.org/2000/svg">
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
          </svg>
          <svg v-if="title !== 'Новая семья'" width="18" height="18" viewBox="0 0 18 18" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_31846_1982)">
              <path d="M2.8125 9H15.1875" stroke="#FF8484" stroke-width="1.125" stroke-linecap="round"
                stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_31846_1982">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>{{ props.title === 'Новая семья' ? 'Прикрепить семью' : 'Открепить семью' }}</span>
        </button>
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
  // height: 472px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  gap: 24px;
  box-sizing: border-box;
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

  .description-title {
    font-size: 13px;
    font-weight: 400;
    line-height: 17px;
    font-family: 'PT Sans', sans-serif;
    color: #A0ADBD;
    margin: 0;
    text-align: start;
  }
}

.search-wrapper {
  display: flex;
}

.search-input {
  display: flex;
  justify-content: flex-starts;
  width: 413px;
  height: 36px;
  padding: 8px 12px 8px 10px;
  font-family: 'PT Sans', sans-serif;
  border: 1px solid #ddd;
  border-radius: 3px;
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
  color: #A6AAB5;

  &:focus {
    border: none;
    outline: none;
    outline: none;
    background-color: transparent;
  }

  &:not(:placeholder-shown) {
    border: none;
    background-color: transparent;
    color: #000;
  }
}

.create-member {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #366AF3;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 123px;
  height: 36px;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  font-family: 'PT Sans', sans-serif;
  padding: 8px 24px;
  gap: 6px;

  span {
    padding-left: 6px;
  }
}

.create-member:hover {
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

.parents,
.children {
  border: 1px solid #EBEBEB;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  // height: 169px;
  gap: 24px;
  padding: 12px;
}

.parents-title,
.children-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.wrapper-member-family-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  .member-family-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    gap: 12px;
    // margin-bottom: 24px;

    .member {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      width: 428px;
      height: 19px;
      text-align: start;
      color: #366AF3;
      font-family: 'PT Sans', sans-serif;
      cursor: pointer;

      .member-placeholder {
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        font-family: 'PT Sans', sans-serif;
        color: #A0ADBD;
        margin: 0;
      }

      .member-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: underline;
        width: 363px;
        height: 19px;
        margin: 0;
        padding: 0;
      }

      .id-family-block {
        font-size: 13px;
        font-weight: 400;
        line-height: 17px;
        font-family: 'PT Sans', sans-serif;
        color: #A0ADBD;
        margin: 0;
        text-align: end;
        width: 59px;
        height: 17px;
      }
    }

    .deduct-family-button {
      width: 108px;
      align-self: center;
    }
  }
}

.parents h3,
.children h3 {
  font-size: 15px;
  font-family: 'PT Sans', sans-serif;
  line-height: 20px;
  font-weight: 700;
  color: #1E1E1E;
  padding: 0;
  margin: 0;
  text-align: start;
}

.count {
  font-size: 13px;
  font-family: 'PT Sans', sans-serif;
  line-height: 17px;
  font-weight: 400;
  color: #A0ADBD;
  margin: 0;
  padding: 0;
}

.wrapper-attach-family {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0;

  .attach-family {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #366AF3;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 196px;
    height: 36px;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    font-family: 'PT Sans', sans-serif;
    padding: 8px 24px;
    gap: 6px;

    span {
      padding-left: 0px;
    }
  }

  .attach-family:hover {
    background-color: #0069d9;
  }

  .attach-family.deduct {
    background-color: #EBEBEB;
    color: #000;

  }

  .attach-family.deduct:hover {
    background-color: #E5E5E5;
  }

}
</style>
