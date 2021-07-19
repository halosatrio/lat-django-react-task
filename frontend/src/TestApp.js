import { useEffect, useState } from "react";
import axios from "axios";
import TestModal from "./components/TestModal";

const TestApp = () => {
  // state
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);

  // hooks
  useEffect(() => {
    refreshList();
  }, []);

  // functions - handlers
  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => setTaskList(res.data))
      .catch((err) => console.log(err));
  };

  const displayCompleted = (status) => {
    setViewCompleted(status);
  };

  const toggle = () => {
    setModal(!modal);
    //add this after modal creation
    // this.setState({ modal: !this.state.modal }); //add this after modal creation
  };

  const handleSubmit = (item) => {
    toggle();
    // if old post to edit and submit
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    // if new post to submit
    axios
      .post(`http://localhost:8000/api/tasks/`, item)
      .then((res) => refreshList());
  };

  const handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    setModal(!modal);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(!modal);
  };

  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const newItems = taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-tile mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button onClick={() => handleDelete(item)} className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };

  return (
    <main className="content">
      <h1 className="text-black text-uppercase text-center my-4">
        Task Manager
      </h1>
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {modal ? (
        <TestModal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
          setActiveItem={setActiveItem}
        />
      ) : null}
    </main>
  );
};

export default TestApp;
