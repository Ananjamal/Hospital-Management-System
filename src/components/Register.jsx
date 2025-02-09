import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Input, Row, Col, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/images/logo-dark.png";
import "../assets/css/style.css";
import { registerRequest } from "../redux/user/Actions";

const { Title, Text } = Typography;

export default function Register() {
  const navigate = useNavigate(); // React Router v6 navigation
  const dispatch = useDispatch();
  const { loading, auth, error } = useSelector((state) => state);

  const handleSubmit = (values) => {
    dispatch(registerRequest(values,navigate)); // Dispatch login action
  };
  // Redirect to dashboard when login state changes
  // useEffect(() => {
  //   if (register) {
  //     navigate("/dashboard"); // Redirect to the dashboard page
  //   }
  // }, [register, navigate]); // Dependency array includes 'login' and 'navigate'

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
          maxWidth: "500px",
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
              Create Your Account
            </Title>
            <Text type="secondary">
              Fill in the details to register a new account.
            </Text>
          </div>

          <Form
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            style={{ marginTop: "20px" }}
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your full name!" },
              ]}
            >
              <Input placeholder="Enter your name" size="large" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input placeholder="Enter your phone number" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>


            {/* <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item> */}
            {error && (
              <Text
                type="danger"
                style={{ display: "block", marginBottom: "10px" }}
              >
                {error}
              </Text>
            )}

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
                Register
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Text>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#764ba2" }}>
                Log In
              </Link>
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
}
