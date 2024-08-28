<template>
  <editor :docId="$route.params.id"></editor>
</template>

<script>
import Editor from './Editor.vue';

export default {
  name: 'RouteEditor',
  components: { Editor },
};
</script>
