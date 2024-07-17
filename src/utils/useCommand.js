export function useCommand(data) {
  function undo() {
    data.value.current -= 1;
  }

  function redo() {
    data.value.current += 1;
  }


  return {
    undo,
    redo
  }
}