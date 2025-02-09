import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

export default function MainContent() {
  return (
    <Content className="content-wrapper">
      <h2>Dashboard</h2>
      <div className="dashboard-section">
        <div className="dashboard-card">
          <h3>Patient Total</h3>
        </div>
        <div className="dashboard-card">
          <h3>Patients In</h3>
        </div>
      </div>
    </Content>
  );
}
