import React from 'react';
import { ITask } from '../types';

import './style.css';

interface TaskRendererProps {
  task: ITask;
  onToggled: (taskId: number) => void;
  setDragId: (taskId: number) => void;
  setDropId: (taskId: number) => void;
}

const TaskRenderer = ({
  task,
  onToggled,
  setDragId,
  setDropId,
}: TaskRendererProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggled(task.id);
      }}
      className="task"
      id={task.id.toString()}
      onDragStart={(e) => {
        e.stopPropagation();
        setDragId(task.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        setDropId(task.id);
      }}
      draggable={true}
    >
      {task.title} {task.completed ? 'X' : '-'}
      {task.children.map((subTask) => (
        <TaskRenderer
          key={subTask.id}
          task={subTask}
          onToggled={onToggled}
          setDragId={setDragId}
          setDropId={setDropId}
        />
      ))}
    </div>
  );
};

export default TaskRenderer;
