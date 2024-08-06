import Vue, { VNode } from 'vue'
import { IDocEditorProps } from '../model/config'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}

    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}

    interface IntrinsicElements {
      // tslint:disable-next-line:no-any
      [elem: string]: any
    }
  }
}
