import { defineComponent, computed, inject } from "vue";
import EditorBlock from "./editor-block";
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

    const config = inject('config');

    return () => (
      <div className="editor">
        <div className="editor-left">
          {
            config.componentList.map(component => {
              return (
                <div
                  class="editor-left-item"
                  key={component.key}
                >
                  <span>{component.label}</span>
                  <div>{component.preview()}</div>
                </div>
              )
            })
          }
        </div>
        <div className="editor-right">right content</div>
        <div className="editor-container">
          <div className="editor-container-top">top content</div>
          <div className="editor-container-content">
            <div className="editor-container-content-canvas" style={contentStyles.value}>
              {
                data.value.blocks.map(block => {
                  return <EditorBlock block={block} key={block.key}></EditorBlock>
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
})