import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('https://video-uploader-api.onrender.com/api/accounts/register', {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        number: values.number
      });

      if (response.data.code === 200) {
        message.success(response.data.message);
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        message.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Register</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="firstname"
          label="First Name"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Last Name"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="number"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate('/login')}
            style={{ marginTop: 10 }}
          >
            Already have an account? Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
