import { computed, defineComponent, inject, ref } from "vue";
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

    const contentRef = ref(null);
    let currentComponent = null;

    const dragenter = (e) => {
      e.dataTransfer.dropEffect = 'move';
    }

    const dragover = (e) => {
      e.preventDefault();
    }

    const dragleave = (e) => {
      e.dataTransfer.dropEffect = 'none';
    }

    const drop = e => {
      const blocks = data.value.blocks;
      const newData = {
        ...data.value,
        blocks: [
          ...blocks,
          {
            top: e.offsetY,
            left: e.offsetX,
            zIndex: 1,
            key: currentComponent.key
          }
        ]
      }

      currentComponent = null;

      console.log(newData)
    }

    const handleDragStart = (e, component) => {
      currentComponent = component;
      contentRef.value.addEventListener('dragenter', dragenter);
      contentRef.value.addEventListener('dragover', dragover);
      contentRef.value.addEventListener('dragleave', dragleave);
      contentRef.value.addEventListener('drop', drop);
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
            <div className="editor-container-content-canvas" style={contentStyles.value} ref={contentRef}>
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