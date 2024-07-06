export function useMenuDragger(contentRef, data) {
  let currentComponent = null;

  // dragenter进入元素中 添加一个移动的标识
  const dragenter = (e) => {
    e.dataTransfer.dropEffect = 'move';
  }

  // dragover 在目标元素经过 必须要阻止默认行为 否则不能触发drop
  const dragover = (e) => {
    e.preventDefault();
  }

  // dragleave 离开元素的时候 需要增加一个禁用标识
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = 'none';
  }

  // drop 松手的时候 根据拖拽的组件 添加一个组件
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
          key: currentComponent.key,
          alignCenter: true
        }
      ]
    }

    data.value = newData;
    currentComponent = null;
  }

  const handleDragStart = (e, component) => {
    currentComponent = component;
    contentRef.value.addEventListener('dragenter', dragenter);
    contentRef.value.addEventListener('dragover', dragover);
    contentRef.value.addEventListener('dragleave', dragleave);
    contentRef.value.addEventListener('drop', drop);
  }

  const handleDragEnd = (e) => {
    contentRef.value.removeEventListener('dragenter', dragenter);
    contentRef.value.removeEventListener('dragover', dragover);
    contentRef.value.removeEventListener('dragleave', dragleave);
    contentRef.value.removeEventListener('drop', drop);
  }

  return {
    handleDragStart,
    handleDragEnd
  }
}