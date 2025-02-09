import React from "react";
import { Button, Badge, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../redux/user/Actions";

export default function AppHeader({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutRequest({ navigate }));
  };

  return (
    <div className="header-wrapper">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div className="header-actions">
        <Badge count={5}>
          <BellOutlined style={{ fontSize: "20px" }} />
        </Badge>
        <Avatar size="large" style={{ backgroundColor: "#87d068" }}>
          A
        </Avatar>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginLeft: "16px" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
