//SettingsModule.vue
<script setup lang="ts">
import SettingsIcon from "./icons/SettingsIcon.vue"
import TrashIcon from "./icons/TrashIcon.vue";
// import VueDraggable from "vuedraggable";
import { ref } from 'vue';
import '../assets/main.css';
import MRadio from "@core/src/Vue/components/MakeRoi/MRadio/MRadio.vue";
import RuleModal from "@t/RuleModal.vue";
import Modal from '@/Templates/Modal.vue';
// import {RuleData} from "@/types";
import ConfirmModal from "@t/ConfirmModal.vue";
import ErrorModal from "@t/ErrorModal.vue";

interface RuleData {
  button_name: string,
  show_leads: boolean,
  pipelines: number[],
  available_on_all_leads: boolean,
  managers_to_use: number[],
  source_status: {
    pipelineId: number,
    statusId: number
  },
  status_to_id: number,
  pipeline_to_id: number,
  is_limited_for_manager: boolean,
  max_assigned_leads_statuses: { pipelineId: number, statusId: number }[],
  max_assigned_leads: number | null,
  leads_limit_per_day: number,
  type: string[],
  active: number | boolean,
  sort: number,
  order: number,
  id?: number
}

interface IProps {
  families: Family[];
  newFamilyId: string;
}

const maxRules = 20;
const props = defineProps<IProps>();
const emit = defineEmits(['save'])
const widget = props.widget;

const list = ref(props.rulesList?.length ? props.rulesList : [] as RuleData[]);
const drag = ref(false);

const ruleModal = ref({
  show: false,
  rule: {} as RuleData
});
const confModal = ref({
  show: false,
  rule: {} as RuleData
})
const errorModal = ref({
  show: false,
  message: ''
})

const dragOptions = ref({
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
});


function handleOrder() {
  const sortArr: { id: number, sort: number }[] = [];
  list.value = list.value.map((item: RuleData, index: number) => {
    sortArr.push({
      id: item.id,
      sort: index
    });
    return {
      ...item,
      order: index,
      sort: index
    }
  });
  handleSortRequest(sortArr)
}
async function handleSortRequest(data: { id: number, sort: number }[]) {
  const res = await widget.api.requestToWidget(`/api/v0/rules/sort`, MakeroiRequestType.POST, {}, { sort: data });
}
function showRemoveConfirmation(rule: RuleData) {
  confModal.value.show = true;
  confModal.value.rule = rule;
}

function handleEditRule(rule?: any) {
  if (rule?.id) {
    ruleModal.value = {
      show: true,
      rule: rule as RuleData
    }
  } else {
    ruleModal.value = {
      show: true,
      rule: {} as RuleData
    }
  }
}
function handleAddRule() {
  ruleModal.value = {
    show: true,
    rule: {} as RuleData
  }
}
function closeModal() {
  ruleModal.value = {
    show: false,
    rule: {} as RuleData
  }
}
async function handleDelete() {
  const deletingRule = confModal.value.rule;
  list.value = list.value.filter((rule: RuleData) => rule?.id !== deletingRule.id)
  confModal.value.show = false;
  const res = await widget.api.requestToWidget(`/api/v0/rules/${deletingRule.id}`, MakeroiRequestType.DELETE, {}, {});
  if (res.success) {
    emit('save', list.value);
    ruleModal.value = {
      show: false,
      rule: {} as RuleData
    }
  } else {
    errorModal.value = {
      show: true,
      message: res.data.message || 'Неизвестная ошибка'
    }
  }

}
async function handleSaveRule(rule: RuleData) {
  const added = list.value.find((rul: RuleData) => rul?.id === rule.id);
  if (added?.id) {
    const res = await widget.api.requestToWidget(`/api/v0/rules/${rule.id}`, MakeroiRequestType.PUT, {}, { ...mapDataFromComponent(rule) });
    if (res.success) {
      if (res.data.rule) {
        const index = list.value.findIndex((rul: RuleData) => rul.id === rule.id);
        console.debug('saving', rule);
        list.value[index] = rule;
      } else {
        errorModal.value = {
          show: true,
          message: res.data.message || 'Неизвестная ошибка'
        }
      }
    }
  }
  else {
    const res = await widget.api.requestToWidget(`/api/v0/rules`, MakeroiRequestType.POST, {}, { ...mapDataFromComponent(rule) });
    if (res.success) {
      if (res.data.rule) {
        list.value.push(mapDataFromRequest(res.data.rule));
      }

    } else {
      errorModal.value = {
        show: true,
        message: res.data.message || 'Неизвестная ошибка'
      }
    }
  }
  emit('save', rule);
}
async function handleActive(id: number, active: boolean) {
  const res = await widget.api.requestToWidget(`/api/v0/rules/${id}/active`, MakeroiRequestType.POST, {}, { active });
  if (!res.success) {
    errorModal.value = {
      show: true,
      message: res.data.message || 'Неизвестная ошибка'
    }
  }
}

