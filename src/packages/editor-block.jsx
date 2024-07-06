import { computed, defineComponent, inject } from "vue";

export default defineComponent({
  props: ['block'],
  setup(props) {
    const config = inject('config');

    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    }));

    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComponent = component.render();

      return (
        <div class="editor-block" style={blockStyles.value}>
          {RenderComponent}
        </div>
      )
    }
  }
})