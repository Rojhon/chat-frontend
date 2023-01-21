import React from "react"
import { Card, Form, Input, Button, message, Col, Row, Tabs, Select, TimePicker, DatePicker, } from "antd";
import { userData } from "../../UserData"
import { useNavigate } from "react-router-dom"
import axios from "axios";

const SignIn = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                message.loading("Loading...")
                signInUser(values)
            })
            .catch((error) => {
                message.error("Please enter all required field ");
            });
    }

    const signInUser = async (values) => {
        try {
            const response = await axios.post("/api/users/sign-in-user", values)
            message.destroy()
            message.success(response.data.message)
            console.log("User Id ", response.data.user_id)
            userData.user_id = response.data.user_id
            navigate("/chat")
        } catch (error) {
            console.log(error)
            message.destroy()
            message.error(error.response.data)
        }
    }

    return (
        <>
            <Form form={form}>
                <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
                    <Input placeholder="email"/>
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true }]} >
                    <Input placeholder="password" type="password" />
                </Form.Item>
                <Button type="primary" onClick={() => onFinish()} htmlType="submit">
                    Sign In
                </Button>
            </Form>
        </>
    )
}

export default SignIn