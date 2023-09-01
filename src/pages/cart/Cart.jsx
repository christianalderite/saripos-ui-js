import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import {
    CaretLeftFilled,
    CaretRightFilled
} from '@ant-design/icons';
import { Table, Button, Space, Modal, Form, Input, Select, message, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getConfig } from "../../helpers/configHelper";

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.rootReducer);
    const [loading, setLoading] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);
    const [customerId, setCustomerId] = useState('');
    // const [filteredItems, setFilteredItems] = useState(cartItems);

    const handlerIncrement = (record) => {
        dispatch({
            type: "INCREASE_QTY",
            payload: { ...record, quantity: 1 }
        })
    }

    const handlerDecrement = (record) => {
        if (record.quantity !== 1) {
            dispatch({
                type: "DECREASE_QTY",
                payload: { ...record, quantity: 1 }
            })
        }
    }

    const handlerDelete = (record) => {
        dispatch({ type: "DELETE_FROM_CART", payload: record })
    }

    const getSubTotal = (cartItems) => {
        let subTotal = 0;
        cartItems.forEach((product) => (subTotal = subTotal + product.price * product.quantity));
        return subTotal;
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (image, record) => (
                <img src={"/images/products/" + image} alt={record.name} height={60} width={60} />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (price) => (
                <>{price.toFixed(2)}</>
            )
        },
        {
            title: "Quantity",
            dataIndex: "_id",
            render: (id, record) => (
                <div>
                    <CaretLeftFilled
                        className='cart-minus'
                        onClick={() => handlerDecrement(record)}
                    />
                    <strong className='cart-quantity'>
                        {record.quantity}
                    </strong>
                    <CaretRightFilled
                        className='cart-plus'
                        onClick={() => handlerIncrement(record)}
                    />
                </div>
            )
        },
        {
            title: "Action",
            dataIndex: "_id",
            render: (id, record) => (
                <Space>
                    <Button
                        className="danger-btn"
                        onClick={() => handlerDelete(record)}
                    >Remove</Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        setSubTotal(getSubTotal(cartItems));
    }, [cartItems]);

    const handlerSubmit = async (value) => {
        //console.log(value);
        try {
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                totalSales: Number((subTotal * (100 - getConfig("tax")) / 100).toFixed(2)),
                //tax: Number(((subTotal / 100) * 10).toFixed(2)),
                tax: Number((subTotal * getConfig("tax") / 100).toFixed(2)),
                totalAmount: Number(subTotal.toFixed(2)),
                //userId: JSON.parse(localStorage.getItem("auth"))._id
                userId: "ADMIN0001"
            }
            await axios.post("/api/orders/", newObject);
            message.success("Invoice has been generated! Cart has been cleared.");
            dispatch({ type: "RESET_CART" });
            navigate("/orders");
        } catch (error) {
            message.error("Error!")
            console.log(error);
        }
    }

    // const generateCustomerId = (event) => {
    //     console.log(customerId);
    //     setCustomerId(event.target.value);
    // }

    return (
        <AppLayout>
            <h2 style={{ float: "left" }}>Cart</h2>
            <h2 style={{ float: "right" }}>Sub Total: <span>{getConfig("active_currency") + " " + (subTotal).toFixed(2)}</span></h2>
            <div style={{ clear: "both" }}>
                <Button onClick={() => setBillPopUp(true)} className='add-new'>Create Invoice</Button>
            </div>
            <Table
                dataSource={cartItems}
                columns={columns}
                rowKey={record => record._id}
                loading={loading} />
            <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false)} footer={false}>
                <Form layout='vertical' onFinish={handlerSubmit}>
                    <Form.Item name="customerName" label="Customer Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerPhone" label="Customer Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerAddress" label="Customer Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="paymentMethod" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="paypal">Paypal</Select.Option>
                            <Select.Option value="Card">Card</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className="total">
                        <span>Total Sales: {getConfig("active_currency") + " " + (subTotal * (100 - getConfig("tax")) / 100).toFixed(2)}</span><br />
                        <span>Tax ({getConfig("tax")}%): {getConfig("active_currency") + " " + (subTotal * getConfig("tax") / 100).toFixed(2)}</span>
                        <h3>Total: {getConfig("active_currency") + " " + subTotal.toFixed(2)}</h3>
                    </div>
                    <div className="form-btn-add">
                        <Button htmlType='submit' className='add-new'>Generate Invoice</Button>
                    </div>
                </Form>
            </Modal>
        </AppLayout >
    )

};

export default Cart;
