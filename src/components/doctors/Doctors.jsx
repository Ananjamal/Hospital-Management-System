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
  fetchUsers,
  fetchDoctors,
  updateDoctor,
  addDoctor,
  deleteDoctor,
} from "../../redux/user/Actions";
import ExcelHandler from "../ExcelHandler";
import debounce from "lodash-es/debounce";
import { PAGE_SIZE } from "../../redux/user/Types";
import {
  selectDoctors,
  selectUserInfo,
  selectUsers,
} from "../../redux/user/Selector";

export default function Doctors() {
  const dispatch = useDispatch();
  const { loading, searchResults, sortResults } = useSelector((state) => state);

  const auth = useSelector(selectUserInfo);

  const userRole = auth.user.role;

  const doctors = useSelector(selectDoctors);
  const users = useSelector(selectUsers);
  const [sortState, setSortState] = useState({ sorter: null, order: null });

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // Search text
  const [searchField, setSearchField] = useState("id"); // Search field
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    experience: "",
    city: "",
    phone_number: "",
    email: "",
  });
  const [filters, setFilters] = useState({
    specialization: null,
    city: null,
    experience: null,
  });

  const [editDoctor, setEditDoctor] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchDoctors());
  }, []);

  useEffect(() => {
    setData(doctors.doctors);
  }, [users, doctors]);

  useEffect(() => {
    if (editDoctor) {
      form.setFieldsValue(editDoctor); // Populate form fields when editDoctor changes
    }
  }, [editDoctor, form]);

  const handleSearchFieldChange = (value) => {
    setSearchField(value); // Update the selected field
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update search text
  };

  useEffect(() => {
    if (searchText && searchText.trim().length > 0) {
      handleSearchDebounced(searchText);
    } else {
      handleSearchDebounced.cancel();
      dispatch(fetchDoctors({ searchField, value: "", filters: filters })); // Fetch all doctors with empty search
    }
  }, [searchText, searchField]); // Add searchField as a dependency

  const handleSearchDebounced = useCallback(
    debounce((value) => {
      dispatch(fetchDoctors({ searchField, value, filters: filters }));
    }, 500),
    [searchField] // Ensure the searchField dependency is included
  );

  useEffect(() => {
    // setData(searchResults.doctors);
  }, [searchResults]); // Make sure search results are included as a dependency

  useEffect(() => {
    // setData(sortResults.doctors);
  }, [sortResults]);

  const showNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleSort = (sorter) => {
    const order =
      sortState.sorter === sorter && sortState.order === "asc" ? "desc" : "asc";
    setSortState({ sorter, order });
    dispatch(fetchDoctors({ sorter, order }));
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sortDirections: ["descend", "ascend", "descend"],

      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("id"),
      }),
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortDirections: ["descend", "ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("name"),
      }),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("email"),
      }),
      width: "15%",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("phone_number"),
      }),
      width: "15%",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("specialization"),
      }),
      width: "15%",
    },
    {
      title: "Experience (Years)",
      dataIndex: "experience",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("experience"),
      }),
      width: "15%",
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("city"),
      }),
      width: "15%",
    },
    ...(userRole === "admin"
      ? [
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
                  title="Are you sure you want to delete this doctor?"
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
        ]
      : []),
  ];
  const showEditModal = (record) => {
    setEditDoctor(record);
    setVisible(true);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updateDoctor(editDoctor.id, editDoctor));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchDoctors());
          showNotification(
            "success",
            "Doctor Updated",
            "Doctor's information has been updated successfully."
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
        dispatch(addDoctor(newDoctor));

        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchDoctors());
          showNotification(
            "success",
            "Doctor Added",
            "New doctor has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteDoctor(id));
    setTimeout(() => {
      dispatch(fetchDoctors());
      showNotification(
        "success",
        "Doctor Deleted",
        "Doctor has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setVisible(false); // Close the modal
    setEditDoctor(null); // Reset editDoctor state
    setNewDoctor({
      // Reset newDoctor fields
      name: "",
      specialization: "",
      experience: "",
      city: "",
      email: "",
      phone_number: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editDoctor) {
      setEditDoctor({ ...editDoctor, [name]: value });
    } else {
      setNewDoctor({ ...newDoctor, [name]: value });
    }
  };
  const onTableChange = (pagination) => {
    dispatch(
      fetchDoctors({
        page: pagination.current,
        searchField,
        value: searchText,
        filters: filters,
      })
    );
  };
  // Reset Filters
  const resetFilters = () => {
    setFilters({
      specialization: null,
      city: null,
      experience: null,
    });
    dispatch(fetchDoctors({ searchField, value: searchText }));
  };
  // Handle Filter Change
  const handleFilterChange = (searchField, value) => {
    setFilters((prev) => ({ ...prev, [searchField]: value }));
  };

  useEffect(() => {
    dispatch(
      fetchDoctors({ searchField, value: searchText, filters: filters })
    ); // Dispatch the action to fetch doctors
  }, [filters, dispatch]); // Make sure to add dispatch as a dependency

  const handleImport = (importedData) => {
    const formattedData = importedData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
    setData(formattedData);
  };
  return (
    <div className="table-wrapper">
      <h2 className="table-header">Doctors List</h2>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "10px",
        }}
      >
        {/* Excel Handler */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ExcelHandler
            onImport={handleImport}
            data={data}
            exportFileName="doctors_list.xlsx"
          />
          {userRole === "admin" && (
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
                float: "right",
                marginLeft: "55%",
              }}
            >
              Add Doctor
            </Button>
          )}
        </div>

        {/* Search Controls */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ margin: 0, color: "#333" }}>Search</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Select
              defaultValue="id"
              style={{
                width: "140px",
                borderRadius: "8px",
              }}
              onChange={handleSearchFieldChange}
            >
              <Option value="id">ID</Option>
              <Option value="name">Name</Option>
              <Option value="specialization">Specialization</Option>
              <Option value="city">City</Option>
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
        </div>
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ margin: 0, color: "#333" }}>Filters</h3>

          <Select
            placeholder="Select Specialization"
            style={{
              width: "200px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            value={filters.specialization}
            onChange={(value) => handleFilterChange("specialization", value)}
          >
            <Option value="biology">Biology</Option>
            <Option value="Dermatologist">Dermatologist</Option>
            <Option value="Pediatrician">Pediatrician</Option>
          </Select>

          {/* City Filter */}
          <Select
            placeholder="Select City"
            style={{
              width: "200px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            value={filters.city}
            onChange={(value) => handleFilterChange("city", value)}
          >
            <Option value="gaza">Gaza</Option>
            <Option value="rafah">Rafah</Option>
          </Select>

          {/* Experience Filter */}
          <Select
            placeholder="Select Experience"
            style={{
              width: "200px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            value={filters.experience}
            onChange={(value) => handleFilterChange("experience", value)}
          >
            <Option value="<5">Less than 5 years</Option>
            <Option value="5-10">5-10 years</Option>
            <Option value=">10">More than 10 years</Option>
          </Select>
          <Button
            style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "5px 15px",
            }}
            onClick={resetFilters}
          >
            Cancel Filters
          </Button>
        </div>
      </div>

      {/* Modal for Adding/Editing Doctor */}
      <Modal
        title={editDoctor ? "Edit Doctor" : "Add Doctor"}
        visible={visible}
        onOk={editDoctor ? handleEditOk : handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the doctor's name!" },
            ]}
          >
            <Input name="name" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the doctor's email!" },
              { type: "email", message: "Please input a valid email address!" },
            ]}
          >
            <Input name="email" type="email" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please input the doctor's phone number!",
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please input a valid phone number!",
              },
            ]}
          >
            <Input name="phone_number" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              {
                required: true,
                message: "Please input the doctor's specialization!",
              },
            ]}
          >
            <Input name="specialization" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Experience (Years)"
            name="experience"
            rules={[
              { required: true, message: "Please input experience!" },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Experience should be a positive number!")
                      ),
              },
            ]}
          >
            <Input
              name="experience"
              type="number"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[
              { required: true, message: "Please input the doctor's city!" },
            ]}
          >
            <Input name="city" onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: PAGE_SIZE,
          total: doctors?.total,
        }}
        onChange={onTableChange}
      />
    </div>
  );
}
