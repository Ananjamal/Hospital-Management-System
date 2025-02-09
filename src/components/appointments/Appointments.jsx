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
  fetchPatients,
  fetchDepartments,
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../redux/user/Actions";
import ExcelHandler from "../ExcelHandler";
import debounce from "lodash-es/debounce";

export default function Appointments() {
  const dispatch = useDispatch();
  const {
    loading,
    users,
    patients,
    appointments,
    searchResults,
    error,
    departments,
  } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [newAppointment, setNewAppointment] = useState({
    appointment_id: "",
    patient_id: "",
    doctor_id: "",
    department_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "Pending",
  });
  const [editAppointment, setEditAppointment] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchPatients());
    dispatch(fetchUsers());
    dispatch(fetchDepartments());
  }, []);

  useEffect(() => {
    setData(appointments);
  }, [appointments]);

  useEffect(() => {
    if (editAppointment) {
      form.setFieldsValue(editAppointment);
    }
  }, [editAppointment, form]);

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
      setData(appointments); // Reset to initial user data
    }
  }, [searchText]);

  const handleSearchDebounced = useCallback(
    debounce((value) => {}, 500),
    [searchField] // Ensure the searchField dependency is included
  );

  useEffect(() => {
    setData(searchResults);
  }, [searchResults]); // Make sure search results are included as a dependency

  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "id",
      width: "15%",
    },
    {
      title: "Patient ",
      dataIndex: "patient_id",
      render: (patient_id) => {
        const patient = patients.find((pat) => pat.id === patient_id);
        return patient ? patient.name : "Not Found";
      },
      width: "15%",
    },
    {
      title: "Doctor ",
      dataIndex: "doctor_id",
      render: (doctor_id) => {
        const doctor = users.find((doc) => doc.id === doctor_id);
        return doctor ? doctor.name : "Not Found";
      },
      width: "15%",
    },
    {
      title: "Department",
      dataIndex: "department_id",
      render: (department_id) => {
        const department = departments.find((dep) => dep.id === department_id);
        return department ? department.name : "Not Found";
      },
      width: "15%",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointment_date",
      sorter: (a, b) => {
        const dateA = new Date(a.appointment_date);
        const dateB = new Date(b.appointment_date);
        return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
      },
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "Invalid Date", // Use 'en-GB' for consistent date format
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointment_time",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Confirmed", value: "Confirmed" },
        { text: "Pending", value: "Pending" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
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
            title="Are you sure you want to delete this appointment?"
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
    setEditAppointment(record);
    setVisible(true);
  };

  const handleImport = (importedData) => {
    const formattedData = importedData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
    setData(formattedData);
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(addAppointment(newAppointment));
        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchAppointments());
          showNotification(
            "success",
            "Appointment Added",
            "New Appointment has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updateAppointment(editAppointment.id, editAppointment));
        setTimeout(() => {
          form.resetFields();
          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchAppointments());
          showNotification(
            "success",
            "Appointment Updated",
            "Appointment has been updated successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteAppointment(id));
    setTimeout(() => {
      dispatch(fetchAppointments());
      showNotification(
        "success",
        "Appointment Deleted",
        "Appointment has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setNewAppointment({
      appointment_id: "",
      patient_id: "",
      doctor_id: "",
      department_id: "",
      appointment_date: "",
      appointment_time: "",
      status: "Pending",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editAppointment) {
      setEditAppointment({ ...editAppointment, [name]: value });
    } else {
      setNewAppointment({ ...newAppointment, [name]: value });
    }
  };

  return (
    <div className="table-wrapper">
      <h2 className="table-header">Appointments List</h2>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <ExcelHandler
            data={appointments}
            columns={columns}
            handleImport={handleImport}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select
              defaultValue="id"
              style={{
                width: "180px",
                borderRadius: "8px",
              }}
              onChange={handleSearchFieldChange}
            >
              <Option value="id">ID</Option>
              {/* <Option value="name">Name</Option> */}
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
            icon={<PlusOutlined />}
            type="primary"
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
            Add Appointment
          </Button>
        </div>

        <Table
          style={{
            marginTop: "20px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editAppointment ? "Edit Appointment" : "Add Appointment"}
          visible={visible}
          onOk={editAppointment ? handleEditOk : handleAddOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Save"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Patient"
              name="patient_id"
              rules={[{ required: true, message: "Please select a patient" }]}
            >
              <Select
                value={
                  editAppointment
                    ? editAppointment.patient_id
                    : newAppointment.patient_id
                }
                onChange={(value) => {
                  if (editAppointment) {
                    setEditAppointment({
                      ...editAppointment,
                      patient_id: value,
                    });
                  } else {
                    setNewAppointment({ ...newAppointment, patient_id: value });
                  }
                }}
              >
                {patients.map((patient) => (
                  <Option key={patient.id} value={patient.id}>
                    {patient.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Doctor"
              name="doctor_id"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select
                value={
                  editAppointment
                    ? editAppointment.doctor_id
                    : newAppointment.doctor_id
                }
                onChange={(value) => {
                  if (editAppointment) {
                    setEditAppointment({
                      ...editAppointment,
                      doctor_id: value,
                    });
                  } else {
                    setNewAppointment({ ...newAppointment, doctor_id: value });
                  }
                }}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Department"
              name="department_id"
              rules={[
                { required: true, message: "Please select a department" },
              ]}
            >
              <Select
                value={
                  editAppointment
                    ? editAppointment.department_id
                    : newAppointment.department_id
                }
                onChange={(value) => {
                  if (editAppointment) {
                    setEditAppointment({
                      ...editAppointment,
                      department_id: value,
                    });
                  } else {
                    setNewAppointment({
                      ...newAppointment,
                      department_id: value,
                    });
                  }
                }}
              >
                {departments.map((department) => (
                  <Option key={department.id} value={department.id}>
                    {department.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Appointment Date"
              name="appointment_date"
              rules={[
                {
                  required: true,
                  message: "Please select an appointment date",
                },
              ]}
            >
              <Input
                name="appointment_date"
                onChange={handleInputChange}
                type="date"
                value={
                  editAppointment
                    ? editAppointment.appointment_date
                    : newAppointment.appointment_date
                }
              />
            </Form.Item>

            <Form.Item
              label="Appointment Time"
              name="appointment_time"
              rules={[
                { required: true, message: "Please enter an appointment time" },
              ]}
            >
              <Input
                name="appointment_time"
                type="time"
                onChange={handleInputChange}
                value={
                  editAppointment
                    ? editAppointment.appointment_time
                    : newAppointment.appointment_time
                }
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select
                value={
                  editAppointment
                    ? editAppointment.status
                    : newAppointment.status
                }
                onChange={(value) => {
                  if (editAppointment) {
                    setEditAppointment({ ...editAppointment, status: value });
                  } else {
                    setNewAppointment({ ...newAppointment, status: value });
                  }
                }}
              >
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
