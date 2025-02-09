// components/FileViewer.jsx
import { useState } from "react";
import { Button, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const FileViewer = ({ fileName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileUrl = `${import.meta.env.VITE_BACKEND_URL}/attachments/view-attachment/${fileName}`;

  return (
    <>
      {/* View Button */}
      <Button
        type="primary"
        icon={<EyeOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{ marginRight: "10px" }}
      >
      </Button>

      {/* Modal to View File */}
      <Modal
        title="عرض الملف"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800} // Adjust as needed
      >
        <iframe
          src={fileUrl}
          width="100%"
          height="500px"
          style={{ border: "none" }}
        ></iframe>
      </Modal>
    </>
  );
};

export default FileViewer;
