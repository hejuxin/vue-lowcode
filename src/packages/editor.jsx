import { defineComponent, computed } from "vue";
import './editor.scss';

export default defineComponent({
  props: ["modelValue"],
  setup(props) {
    const data = computed({
      get() {
        return props.modelValue
      }
    })

    const contentStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    return () => (
      <div className="editor">
        <div className="editor-left">left content</div>
        <div className="editor-right">right content</div>
        <div className="editor-container">
          <div className="editor-container-top">top content</div>
          <div className="editor-container-content">
            <div className="editor-container-content-canvas" style={contentStyles.value}>
              content
            </div>
          </div>
        </div>
      </div>
    )
  }
})