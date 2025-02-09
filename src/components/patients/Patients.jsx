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
  Typography,
  Row,
  Col,
  Upload,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
  PaperClipOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctors,
  fetchPatients,
  addPatient,
  updatePatient,
  deletePatient,
  updateAttachment,
  fetchAttachments,
  addAttachment,
  fetchPatientAttachments,
  deleteAttachment,
  // searchPatient,
} from "../../redux/user/Actions"; // To populate doctors
import ExcelHandler from "../ExcelHandler"; // Assuming ExcelHandler is implemented for Excel import/export
import debounce from "lodash-es/debounce";
import {
  selectDoctors,
  selectUserInfo,
  selectAttachments,
} from "../../redux/user/Selector";
// import FileViewer from "../FileViewer";

export default function Patients() {
  const dispatch = useDispatch();

  // Destructuring from Redux store using useSelector hook
  const { loading, patients, searchResults, error } = useSelector(
    (state) => state
  );
  const doctors = useSelector(selectDoctors);
  const users = useSelector(selectUserInfo);
  const PatientAttachments = useSelector(selectAttachments);

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false); // Modal visibility
  const [visibleUpload, setVisibleUpload] = useState(false); // Modal visibility

  const [confirmLoading, setConfirmLoading] = useState(false); // Modal loading state
  const [searchText, setSearchText] = useState(""); // Search text
  const [searchField, setSearchField] = useState("id"); // Search field
  const [newPatient, setNewPatient] = useState({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    patient_address: "",
    patient_phone: "",
    patient_email: "",
    doctor_id: "",
    disease_name: "",
  });

  const [editPatient, setEditPatient] = useState(null); // Patient for editing
  const [newAttachment, setNewAttachment] = useState({
    patient_id: "",
    file_name: "",
    file_type: "",
  });
  const [editAttachment, setEditAttachment] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isAttachmentModalVisible, setIsAttachmentModalVisible] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [form] = Form.useForm();
  const { Option } = Select;

  // Fetch patients and doctors on mount
  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchDoctors());
  }, []);

  useEffect(() => {
    setData(patients); // Update local state with patients from Redux store
  }, [patients]);

  useEffect(() => {
    if (editPatient) {
      form.setFieldsValue(editPatient); // Populate form fields when editDoctor changes
    }
  }, [editPatient, form]);

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
      setData(patients); // Reset to initial user data
    }
  }, [searchText]);

  const handleSearchDebounced = useCallback(
    debounce((value) => {
      // dispatch(searchPatient(searchField, value));
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
      dataIndex: "patient_id", // Make sure patient_id exists in your data
      sorter: (a, b) => a.patient_id - b.patient_id,
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "patient_name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "15%",
    },
    {
      title: "Age",
      dataIndex: "patient_age",
      sorter: (a, b) => a.age - b.age,
      sortDirections: ["ascend", "descend"],
      width: "10%",
    },
    {
      title: "Gender",
      dataIndex: "patient_gender",
      width: "10%",
    },
    {
      title: "Address",
      dataIndex: "patient_address",
      width: "15%",
    },
    {
      title: "Phone Number",
      dataIndex: "patient_phone",
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "patient_email",
      width: "15%",
    },
    {
      title: "Disease Name",
      dataIndex: "disease_name",
      width: "15%",
    },
    {
      title: "Doctor",
      dataIndex: "doctor_name",
      // render: (doctorId) => {
      //   console.log(users); // Check if users array is loaded properly

      //   const doctor = users.find((doc) => doc.id === doctorId);
      //   return doctor ? doctor.name : "Not Found"; // Safeguard to avoid undefined error
      // },
      width: "15%",
    },

    {
      title: "Attachments",
      dataIndex: "attachments",
      render: (text, record) => (
        <Button
          type="link"
          icon={<PaperClipOutlined />}
          onClick={() => showAttachmentModal(record)}
        />
      ),
      width: "10%",
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
          <Button
            type="primary"
            onClick={() => showUploadModal(record)}
            style={{
              marginRight: "12px",
              padding: "5px 20px",
              fontSize: "14px",
              borderRadius: "6px",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            <UploadOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this patient?"
            onConfirm={() => handleDelete(record.patient_id)}
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
  const showAttachmentModal = (record) => {
    setSelectedPatient(record);

    dispatch(fetchPatientAttachments(record.patient_id));
    setIsAttachmentModalVisible(true);
  };

  const handleAttachmentModalCancel = () => {
    setSelectedPatient(null);
    setIsAttachmentModalVisible(false);
  };

  const showEditModal = (record) => {
    setEditPatient(record);
    setVisible(true);
  };

  const showUploadModal = (record) => {
    setNewAttachment({
      ...newAttachment,
      patient_id: record.patient_id, // Ensure patient_id is coming from record
    });

    setVisibleUpload(true);
  };
  const handleUploadOk = () => {
    form.validateFields().then(() => {
      if (!newAttachment.patient_id) {
        showNotification("error", "Error", "Patient ID is missing.");
        return;
      }

      if (!fileList.length) {
        showNotification("error", "No File", "Please upload a file.");
        return;
      }

      setConfirmLoading(true);

      const file = fileList[0].originFileObj; // Get the actual file object

      // Create FormData to send file + other fields
      const formData = new FormData();
      formData.append("file", file); // Attach the file
      formData.append("patient_id", newAttachment.patient_id); // Attach patient ID

      // console.log("Uploading attachment:", formData);

      // Dispatch action with FormData instead of JSON
      dispatch(addAttachment(formData));

      setTimeout(() => {
        form.resetFields();
        setVisibleUpload(false);
        setConfirmLoading(false);
        setFileList([]); // Clear uploaded files
        dispatch(fetchAttachments());

        showNotification(
          "success",
          "Attachment Added",
          "Attachment has been added successfully."
        );
      }, 2000);
    });
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(() => {
        setConfirmLoading(true);
        dispatch(updatePatient(editPatient.patient_id, editPatient));

        setTimeout(() => {
          form.resetFields();

          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchPatients());
          showNotification(
            "success",
            "Patient Updated",
            "Patient's information has been updated successfully."
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
        dispatch(addPatient(newPatient));

        setTimeout(() => {
          form.resetFields();

          setVisible(false);
          setConfirmLoading(false);
          dispatch(fetchPatients());
          showNotification(
            "success",
            "Patient Added",
            "New Patient has been added successfully."
          );
        }, 2000);
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleDelete = (patient_id) => {
    dispatch(deletePatient(patient_id));
    setTimeout(() => {
      dispatch(fetchPatients());
      showNotification(
        "success",
        "Patient Deleted",
        "Patient has been deleted successfully."
      );
    }, 2000);
  };
  const handleDeleteAttachment = ({ id, patientId }) => {
    console.log("id", id, "patientId", patientId);
    dispatch(deleteAttachment(id));
    setTimeout(() => {
      dispatch(fetchPatientAttachments(patientId));
      showNotification(
        "success",
        "Attachment Deleted",
        "Attachment has been deleted successfully."
      );
    }, 2000);
  };

  const handleCancel = () => {
    form.resetFields();

    setVisible(false);
    setEditPatient(null);
    setNewPatient({
      patient_name: "",
      patient_age: "",
      patient_gender: "",
      patient_address: "",
      patient_phone: "",
      patient_email: "",
      doctor_id: "",
      disease_name: "",
    });
  };
  const handleCancelUpload = () => {
    form.resetFields();
    setVisibleUpload(false);
    setEditAttachment(null);
    setFileUploaded(false); // Reset file upload state when modal is closed

    setNewAttachment({
      patient_id: "",
      file_name: "",
      file_type: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editPatient) {
      setEditPatient({ ...editPatient, [name]: value });
    } else {
      setNewPatient({ ...newPatient, [name]: value });
    }
    if (editAttachment) {
      setEditAttachment({ ...editAttachment, [name]: value });
    } else {
      setNewAttachment({ ...newAttachment, [name]: value });
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;

      // Update the attachment data with file details and the patient ID
      setNewAttachment({
        ...newAttachment,
        patient_id: newAttachment.patient_id, // Retain the patient_id
        file_name: file.name,
        file_type: file.type,
      });

      // Log only the necessary details (patient ID + file data)
      console.log("File data to be uploaded:", {
        patient_id: newAttachment.patient_id,
        file_name: file.name,
        file_type: file.type,
      });
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
      <h2 className="table-header">Patients List</h2>

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
            exportFileName="patients_list.xlsx"
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
              <Option value="age">Age</Option>
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
            Add Patient
          </Button>
        </div>
      </div>

      <Modal
        title={editPatient ? "Edit Patient" : "Add Patient"}
        visible={visible}
        onOk={editPatient ? handleEditOk : handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="patient_name"
            rules={[
              { required: true, message: "Please input the doctor's name!" },
            ]}
          >
            <Input
              name="patient_name"
              value={
                editPatient ? editPatient.patient_name : newPatient.patient_name
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Age"
            name="patient_age"
            rules={[
              { required: true, message: "Please input the patient's age!" },
            ]}
          >
            <Input
              name="patient_age"
              type="number"
              value={
                editPatient ? editPatient.patient_age : newPatient.patient_age
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="patient_gender"
            rules={[
              { required: true, message: "Please input the patient's gender!" },
            ]}
          >
            <Select
              name="patient_gender"
              value={
                editPatient
                  ? editPatient.patient_gender
                  : newPatient.patient_gender
              }
              onChange={(value) =>
                editPatient
                  ? setEditPatient({ ...editPatient, patient_gender: value })
                  : setNewPatient({ ...newPatient, patient_gender: value })
              }
            >
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Address"
            name="patient_address"
            rules={[
              {
                required: true,
                message: "Please input the patient's address!",
              },
            ]}
          >
            <Input
              name="patient_address"
              value={
                editPatient
                  ? editPatient.patient_address
                  : newPatient.patient_address
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="patient_phone"
            rules={[
              {
                required: true,
                message: "Please input the patient's phone number!",
              },
            ]}
          >
            <Input
              name="patient_phone"
              value={
                editPatient
                  ? editPatient.patient_phone
                  : newPatient.patient_phone
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="patient_email"
            rules={[
              { required: true, message: "Please input the patient's email!" },
            ]}
          >
            <Input
              name="patient_email"
              type="email"
              value={
                editPatient
                  ? editPatient.patient_email
                  : newPatient.patient_email
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Disease Name"
            name="disease_name"
            rules={[
              {
                required: true,
                message: "Please input the Patient's disease_name!",
              },
            ]}
          >
            <Input
              name="disease_name"
              value={
                editPatient ? editPatient.disease_name : newPatient.disease_name
              }
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Doctor"
            name="doctor_id"
            rules={[
              { required: true, message: "Please input the doctor's name !" },
            ]}
          >
            <Select
              name="doctor_id"
              value={editPatient ? editPatient.doctor_id : newPatient.doctor_id}
              onChange={(value) =>
                editPatient
                  ? setEditPatient({ ...editPatient, doctor_id: value })
                  : setNewPatient({ ...newPatient, doctor_id: value })
              }
            >
              {doctors.doctors &&
                doctors.doctors.map((doc) => (
                  <Select.Option key={doc.id} value={doc.id}>
                    {doc.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={visibleUpload}
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            📤 Upload Attachment
          </span>
        }
        onCancel={handleCancelUpload}
        onOk={handleUploadOk}
        confirmLoading={confirmLoading}
        centered
        style={{
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Form form={form} layout="vertical">
          {fileUploaded && (
            <>
              <Form.Item
                label="📄 File Name"
                style={{ fontWeight: "500", marginBottom: "12px" }}
              >
                <Input value={newAttachment.file_name} readOnly />
              </Form.Item>

              <Form.Item
                label="📑 File Type"
                style={{ fontWeight: "500", marginBottom: "12px" }}
              >
                <Input value={newAttachment.file_type} readOnly />
              </Form.Item>
            </>
          )}

          <Form.Item label="📤 Upload File" style={{ fontWeight: "500" }}>
            <Upload
              fileList={fileList}
              beforeUpload={() => false} // Prevent auto-upload
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#f0f2f5",
                transition: "0.3s",
              }}
            >
              <Tooltip title="Click to select a file">
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{
                    width: "100%",
                    fontWeight: "bold",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Choose File
                </Button>
              </Tooltip>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <span style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}>
            📂 Attachments for {selectedPatient?.patient_name}
          </span>
        }
        visible={isAttachmentModalVisible}
        onCancel={handleAttachmentModalCancel}
        footer={null}
        centered
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
          List of attachments for {selectedPatient?.patient_name}:
        </p>

        {PatientAttachments && PatientAttachments.length > 0 ? (
          <ul style={{ padding: 0, margin: "10px 0" }}>
            {PatientAttachments.map((attachment, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f0f2f5",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e6f7ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f0f2f5")
                }
              >
                <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  📎 {attachment.file_name}
                </span>

                <div>
                  <Tooltip title="View">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        const fileUrl = `${
                          import.meta.env.VITE_BACKEND_URL
                        }/attachments/view-attachment/${attachment.file_name}`;
                        console.log("Opening File:", fileUrl);
                        window.open(fileUrl, "_blank");
                      }}
                      style={{ marginRight: "8px" }}
                    />
                  </Tooltip>

                  <Tooltip title="Delete">
                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        handleDeleteAttachment({
                          id: attachment.id,
                          patientId: selectedPatient?.patient_id,
                        })
                      }
                    />
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
              color: "#888",
              marginTop: "20px",
            }}
          >
            ❌ No attachments available.
          </p>
        )}
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        loading={loading}
        scroll={{ x: "max-content" }}
        className="centered-table"
      />
    </div>
  );
}
