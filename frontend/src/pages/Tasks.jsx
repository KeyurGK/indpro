import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import AddTaskModal from "../components/Modals/AddTaskModal";
import TaskModal from "../components/Modals/TaskModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCookie from "../hooks/useCookie";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTask, GetTaskList, UpdateTask } from "../Redux/TaskReducer/TaskSlice";

const Tasks = () => {
  const token = useCookie("access");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { taskList, loading, error } = useSelector((state) => state.Task);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(GetTaskList({ token, search: searchQuery, completed: selectedStatus }));
    }
  }, [token, searchQuery, selectedStatus, dispatch,isModalOpen]);

  const markTaskAsComplete = async (taskId, title, description) => {
    try {
      await dispatch(UpdateTask({ token, taskId, title, description, completed: true })).unwrap();
      dispatch(GetTaskList({ token, search: searchQuery, completed: selectedStatus }));
      toast.success("Task marked as completed!");
    } catch (error) {
      toast.error("Error updating task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
    
      const response =  await dispatch(DeleteTask({ token, taskId })).unwrap();
      if(response?.data?.success){
      
      toast.success(response?.data?.message);
      dispatch(GetTaskList({ token, search: searchQuery, completed: selectedStatus }));
      }
       // console.log(await dispatch(DeleteTask({ token, taskId })).unwrap(),'dekete response')
      // dispatch(GetTaskList({ token, search: searchQuery, completed: selectedStatus }));
    } catch (error) {
      toast.error("Error deleting task.");
    }
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full md:w-auto"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border rounded-md w-full md:w-auto cursor-pointer"
          >
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Incomplete</option>
          </select>
         
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <ul className="space-y-3">
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : taskList?.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          taskList.map((task) => (
            <li
              key={task?.taskid}
              className={`p-4 border rounded-md shadow-sm flex justify-between items-center 
                ${task?.completed ? "bg-green-200" : "bg-white"} transition-all`}
            >
              <div className="flex flex-col cursor-pointer" onClick={() => {
                setTaskId(task?.taskid);
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}>
                <span className={task?.completed ? "line-through text-gray-500" : ""}>
                  {task?.title}
                </span>
                <span className="text-gray-600">({task?.category?.categoryName})</span>
              </div>
              
              <div className="flex space-x-2">
                {!task?.completed && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    onClick={() => markTaskAsComplete(task?.taskid, task?.title, task?.description)}
                  >
                    Mark as Complete
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  onClick={() => deleteTask(task?.taskid)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          taskId={taskId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Tasks;
