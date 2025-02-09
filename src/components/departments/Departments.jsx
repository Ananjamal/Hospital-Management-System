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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  updateDepartment,
  addDepartment,
  deleteDepartment,
  // searchDepartment,
} from "../../redux/user/Actions";
import ExcelHandler from "../ExcelHandler";
import debounce from "lodash-es/debounce";

export default function Departments() {
  const dispatch = useDispatch();
  const { loading, departments, searchResults, error } = useSelector(
    (state) => state
  );

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });
  const [editDepartment, setEditDepartment] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  useEffect(() => {
    setData(departments);
  }, [departments]);

  useEffect(() => {
    if (editDepartment) {
      form.setFieldsValue(editDepartment); // Populate form fields when editDepartment changes
    }
  }, [editDepartment, form]);
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
      setData(departments); // Reset to initial user data
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
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      sortDirections: ["ascend", "descend"],
      width: "30%",
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
      width: "20%",
    },
  ];

  const showEditModal = (record) => {
    setEditDepartment(record);
    setVisible(true);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updateDepartment(editDepartment.id, editDepartment));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchDepartments());
          showNotification(
            "success",
            "Department Updated",
            "Department's information has been updated successfully."
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
        dispatch(addDepartment(newDepartment));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchDepartments());
          showNotification(
            "success",
            "Department Added",
            "New department has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteDepartment(id));
    setTimeout(() => {
      dispatch(fetchDepartments());
      showNotification(
        "success",
        "Department Deleted",
        "Department has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setVisible(false); // Close the modal
    setEditDepartment(null); // Reset editDepartment state
    setNewDepartment({
      // Reset newDepartment fields
      name: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editDepartment) {
      setEditDepartment({ ...editDepartment, [name]: value });
    } else {
      setNewDepartment({ ...newDepartment, [name]: value });
    }
  };

  const handleImport = (importedData) => {
    const formattedData = importedData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
    setData(formattedData);
  };

  return (
    <div className="table-wrapper">
      <h2 className="table-header">Departments List</h2>

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
            exportFileName="Departments_list.xlsx"
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
            Add Department
          </Button>
        </div>
      </div>

      {/* Modal for Adding/Editing Doctor */}
      <Modal
        title={editDepartment ? "Edit Department" : "Add Department"}
        visible={visible}
        onOk={editDepartment ? handleEditOk : handleAddOk}
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
                message: "Please input the Department's name!",
              },
            ]}
          >
            <Input name="name" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the Department's description!",
              },
            ]}
          >
            <Input
              name="description"
              type="text"
              onChange={handleInputChange}
            />
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
