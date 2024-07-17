import { computed, defineComponent, inject, ref } from "vue";
import EditorBlock from "./editor-block";
import './editor.scss';
import { useMenuDragger } from "@/utils/useMenuDragger";
import { useCommand } from "@/utils/useCommand";
import deepcopy from "deepcopy";

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

    let dragState = {
      startX: 0,
      startY: 0
    }

    const focusData = computed(() => {
      const focus = [];
      const unfocus = [];

      data.value.blocks.forEach(block => (block.focus ? focus : unfocus).push(block));

      return {
        focus,
        unfocus
      }
    });

    const mousemove = e => {
      const durX = e.clientX - dragState.startX;
      const durY = e.clientY - dragState.startY;

      
      const { queue, current } = data.value;
      const focusData = queue[current].filter(block => block.focus);

      focusData.forEach((block, index) => {
        // mousemove一直在触发，top与left一直会在变
        // block.top = block.top + durY;
        // block.left = block.left + durX;

        const { top, left } = dragState.startPos[index];
        block.top = top + durY;
        block.left = left + durX;
      })
    }

    const mouseup = e => {
      let { queue, current } = data.value;
      // 鼠标抬起时判断是否移动过
      if(JSON.stringify(queue[current]) === JSON.stringify(queue[current - 1])) {
        data.value.current = current - 1
      }
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    }

    const handleMouseDown = (e, block) => {
      e.stopPropagation();
      e.preventDefault();
      if (!e.shiftKey) {
        // 若不是shift多选，则清空其他focus
        clearAllFocus();
      }
      block.focus = !block.focus;


      let { queue, current } = data.value;
      const focusData = queue[current].filter(block => block.focus);
      dragState = {
        startX: e.clientX,
        startY: e.clientY,
        startPos: focusData.map(blcok => ({ top: blcok.top, left: blcok.left }))
      }

      // 鼠标按下时创建副本
      const temp = deepcopy(queue[current]);
      current++;
      queue[current] = temp;
      data.value.current = current;


      

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    }

    // 点击容器区域，清空所有focus
    const handleContainerMouseDown = e => {
      clearAllFocus();
    }


    const command = useCommand(data);


    const buttons = computed(() => (
      [
        { label: '撤销', icon: 'icon-back', disabled: data.value.current === 0, handler: () => command.undo() },
        { label: '重做', icon: 'icon-forward', disabled: data.value.current === data.value.queue.length - 1 ,handler: () => command.redo() }
      ]
    ));

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
          <div className="editor-container-top">
            {buttons.value.map((btn, index) => {
              return (
                <button disabled={btn.disabled} class="editor-container-top-button" onClick={btn.handler}>
                  <i class={btn.icon}></i>
                  <span>{btn.label}</span>
                </button>
              )
            })}
          </div>
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