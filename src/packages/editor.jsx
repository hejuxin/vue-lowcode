import { defineComponent } from "vue";
import './editor.scss';

export default defineComponent({
  setup() {
    return () => (
      <div className="editor">
        <div className="editor-left">left content</div>
        <div className="editor-right">right content</div>
        <div className="editor-container">
          <div className="editor-container-top">top content</div>
          <div className="editor-container-content">
            <div className="editor-container-content-canvas">
              content
            </div>
          </div>
        </div>
      </div>
    )
  }
})