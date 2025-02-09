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
  
  Typography, Row, Col, Upload, Spin
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttachments,
  updateAttachment,
  addAttachment,
  deleteAttachment,
} from "../../redux/user/Actions";

import ExcelHandler from "../ExcelHandler";
import debounce from "lodash-es/debounce";
import { selectAttachments, selectUsers } from "../../redux/user/Selector";

export default function Departments() {
  const { Paragraph } = Typography;

  const dispatch = useDispatch();
  const { loading, searchResults, error } = useSelector((state) => state);
  const users = useSelector(selectUsers);
  const attachments = useSelector(selectAttachments);

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [fileUploaded, setFileUploaded] = useState(false);

  const [newAttachment, setNewAttachment] = useState({
    file_name: "",
    file_path: "",
    file_type: "",
  });
  const [editAttachment, setEditAttachment] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchAttachments());
  }, []);

  useEffect(() => {
    console.log({"attachments":attachments});
    setData(attachments);
  }, [attachments]);

  useEffect(() => {
    if (editAttachment) {
      form.setFieldsValue(editAttachment);
    }
  }, [editAttachment, form]);

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
        title: "Patient ID",
        dataIndex: "patient_id",
        sorter: (a, b) => a.patient_id - b.patient_id,
        width: "10%",
      },
    {
      title: "File Name",
      dataIndex: "file_name",
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
      sortDirections: ["ascend", "descend"],
      width: "40%",
    },
    {
      title: "File Path",
      dataIndex: "file_path",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
      width: "40%",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            type="primary"
            onClick={() => showEditModal(record)}
            style={{ marginRight: "12px" }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this attachment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<DeleteOutlined style={{ color: "red" }} />}
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
      width: "10%",
    },
  ];

  const showEditModal = (record) => {
    setEditAttachment(record);
    setVisible(true);
  };

  const handleEditOk = () => {
    form.validateFields().then(() => {
      setConfirmLoading(true);
      dispatch(updateAttachment(editAttachment.id, editAttachment));

      setTimeout(() => {
        form.resetFields();
        setVisible(false);
        setConfirmLoading(false);
        dispatch(fetchAttachments());
        showNotification(
          "success",
          "Attachment Updated",
          "Attachment has been updated successfully."
        );
      }, 2000);
    });
  };

  const handleAddOk = () => {
    form.validateFields().then(() => {
      setConfirmLoading(true);
// console.log("newAttachment",newAttachment);
      dispatch(addAttachment(newAttachment));

      setTimeout(() => {
        form.resetFields();
        setVisible(false);
        setConfirmLoading(false);
        dispatch(fetchAttachments());
        showNotification(
          "success",
          "Attachment Added",
          "New attachment has been added successfully."
        );
      }, 2000);
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteAttachment(id));
    setTimeout(() => {
      dispatch(fetchAttachments());
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
    setEditAttachment(null);
    setFileUploaded(false); // Reset file upload state when modal is closed

    setNewAttachment({ file_name: "", file_path: "", file_type: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editAttachment) {
      setEditAttachment({ ...editAttachment, [name]: value });
    } else {
      setNewAttachment({ ...newAttachment, [name]: value });
    }
  };
  
  const handleFileChange = (info) => {
    const file = info.fileList[0]; // Get the first file
    if (file) {
      setNewAttachment({
        file_name: file.name,
        file_type: file.type,
        file_path: URL.createObjectURL(file.originFileObj),
      });
      setFileUploaded(true); // Mark as file uploaded
    } else {
      setFileUploaded(false); // Reset if no file uploaded
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
      <h2 className="table-header">Attachemts List</h2>

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
            exportFileName="attachmets_list.xlsx"
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
            Add Attachmet
          </Button>
        </div>
      </div>

      <Modal
        visible={visible}
        title={editAttachment ? 'Edit Attachment' : 'Add Attachment'}
        onCancel={handleCancel}
        onOk={handleAddOk}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical">
          {/* Only show these fields if a file has been uploaded */}
          {fileUploaded && (
            <>
              <Form.Item label="File Name">
                <Input value={newAttachment.file_name} readOnly />
              </Form.Item>
              <Form.Item label="File Type">
                <Input value={newAttachment.file_type} readOnly />
              </Form.Item>
            </>
          )}

          <Form.Item label="Upload File">
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button>Click to Upload</Button>
            </Upload>
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
