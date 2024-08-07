import Vue from 'vue';
import Notifications from 'vue-notification';

export { default as OfficeEditor } from './OfficeEditor.vue';

export * from './interface';
export * from './model/config';

export type { OnlineDocUser } from './api/doc';

Vue.use(Notifications);
