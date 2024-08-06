<template>
  <div :style="{ width: 'inherit', height: 'inherit' }">
    <document-editor
      v-if="documentConfigRef !== undefined"
      :id="docId"
      :width="width"
      :height="height"
      :config="documentConfigRef.model"
      :documentServerUrl="documentConfigRef.documentServerUrl"
      :events_onDocumentReady="triggerDocumentReady"
      :onLoadComponentError="triggerLoadComponentError"
      :events_onRequestHistoryData="triggerRequestHistoryData"
      :events_onMetaChange="triggerMetaChange"
      :events_onDocumentStateChange="triggerDocumentStateChange"
      :events_onRequestHistory="triggerRequestHistory"
      :events_onRequestRestore="triggerRequestRestore"
      :events_onRequestRename="triggerRequestRename"
      :events_onInfo="triggerInfo"
      :events_onWarning="triggerWarning"
      :events_onError="triggerError"
      :events_onRequestHistoryClose="triggerRequestHistoryClose"
      :events_onRequestSharingSettings="triggerRequestSharingSettings"
      :events_onMakeActionLink="triggerMakeActionLink"
      :events_onRequestInsertImage="triggerRequestInsertImage"
      :events_onRequestMailMergeRecipients="triggerRequestMailMergeRecipients"
      :events_onRequestCompareFile="triggerRequestCompareFile"
      :events_onRequestEditRights="triggerRequestEditRights"
    >
    </document-editor>
    <notifications position="top center"></notifications>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { IOfficeEditorProps } from './interface'
import { DocumentEditor } from '@onlyoffice/document-editor-vue'
import { DocumentEditorConfig, useEditorApi } from './api/editor'
import useDocApi from './api/doc'
import { type IEditor } from './model/config'
import { useNotification, Notifications } from '@kyvg/vue3-notification'

const { notify } = useNotification()

const editorApi = useEditorApi()
const docApi = useDocApi()

const props = withDefaults(defineProps<IOfficeEditorProps>(), {
  width: '100%',
  height: '100%',
  action: 'edit',
  type: 'desktop',
  printLog: true,
  config: {
    logo: undefined,
    plugins: true,
    integrationMode: 'embed',
    spellcheck: true,
    unit: 'cm',
    hideNotes: false,
    zoom: 100,
  },
})

const {
  docId,
  printLog,
  height,
  width,
  action,
  type,
  config,
  onDocumentReady,
  onLoadComponentError,
  onMetaChange,
  onInfo,
  onWarning,
  onError,
  onRequestSharingSettings,
  onRequestRename,
  onMakeActionLink,
  onRequestInsertImage,
  onRequestMailMergeRecipients,
  onRequestCompareFile,
  onRequestEditRights,
  onRequestHistory,
  onRequestHistoryData,
  onRequestHistoryClose,
  onRequestRestore,
  onDocumentStateChange,
  onDocumentBeforeDestroy,
} = props

const docEditorRef = ref<IEditor | undefined>()

const documentConfigRef = ref<DocumentEditorConfig | undefined>()

onMounted(() => {
  loadDocumentConfig()
})

onUnmounted(() => {
  triggerDocumentBeforeDestroy()
})

const loadDocumentConfig = () => {
  editorApi
    .editor(docId, action, type)
    .then((res) => {
      const { code, result, message } = res
      if (code === 200) {
        const documentConfig = { ...result }
        const docConfig = { ...documentConfig.model }
        const editorConfig = docConfig.editorConfig || {}
        editorConfig.customization = {
          ...(editorConfig?.customization || {}),
          ...config,
          logo:
            config?.logo !== undefined
              ? config.logo
              : editorConfig.customization?.logo,
        }
        docConfig.editorConfig = editorConfig
        console.log('load editor config is: ', documentConfig)
        documentConfigRef.value = documentConfig
      } else {
        notify({ type: 'error', text: message })
      }
    })
    .catch((err) => {
      console.error('Failed to get document config', err)
    })
}

const loadHistoryList = () => {
  docApi
    .getHistory(docId)
    .then((res) => {
      const { code, result, message } = res
      if (code === 200) {
        docEditorRef.value?.refreshHistory?.(result)
      } else {
        notify({ type: 'error', text: message })
      }
    })
    .catch((err) => {
      console.log('Failed to load history.', err)
      notify({ type: 'error', text: 'Failed load history.' })
    })
}

const loadHistoryData = (version: number) => {
  docApi
    .getHistoryData(docId, version)
    .then((res) => {
      const { code, result, message } = res
      if (code === 200) {
        docEditorRef.value?.setHistoryData?.(result)
      } else {
        notify({ type: 'error', text: message })
      }
    })
    .catch((err) => {
      console.error('Failed load history data.', err)
      notify({ type: 'error', text: 'Failed load history data.' })
    })
}

// ------------------------- trigger method -------------------------

const triggerRequestRename = (e: Record<string, any>) => {
  printEvent('onRequestRename', e)
  docApi
    .rename(docId, { newfilename: e.data })
    .then()
    .catch((err) => {
      console.error('Failed rename doc', err)
    })
    .finally(() => {
      onRequestRename?.(e)
    })
}

