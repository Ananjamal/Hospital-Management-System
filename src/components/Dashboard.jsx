import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom"; // Import Outlet for rendering child routes
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

import "../assets/css/dashboard.css";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="layout-wrapper">
      <AppSidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content className="layout-content">
          <Outlet /> 
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
