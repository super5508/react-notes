import React, { useState, useCallback } from 'react';
import TaskRenderer from '../../components/Task';
import { ITask } from '../../types';

import './style.css';

const toggleTask = (rootTask: ITask, taskId: number): ITask => {
  if (rootTask.id === taskId) {
    return {
      ...rootTask,
      completed: !rootTask.completed,
    };
  }

  return {
    ...rootTask,
    children: rootTask.children.map((task) => {
      return toggleTask(task, taskId);
    }),
  };
};

const checkTasks = (tasks: ITask[], taskId: number) => {
  return tasks.map((subTask) => {
    return toggleTask(subTask, taskId);
  });
};

const pickTask = (tasks: ITask[], taskId: number) => {
  const foundTask = tasks.find((t) => t.id === taskId);
  if (foundTask) {
    return foundTask;
  }

  return pickTask(tasks, taskId);
};

const updateTask = (
  rootTask: ITask,
  taskId: number,
  sourceTask: ITask,
  isRemove = false
): ITask => {
  if (isRemove) {
    if (rootTask.children.find((t) => t.id === taskId)) {
      return {
        ...rootTask,
        children: rootTask.children.filter((t) => t.id !== taskId),
      };
    }
    return rootTask;
  } else {
    return {
      ...rootTask,
      children: [...rootTask.children, sourceTask],
    };
  }
};

const moveTasks = (tasks: ITask[], sourceId: number, destId: number) => {
  const sourceTask = pickTask(tasks, sourceId);

  return tasks.map((task) => {
    let updatedTask = updateTask(task, sourceId, sourceTask, true);
    return updateTask(updatedTask, destId, sourceTask, false);
  });
};

const TasksPage = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<ITask[]>([
    {
      id: 0,
      title: 'AAA',
      completed: false,
      children: [
        {
          id: 2,
          title: 'CCC',
          completed: false,
          children: [],
        },
        {
          id: 3,
          title: 'DDD',
          completed: false,
          children: [],
        },
        {
          id: 4,
          title: 'EEE',
          completed: false,
          children: [],
        },
      ],
    },
    {
      id: 1,
      title: 'BBB',
      completed: false,
      children: [],
    },
  ]);
  const [uniqueId, setUniqueId] = useState(5);
  const [dragId, setDragId] = useState(-1);
  const [dropId, setDropId] = useState(-1);

  const onAddNewTask = useCallback(() => {
    setTasks((prevTasks) => {
      return [
        ...prevTasks,
        {
          id: uniqueId,
          title: newTaskTitle,
          children: [],
          completed: false,
        },
      ];
    });
    setUniqueId((uId) => uId + 1);
    setNewTaskTitle('');
  }, [newTaskTitle, setTasks, uniqueId, setUniqueId]);

  const onToggleTask = useCallback(
    (taskId: number) => {
      setTasks((currentTasks) => checkTasks(currentTasks, taskId));
    },
    [setTasks]
  );

  return (
    <div>
      <section>
        <input
          placeholder="Input task name"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={onAddNewTask}>Add</button>
      </section>
      <ul>
        {tasks.map((task) => (
          <TaskRenderer
            key={task.id}
            task={task}
            onToggled={onToggleTask}
            setDragId={(newId) => {
              setDragId((oldId) => (oldId >= 0 ? oldId : newId));
            }}
            setDropId={(newId) => {
              setDropId(newId);
              setTasks((oldTasks) => moveTasks(oldTasks, dragId, dropId));
              alert('Hello');
              setDragId(-1);
              setDropId(-1);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
