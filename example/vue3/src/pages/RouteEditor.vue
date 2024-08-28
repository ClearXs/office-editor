<template>
  <editor :docId="$route.params.id"></editor>
</template>

<script lang="ts" setup>
import Editor from './Editor.vue';
</script>
