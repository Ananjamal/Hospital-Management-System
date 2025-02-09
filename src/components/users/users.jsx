import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  Popconfirm,
  notification,
  Select,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUser,
  addUser,
  deleteUser,
} from "../../redux/user/Actions";

import ExcelHandler from "../ExcelHandler";
import debounce from "lodash-es/debounce";
import { selectUsers } from "../../redux/user/Selector";

export default function Departments() {
  const { Paragraph } = Typography;

  const dispatch = useDispatch();
  const { loading, searchResults, error } = useSelector((state) => state);
  const users = useSelector(selectUsers);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    if (editUser) {
      form.setFieldsValue(editUser); // Populate form fields when editDepartment changes
    }
  }, [editUser, form]);
  const handleSearchFieldChange = (value) => {
    setSearchField(value); // Update the selected field
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update search text
  };

  useEffect(() => {
    if (searchText && searchText.trim().length > 0) {
      handleSearchDebounced(searchText);
    } else if (!searchText) {
      handleSearchDebounced.cancel();
      setSearchText(""); // Clear search text
      setData(users); // Reset to initial user data
    }
  }, [searchText]);

  const handleSearchDebounced = useCallback(
    debounce((value) => {
      // dispatch(searchDepartment(searchField, value));
    }, 500),
    [searchField] // Ensure the searchField dependency is included
  );

  useEffect(() => {
    setData(searchResults);
  }, [searchResults]); // Make sure search results are included as a dependency

  const showNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "20%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            style={{ width: "100%", marginBottom: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} style={{ width: "100%" }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   sorter: (a, b) => a.password.localeCompare(b.password),
    //   sortDirections: ["ascend", "descend"],
    //   width: "30%",
    // },

    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            onClick={() => showEditModal(record)}
            style={{
              marginRight: "12px",
              padding: "5px 20px",
              fontSize: "14px",
              borderRadius: "6px",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this department?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<DeleteOutlined style={{ color: "red" }} />}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              style={{
                padding: "5px 20px",
                fontSize: "14px",
                borderRadius: "6px",
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
              }}
            />
          </Popconfirm>
        </div>
      ),
      width: "10%",
    },
  ];

  const showEditModal = (record) => {
    setEditUser(record);
    setVisible(true);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updateUser(editUser.id, editUser));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchUsers());
          showNotification(
            "success",
            "User Updated",
            "User's information has been updated successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(addUser(newUser));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchUsers());
          showNotification(
            "success",
            "User Added",
            "New User has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    setTimeout(() => {
      dispatch(fetchUsers());
      showNotification(
        "success",
        "User Deleted",
        "User has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setVisible(false); // Close the modal
    setEditUser(null); // Reset editDepartment state
    setGeneratedPassword(null); // Set the generated password

    setNewUser({
      // Reset newDepartment fields
      name: "",
      email: "",
      phone_number: "",
      password: "",
      role: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleImport = (importedData) => {
    const formattedData = importedData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
    setData(formattedData);
  };
  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Function to handle password regeneration and clipboard copy
  const handlePasswordRegeneration = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword); // Set the generated password
    form.setFieldsValue({ password: newPassword }); // Set the password in the form
    setEditUser({ ...editUser, password: newPassword });

    navigator.clipboard
      .writeText(newPassword) // Copy the password to clipboard
      .then(() => {
        alert("Password copied to clipboard!"); // Notify the user
      })
      .catch((err) => {
        alert("Failed to copy password: " + err); // Error handling
      });
  };

  return (
    <div className="table-wrapper">
      <h2 className="table-header">Users List</h2>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Excel Handler */}
        <div style={{ marginBottom: "20px" }}>
          <ExcelHandler
            onImport={handleImport}
            data={data}
            exportFileName="Users_list.xlsx"
          />
        </div>

        {/* Search Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Select
              defaultValue="id"
              style={{
                width: "180px",
                borderRadius: "8px",
              }}
              onChange={handleSearchFieldChange}
            >
              <Option value="id">ID</Option>
              <Option value="name">Name</Option>
            </Select>
            <Input
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              placeholder={`Search by ${searchField}...`}
              value={searchText}
              onChange={handleSearch}
              style={{
                width: "300px",
                borderRadius: "8px",
              }}
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              padding: "0 24px",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Modal for Adding/Editing Doctor */}
      <Modal
        title={editUser ? "Edit User" : "Add User"}
        visible={visible}
        onOk={editUser ? handleEditOk : handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the User's name!",
              },
            ]}
          >
            <Input name="name" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the User's email!",
              },
            ]}
          >
            <Input name="email" type="email" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the User's password!",
              },
            ]}
          >
            {!editUser && (
              <Input
                name="password"
                type="password"
                onChange={handleInputChange}
              />
            )}
            {editUser && (
              <>
                <Button onClick={handlePasswordRegeneration} type="primary">
                  Regenerate Password & Copy to Clipboard
                </Button>

                {/* Display the generated password */}
                {generatedPassword && (
                  <Form.Item
                    onChange={handleInputChange}
                    label="Generated Password"
                  >
                    <Paragraph copyable>{generatedPassword}</Paragraph>
                  </Form.Item>
                )}
              </>
            )}
          </Form.Item>

          {/* Only show password regeneration for editing */}

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please input the User's phone Number!",
              },
            ]}
          >
            <Input
              name="phone_number"
              type="number"
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Please input the user's role!" },
            ]}
          >
            <Select
              name="role"
              value={editUser ? editUser.role : newUser.role}
              onChange={(value) =>
                editUser
                  ? setEditUser({ ...editUser, role: value })
                  : setNewUser({ ...newUser, role: value })
              }
            >
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        loading={loading} // Pass loading from state
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
