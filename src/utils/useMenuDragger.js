export function useMenuDragger(contentRef, data) {
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