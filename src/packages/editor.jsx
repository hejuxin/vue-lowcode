import { computed, defineComponent, inject, ref } from "vue";
import EditorBlock from "./editor-block";
import './editor.scss';
import { useMenuDragger } from "@/utils/useMenuDragger";

export default defineComponent({
  props: ["modelValue"],
  emits: ["update:modelValue"], // 要触发的事件 - 双向绑定更新事件
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        ctx.emit('update:modelValue', value) // 触发双向绑定更新事件
      }
    })

    const contentStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    const config = inject('config');

    const contentRef = ref(null);
    const { handleDragStart, handleDragEnd } = useMenuDragger(contentRef, data);

    const clearAllFocus = () => {
      data.value.blocks.forEach(block => block.focus = false)
    }

    const handleMouseDown = (e, block) => {
      e.stopPropagation();
      e.preventDefault();
      if (!e.shiftKey) {
        // 若不是shift多选，则清空其他focus
        clearAllFocus();
      }
      block.focus = !block.focus;
    }

    // 点击容器区域，清空所有focus
    const handleContainerMouseDown = e => {
      clearAllFocus();
    }

    return () => (
      <div className="editor">
        <div className="editor-left">
          {
            config.componentList.map(component => {
              return (
                <div
                  class="editor-left-item"
                  key={component.key}
                  draggable
                  onDragstart={e => handleDragStart(e, component)}
                  onDragend={handleDragEnd}
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
            <div className="editor-container-content-canvas" style={contentStyles.value} ref={contentRef} onMousedown={handleContainerMouseDown}>
              {
                data.value.blocks.map(block => {
                  return (
                    <EditorBlock
                      block={block}
                      key={block.key}
                      class={block.focus ? 'editor-block-focus' : ''}
                      onMousedown={e => handleMouseDown(e, block)}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
})