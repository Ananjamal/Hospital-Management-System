import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-dark.png";
import {
  AppstoreOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  CalendarOutlined,
  BankOutlined,
  TeamOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux"; // Make sure to import useSelector
import { selectUserInfo } from "../redux/user/Selector";

const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <AppstoreOutlined />,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "doctor", "receptionist", "user"], // Specify roles that can access this item
  },
  {
    key: "2",
    icon: <MedicineBoxOutlined />,
    label: "Doctors",
    path: "/dashboard/doctors",
    roles: ["admin", "user"],
  },
  {
    key: "3",
    icon: <UserOutlined />,
    label: "Patients",
    path: "/dashboard/patients",
    roles: ["admin", "doctor"],
  },
  {
    key: "4",
    icon: <BankOutlined />,
    label: "Departments",
    path: "/dashboard/departments",
    roles: ["admin"],
  },
  {
    key: "5",
    icon: <CalendarOutlined />,
    label: "Appointments",
    path: "/dashboard/appointments",
    roles: ["admin", "receptionist"],
  },
  {
    key: "6",
    icon: <TeamOutlined />,
    label: "Employees",
    path: "/dashboard/employees",
    roles: ["admin", "hr", "user"],
  },
  {
    key: "7",
    icon: <TeamOutlined />,
    label: "Users",
    path: "/dashboard/users",
    roles: ["admin", "user"],
  },

  {
    key: "8",
    icon: <PaperClipOutlined  />,
    label: "Attachments",
    path: "/dashboard/attachments",
    roles: ["admin", "user"],
  },
];

export default function AppSidebar({ collapsed }) {
  // Get the user role from Redux state
  const auth = useSelector(selectUserInfo);

  const userRole = auth?.user.role ?? "user"; // Assuming the role is inside the auth object

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="sider-logo">
        <img src={logo} alt="Preclinic Logo" />
        {!collapsed && <span className="sider-logo-text">Preclinic</span>}
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {filteredMenuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path || "#"}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}
