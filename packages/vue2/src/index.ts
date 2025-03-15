import Vue from 'vue';
import Notifications from 'vue-notification';

export { default as OfficeEditor } from './OfficeEditor.vue';
export { default as DocEditor } from './DocEditor.vue';

export * from './interface';
export * from './model/config';

Vue.use(Notifications);
