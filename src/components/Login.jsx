import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Input, Row, Col, Typography } from "antd";
import { Link, useNavigate  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/images/logo-dark.png";
import "../assets/css/style.css";
import { loginRequest } from "../redux/user/Actions";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate(); 

  const dispatch = useDispatch();
   const { loading,auth, error } = useSelector(
      (state) => state
    );

  const handleSubmit = (credentials) => {
    dispatch(loginRequest(credentials,navigate)); // Dispatch login action
  };
 
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "20px",
      }}
    >
      <Row
        justify="center"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          padding: "30px",
        }}
      >
        <Col span={24}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ maxHeight: "60px", width: "auto", marginBottom: "10px" }}
            />
            <Title level={3} style={{ margin: 0, color: "#333" }}>
              Welcome Back!
            </Title>
            <Text type="secondary">Please log in to access your account.</Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            style={{ marginTop: "20px" }}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
              ]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            {error && (
              <Text type="danger" style={{ display: "block", marginBottom: "10px" }}>
                {error} 
              </Text>
            )}

            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <Link to="/forgot-password" style={{ color: "#667eea" }}>
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  borderColor: "transparent",
                }}
                loading={loading} // Show loading state
              >
                Log In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Text>
              Don’t have an account?{" "}
              <Link to="/register" style={{ color: "#764ba2" }}>
                Register Now
              </Link>
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
}
