import { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Todo(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(props.name);
  const [editPriority, setEditPriority] = useState(props.priority ?? 0);
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = editName.trim();

    if (trimmedName === "") {
      return;
    }

    props.editTask(props.id, trimmedName, editPriority);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditName(props.name);
    setEditPriority(props.priority ?? 0);
    setIsEditing(false);
  }

  return (
    <li className="todo stack-small">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor={`${props.id}-edit`} className="visually-hidden">
            Edit {props.name}
          </label>
          <input
            id={`${props.id}-edit`}
            type="text"
            className="todo-text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            ref={editFieldRef}
          />
          <div className="priority-wrapper">
            <label htmlFor={`${props.id}-edit-priority`} className="priority-label">
              Priority
            </label>
            <input
              id={`${props.id}-edit-priority`}
              type="number"
              min="0"
              step="1"
              value={editPriority}
              onChange={(event) => setEditPriority(Number(event.target.value) || 0)}
              className="priority-input"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn__primary">
              Save
            </button>
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="c-cb">
            <input
              id={props.id}
              type="checkbox"
              defaultChecked={props.completed}
              onChange={() => props.toggleTaskCompleted(props.id)}
            />
            <label className="todo-label" htmlFor={props.id}>
              {props.name}
            </label>
          </div>
          <div className="priority-wrapper">
            <label htmlFor={`${props.id}-priority`} className="priority-label">
              Priority
            </label>
            <input
              id={`${props.id}-priority`}
              type="number"
              min="0"
              step="1"
              value={props.priority ?? 0}
              onChange={(event) =>
                props.updateTaskPriority(props.id, Number(event.target.value) || 0)
              }
              className="priority-input"
              aria-label={`Priority for ${props.name}`}
            />
          </div>
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditName(props.name);
                setEditPriority(props.priority ?? 0);
                setIsEditing(true);
              }}
              ref={editButtonRef}
            >
              Edit <span className="visually-hidden">{props.name}</span>
            </button>
            <button
              type="button"
              className="btn btn__danger"
              onClick={() => props.deleteTask(props.id)}
            >
              Delete <span className="visually-hidden">{props.name}</span>
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default Todo;
