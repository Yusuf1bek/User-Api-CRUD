import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser } from "../context/userSlice";
import { FaRegEdit,FaRegTrashAlt  } from "react-icons/fa";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [modalType, setModalType] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    url: "",
    age: "",
    gender: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    if (newUser.name && newUser.surname && newUser.url && newUser.age && newUser.gender) {
      dispatch(addUser(newUser));
      setNewUser({ name: "", surname: "", url: "", age: "", gender: "" });
      setModalType(null);
    }
    toast.success("User added")
  };

  const handleUpdateUser = () => {
    if (editUser.name && editUser.surname && editUser.url && editUser.age && editUser.gender) {
      dispatch(updateUser({ id: editUser.id, updatedUser: editUser }));
      setEditUser(null);
      setModalType(null);
    }
    toast.info("User updated")
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      setUserToDelete(null);
      setModalType(null);
    }
    toast.warning("User deleted")
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-5 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">User List</h2>

        {loading && 
            <div class="flex flex-row gap-2 justify-center">
                <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
            </div>
        }
        {error && <p className="text-red-500">Error: {error}</p>}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-50 p-3 mb-2 rounded border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.url}
                alt="url"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.surname}</p>
                <p className="text-gray-500 text-xs">Age: {user.age}</p>
                <p className="text-gray-500 text-xs">Gender: {user.gender}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditUser(user);
                  setModalType("edit");
                }}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-slate-500 transition duration-300"
              >
                <FaRegEdit/>
              </button>
              <button
                onClick={() => {
                  setUserToDelete(user.id);
                  setModalType("delete");
                }}
                className="bg-slate-500 text-white py-1 px-3 rounded hover:bg-red-500 transition duration-300"
              >
                <FaRegTrashAlt/>
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setModalType("add")}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-5 hover:bg-blue-600 transition duration-300"
        >
          Add User
        </button>
      </div>

      {modalType === "add" && (
        <Modal title="Add New User" onClose={() => setModalType(null)}>
          <UserForm user={newUser} setUser={setNewUser} />
          <button
            onClick={handleAddUser}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Add
          </button>
        </Modal>
      )}

      {modalType === "edit" && editUser && (
        <Modal title="Edit User" onClose={() => setModalType(null)}>
          <UserForm user={editUser} setUser={setEditUser} />
          <button
            onClick={handleUpdateUser}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Update
          </button>
        </Modal>
      )}

      {modalType === "delete" && userToDelete && (
        <Modal title="Delete User" onClose={() => setModalType(null)}>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setModalType(null)}
              className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-md relative">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const UserForm = ({ user, setUser }) => (
  <div>
    <input
      type="text"
      placeholder="Name"
      value={user.name}
      onChange={(e) => setUser({ ...user, name: e.target.value })}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <input
      type="text"
      placeholder="Surname"
      value={user.surname}
      onChange={(e) => setUser({ ...user, surname: e.target.value })}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <input
      type="text"
      placeholder="Avatar URL"
      value={user.url}
      onChange={(e) => setUser({ ...user, url: e.target.value })}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <input
      type="number"
      placeholder="Age"
      value={user.age}
      onChange={(e) => setUser({ ...user, age: e.target.value })}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <select
      value={user.gender}
      onChange={(e) => setUser({ ...user, gender: e.target.value })}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>
);

export default Users;
