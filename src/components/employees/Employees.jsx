import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  Select,
  Popconfirm,
  notification,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  fetchDepartments,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  // searchEmployee,
} from "../../redux/user/Actions"; // To populate doctors
import ExcelHandler from "../ExcelHandler"; // Assuming ExcelHandler is implemented for Excel import/export
import debounce from "lodash-es/debounce";

export default function Employees() {
  const dispatch = useDispatch();

  // Destructuring from Redux store using useSelector hook
  const { loading, employees, departments,searchResults, error } = useSelector(
    (state) => state
  );

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false); // Modal visibility
  const [confirmLoading, setConfirmLoading] = useState(false); // Modal loading state
  const [searchText, setSearchText] = useState(""); // Search text
  const [searchField, setSearchField] = useState("id"); // Search field
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department_id: "",
    phone_number: "",
    email: "",
    salary: "",
    hire_date: "",
  });
  const [editEmployee, setEditEmployee] = useState(null); // Patient for editing
  const [form] = Form.useForm();
  const { Option } = Select;

  // Fetch patients and doctors on mount
  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, []);

  useEffect(() => {
    setData(employees); // Update local state with patients from Redux store
  }, [employees]);
  useEffect(() => {
    if (editEmployee) {
      form.setFieldsValue(editEmployee); // Populate form fields when editDoctor changes
    }
  }, [editEmployee, form]);


  const handleSearchFieldChange = (value) => {
      setSearchField(value); // Update the selected field
    };
  
    const handleSearch = (e) => {
      setSearchText(e.target.value); // Update search text
    };
  
    useEffect(() => {
      if (searchText && searchText.trim().length > 0) {
        handleSearchDebounced(searchText);
      } else if(!searchText) {
        handleSearchDebounced.cancel();
        setSearchText(""); // Clear search text
        setData(employees); // Reset to initial user data
      }
    }, [searchText]);
  
  
    const handleSearchDebounced = useCallback(
    debounce((value) => {
      // dispatch(searchEmployee(searchField, value));
    }, 500),
    [searchField] // Ensure the searchField dependency is included
  );
  
    useEffect(() => {
      setData(searchResults);
    }, [searchResults]); // Make sure search results are included as a dependency
  

  // Display notifications
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id", // Make sure patient_id exists in your data
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "15%",
    },
    {
      title: "Position",
      dataIndex: "position",
      sorter: (a, b) => a.position - b.position,
      sortDirections: ["ascend", "descend"],
      width: "10%",
    },
    {
      title: "Department",
      dataIndex: "department_id",
      render: (departmentId) => {
        const department = departments.find((dep) => dep.id === departmentId);
        return department ? department.name : "Not Found"; // Safeguard to avoid undefined error
      },
      width: "15%",
    },

    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      width: "15%",
    },
    {
      title: "Salary $",
      dataIndex: "salary",
      width: "15%",
    },

    {
      title: "Hire Date",
      dataIndex: "hire_date",
      sorter: (a, b) => {
        const dateA = new Date(a.hire_date);
        const dateB = new Date(b.hire_date);
        return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
      },
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "Invalid Date", // Use 'en-GB' for consistent date format
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
            title="Are you sure you want to delete this Employee?"
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
    setEditEmployee(record);
    setVisible(true);
  };
 

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updateEmployee(editEmployee.id, editEmployee));

        setTimeout(() => {
          form.resetFields();

          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchEmployees());
          showNotification(
            "success",
            "Employee Updated",
            "Employee's information has been updated successfully."
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
        console.log(newEmployee);
        dispatch(addEmployee(newEmployee));

        setTimeout(() => {
          form.resetFields();

          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchEmployees());
          showNotification(
            "success",
            "Employee Added",
            "New Employee has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    setTimeout(() => {
      dispatch(fetchEmployees());
      showNotification(
        "success",
        "Employee Deleted",
        "Employee has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields();

    setVisible(false);
    setEditEmployee(null);
    setNewEmployee({
      name: "",
      position: "",
      department_id: "",
      phone_number: "",
      email: "",
      salary: "",
      hire_date: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editEmployee) {
      setEditEmployee({ ...editEmployee, [name]: value });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
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
      <h2 className="table-header">Employees List</h2>

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
            exportFileName="employees_list.xlsx"
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
              <Option value="salary">salary</Option>
              <Option value="email">Email</Option>
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
            Add Employee
          </Button>
        </div>
      </div>

      <Modal
        title={editEmployee ? "Edit Employee" : "Add Employee"}
        visible={visible}
        onOk={editEmployee ? handleEditOk : handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the Employee's name!" },
            ]}
          >
            <Input
              name="name"
              value={editEmployee ? editEmployee.name : newEmployee.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[
              {
                required: true,
                message: "Please input the Employee's position!",
              },
            ]}
          >
            <Input
              name="position"
              type="text"
              value={
                editEmployee ? editEmployee.position : newEmployee.position
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          {/* <Form.Item
            label="Gender"
            name="gender"
            rules={[
              { required: true, message: "Please input the patient's gender!" },
            ]}
          >
            <Select
              name="gender"
              value={editPatient ? editPatient.gender : newPatient.gender}
              onChange={(value) =>
                editPatient
                  ? setEditPatient({ ...editPatient, gender: value })
                  : setNewPatient({ ...newPatient, gender: value })
              }
            >
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            label="Department"
            name="department_id"
            rules={[{ required: true, message: "Please select a department!" }]}
          >
            <Select
              name="department_id"
              value={
                editEmployee
                  ? editEmployee.department_id
                  : newEmployee.department_id
              }
              onChange={(value) =>
                editEmployee
                  ? setEditEmployee({ ...editEmployee, department_id: value })
                  : setNewEmployee({ ...newEmployee, department_id: value })
              }
            >
              {departments.map((department) => (
                <Option key={department.id} value={department.id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please input the patient's phone number!",
              },
            ]}
          >
            <Input
              name="phone_number"
              type="number"
              value={
                editEmployee ? editEmployee.phone_number : newEmployee.phone_number
              }
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the patient's email!" },
            ]}
          >
            <Input
              name="email"
              type="email"
              value={editEmployee ? editEmployee.email : newEmployee.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Salary"
            name="salary"
            rules={[
              {
                required: true,
                message: "Please input the Employee's salary!",
              },
            ]}
          >
            <Input
              name="salary"
              type="number"
              value={editEmployee ? editEmployee.salary : newEmployee.salary}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Hire Date"
            name="hire_date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <Input
              type="date"
              name="hire_date"
              value={
                editEmployee ? editEmployee.hire_date : newEmployee.hire_date
              }
              onChange={handleInputChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        loading={loading} // Pass loading from state
        className="centered-table"
      />
    </div>
  );
}