function mapDataFromRequest(rule: any) {
  return {
    "button_name": rule.button_name,
    "show_leads": rule.show_leads,
    "pipelines": rule.pipelines,
    "available_on_all_leads": rule.available_on_all_leads,
    "managers_to_use": rule.managers_to_use.map((id: number) => id.toString()),
    "leads_limit_per_day": rule.leads_limit_per_day,
    "is_limited_for_manager": Boolean(rule.max_assigned_leads),
    "source_status": {
      pipelineId: rule.source_status.pipeline_id,
      statusId: rule.source_status.status_id
    },
    "status_to_id": rule.status_to_id,
    "pipeline_to_id": rule.pipeline_to_id,
    "max_assigned_leads": rule.max_assigned_leads,
    "max_assigned_leads_statuses": rule.max_assigned_leads_statuses.map((item: any) => {
      return {
        "pipelineId": item.pipeline_id,
        "statusId": item.status_id
      }
    }),
    "type": rule.type,
    "active": Boolean(rule.active),
    "sort": rule.sort,
    "id": rule.id
  }
}
function mapDataFromComponent(rule: RuleData) {
  return {
    "button_name": rule.button_name,
    "show_leads": Boolean(rule.show_leads),
    "pipelines": rule.pipelines,
    "available_on_all_leads": Boolean(rule.available_on_all_leads),
    "managers_to_use": rule.managers_to_use.map((id: string | number) => Number(id)),
    "leads_limit_per_day": rule.leads_limit_per_day,
    'source_status': {
      'pipeline_id': rule.source_status.pipelineId,
      'status_id': rule.source_status.statusId
    },
    "status_to_id": rule.status_to_id,
    "pipeline_to_id": rule.pipeline_to_id,
    "max_assigned_leads": rule.max_assigned_leads,
    "max_assigned_leads_statuses": rule.max_assigned_leads_statuses.map(item => {
      return {
        "pipeline_id": item.pipelineId,
        "status_id": item.statusId
      }
    }),
    "type": rule.type,
    "active": Boolean(rule.active),
    "sort": rule.sort,
    "id": rule.id
  }
}
</script>

<template>
  <div class="settings">
    <div class="header">
      Список правил
    </div>
    <div class="content">
      <VueDraggable v-model="list" class="list-group" :component-data="{ tag: 'div', type: 'transition-group' }"
        @start="drag = true" @end="drag = false" v-bind="dragOptions" item-key="id" @change="handleOrder">
        <template #item="{ element }">
          <div class="cursor-move list-item">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-1">
                <p class="font-semibold text-gray-700">{{ 'Правило #' + element.id }} <span
                    class="font-normal text-[13px] text-[#a0adbd]">{{ element.button_name }}</span> </p>
              </div>
              <div class="flex gap-1 items-center">
                <MRadio :selected="element.active" @select="handleActive(element.id, $event)" />
                <SettingsIcon @click="handleEditRule(element)"></SettingsIcon>
                <TrashIcon @click="showRemoveConfirmation(element)" />
              </div>
            </div>
          </div>
        </template>
      </VueDraggable>
      <div v-if="list.length <= maxRules" class="hover:bg-gray-50 py-2 px-3 py-2 bg-white cursor-pointer"
        @click="handleAddRule">
        <div class="flex items-center justify-between gap-4">
          <div class="flex gap-2">
            <p class="block text-blue-400 font-bold">+</p>
            <p class="text-gray-600">Добавить</p>
          </div>
          <p class="text-gray-400">{{ list.length }}/{{ maxRules }}</p>
        </div>
      </div>

    </div>
    <Modal :show="ruleModal.show" @modal-close="closeModal" class="w-[30rem]">
      <RuleModal :pipelines="pipelines" :widget="widget as MakeroiWidget" @modal-close="closeModal"
        @save="handleSaveRule" @delete="showRemoveConfirmation" :rule-data="ruleModal.rule" :length="list.length" />
    </Modal>
    <Modal :show="confModal.show" @modal-close="confModal.show = false" class="w-[30rem]">
      <ConfirmModal @modal-close="confModal.show = false" @confirm="handleDelete" @click.stop />
    </Modal>
    <Modal :show="errorModal.show" @modal-close="errorModal.show = false" class="w-[30rem]">
      <ErrorModal :message="errorModal.message" />
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.settings {
  margin: 20px 0;

  .header {
    font-weight: bold;
    margin: 5px 0;
  }

  .content {
    background: #fff;
    box-shadow: 1px 1px 10px 0px rgba(155, 155, 155, 0.25);
    padding: 10px;

    .list-item {
      padding: 10px;
      border-bottom: 1px solid rgba(216, 216, 216, 1);

      &::marker {
        content: none;
      }
    }
  }
}
</style>