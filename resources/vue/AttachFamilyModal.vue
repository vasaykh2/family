<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-content">
      <div class="search-wrapper">
        <div class="search-input">
          <input type="text" name="family-search" placeholder="Поиск..." />
        </div>
      </div>
      <div class="family-list">
        <div v-for="(family, index) in families" :key="index" class="family-item">
          <div class="family-info">
            <div class="parent">
              <h3 v-if="family.parents.length">Родители</h3>
              <div v-for="(member, i) in family.parents" :key="i" class="member">
                {{ member.name }}
                <div class="member-buttons">
                  <button class="view-contacts">Контакты</button>
                  <button class="attach-family">Прикрепить</button>
                </div>
              </div>
            </div>
            <div class="child">
              <h3 v-if="family.children.length">Дети</h3>
              <div v-for="(member, i) in family.children" :key="i" class="member">
                {{ member.name }}
                <div class="member-buttons">
                  <button class="view-contacts">Контакты</button>
                  <button class="attach-family">Прикрепить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button id="create-family" @click="createFamily">+ Создать семью</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    families: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(
          (family) =>
            Array.isArray(family) &&
            family.every(
              (member) =>
                typeof member.type === 'string' &&
                typeof member.id === 'string' &&
                typeof member.name === 'string'
            )
        );
      },
    },
  },
  data() {
    return {
      showModal: true,
    };
  },
  methods: {
    createFamily() {
      // Логика для создания новой семьи
      console.log('Создать семью');
    },
  },
};
</script>

<style scoped>
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

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
}

.search-wrapper {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.search-input input {
  width: 100%;
}

.family-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.family-item {
  flex: 0 0 50%;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 100%;
  box-sizing: border-box;
}

.family-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parent,
.child {
  display: flex;
  flex-direction: column;
  width: 47%;
}

.member {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

.parent h3,
.child h3 {
  font-weight: bold;
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

#create-family {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin: 20px auto 0;
  max-width: 220px;
}

#create-family:hover {
  background-color: #0069d9;
}

.card-widgets {
  z-index: 10;
}
</style>