const triggerDocumentReady = () => {
  printEvent('onDocumentReady')
  const docEditor: IEditor = window.DocEditor?.instances[docId]
  if (docEditor) {
    docEditor.triggerForceSave = (callback) => {
      printEvent('triggerForceSave')
      docApi
        .forceSave(docId)
        .then((res) => {
          const { result, code } = res
          if (code === 200 && result) {
            console.log('force save success')
          } else {
            console.error('Failed force save, the result is', res)
          }
          callback?.(result, undefined)
        })
        .catch((err) => {
          callback?.(false, undefined)
          console.error('Failed force save.', err)
        })
    }

    docEditor.triggerKickout = (userIds, callback) => {
      printEvent('triggerKickout')
      docApi
        .kickout(docId, userIds)
        .then((res) => {
          const { code, result } = res
          if (code === 200 && result) {
            console.log('kickout success')
          } else {
            console.error('Failed kickout, the result is', res)
          }
          callback?.(result, undefined)
        })
        .catch((err) => {
          console.error('Failed kickout.', err)
          callback?.(false, err)
        })
    }

    docEditor.triggerKickoutOthers = (callback) => {
      printEvent('triggerKickoutOthers')
      docApi
        .kickoutAll(docId)
        .then((res) => {
          const { code, result } = res
          if (code === 200 && result) {
            console.log('kickout others success')
          } else {
            console.error('Failed kickout others, the result is', res)
          }
          callback?.(result, undefined)
        })
        .catch((err) => {
          console.error('Failed kickout others.', err)
          callback?.(false, err)
        })
    }

    docEditor.triggerKickoutAll = (callback) => {
      printEvent('triggerKickoutAll')
      docApi
        .kickoutAll(docId)
        .then((res) => {
          const { code, result } = res
          if (code === 200 && result) {
            console.log('kickout all success')
          } else {
            console.error('Failed kickout all, the result is', res)
          }
          callback?.(result, undefined)
        })
        .catch((err) => {
          console.error('Failed kickout all.', err)
          callback?.(false, err)
        })
    }

    docEditor.onlineDocUser = (callback) => {
      printEvent('onlineDocUser')
      docApi
        .getOnlineDocUser(docId)
        .then((res) => {
          const { code, result } = res
          if (code === 200) {
            console.log('get online doc user success')
          } else {
            console.error('Failed get online doc user , the result is', res)
          }
          callback?.(result || [], undefined)
        })
        .catch((err) => {
          console.error('Failed get online doc user .', err)
          callback?.([], err)
        })
    }
    onDocumentReady?.(docEditor)
  }
  docEditorRef.value = docEditor
}

const triggerLoadComponentError = (error: number, errorDescription: string) => {
  printEvent('onLoadComponentError', error, errorDescription)
  onLoadComponentError?.(error, errorDescription)
}

const triggerRequestSharingSettings = (e: Record<string, any>) => {
  printEvent('onRequestSharingSettings', e)
  onRequestSharingSettings?.(e)
}

const triggerMakeActionLink = (e: Record<string, any>) => {
  printEvent('onMakeActionLink', e)
  onMakeActionLink?.(e)
}

const triggerRequestInsertImage = (e: Record<string, any>) => {
  printEvent('onRequestInsertImage', e)
  onRequestInsertImage?.(e)
}

const triggerRequestMailMergeRecipients = (e: Record<string, any>) => {
  printEvent('onRequestMailMergeRecipients', e)
  onRequestMailMergeRecipients?.(e)
}

const triggerRequestCompareFile = (e: Record<string, any>) => {
  printEvent('onRequestCompareFile', e)
  onRequestCompareFile?.(e)
}

const triggerRequestEditRights = (e: Record<string, any>) => {
  printEvent('onRequestEditRights', e)
  onRequestEditRights?.(e)
}

const triggerDocumentBeforeDestroy = () => {
  printEvent('onDocumentBeforeDestroy')
  onDocumentBeforeDestroy?.()
}

const triggerRequestHistoryData = (e: Record<string, any>) => {
  printEvent('onRequestHistoryData', e)
  const version = e.data
  loadHistoryData(version)
  onRequestHistoryData?.(version)
}

const triggerMetaChange = (e: Record<string, any>) => {
  printEvent('onMetaChange', e)
  onMetaChange?.(e)
}

const triggerDocumentStateChange = (e: Record<string, any>) => {
  printEvent('onDocumentStateChange', e)
  onDocumentStateChange?.(e)
}

const triggerRequestHistory = (e: Record<string, any>) => {
  printEvent('onRequestHistory', e)
  loadHistoryList()
  onRequestHistory?.()
}

const triggerRequestRestore = (e: Record<string, any>) => {
  printEvent('onRequestRestore', e)
  const { version } = e.data
  docApi
    .restore(docId, version)
    .then((res) => {
      const { code, success, message } = res
      if (code === 200 && success) {
        // load history
        loadHistoryList()
      } else {
        notify({ type: 'error', text: message })
      }
    })
    .catch((err) => {
      console.error('Failed restore document version', err)
    })
    .finally(() => {
      onRequestRestore?.(e)
    })
}

const triggerInfo = (e: Record<string, any>) => {
  printEvent('onInfo', e)
  onInfo?.(e)
}

const triggerWarning = (e: Record<string, any>) => {
  printEvent('onWarning', e)
  onWarning?.(e)
}

const triggerError = (e: Record<string, any>) => {
  printEvent('onError', e)
  onError?.(e)
}

const triggerRequestHistoryClose = (e: Record<string, any>) => {
  printEvent('onRequestHistoryClose', e)
  document.location.reload()
  onRequestHistoryClose?.()
}

const printEvent = (
  event: keyof IOfficeEditorProps | keyof IEditor,
  ...args: any
) => {
  printLog &&
    console.log('document trigger event: %s,', event, 'args is: ', ...args)
}
</script>
