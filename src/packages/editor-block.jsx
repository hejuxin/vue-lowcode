import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  props: ['block'],
  setup(props) {
    const config = inject('config');

    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    }));

    const blockRef = ref(null);

    onMounted(() => {
      if (props.block.alignCenter) {
        const { offsetWidth, offsetHeight } = blockRef.value;
        const { top, left } = props.block;

        // 实现添加物料时以鼠标位置为物料中心坐标，而不是物料左上角坐标
        props.block.top = top - offsetHeight / 2;
        props.block.left = left - offsetWidth / 2;

        // 添加后将标识置为false
        props.block.alignCenter = false;
      }
    })

    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComponent = component.render();

      return (
        <div class="editor-block" style={blockStyles.value} ref={blockRef}>
          {RenderComponent}
        </div>
      )
    }
  }
})