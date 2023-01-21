import React, { useState } from "react"
import { Form, Input, Button, message, Table } from "antd"
import { Editor } from "react-draft-wysiwyg";
import { userData } from "../../UserData";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

const columns = [
    {
        title: 'Contacts',
        dataIndex: 'full_name',
    }
]

const ComponseMessage = ({ users, setOnSuccessMessage, socket }) => {
    const [form] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    // Editor

    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                message.loading("Loading...")
                values.user_id = userData.user_id
                values.participants = selectedRowKeys
                values.participants.push(userData.user_id)

                if (values.participants.length != 0) {
                    startConversation(values)
                } else {
                    message.error("Add Contacts")
                }
            })
            .catch((error) => {
            })
    }

    const startConversation = async (values) => {
        try {
            const response = await axios.post("/api/chats/start-conversation", values)
            message.destroy()
            message.success(response.data)
            socket.emit("socket:start-conversation", values)
            setOnSuccessMessage(true)
        } catch (error) {
            console.log(error)
            message.destroy()
            message.success(error.response.data)
        }
    }

    return (
        <>
            <Table rowSelection={rowSelection} columns={columns} dataSource={users} rowKey="_id" />
            <Form form={form}>
                <Form.Item name="content" rules={[{ required: true }]}>
                    <Input placeholder="Message" />
                    {/* <Editor
                        style={{ padding: "10rem" }}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                    /> */}
                </Form.Item>
            </Form>
            <Button type="primary" onClick={() => onFinish()} htmlType="submit">
                Send
            </Button>
        </>
    );
}

export default ComponseMessage
