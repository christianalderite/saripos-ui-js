import { Button, Modal, Row, Table, Col, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { getConfig } from '../../helpers/configHelper';
import { render } from 'react-dom';

const Orders = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchFilter, setSearchFilter] = useState({});
  const { Search } = Input;

  const getAllBills = async (filter) => {
    try {
      dispatch({
        type: 'SHOW_LOADING',
      });
      let query = '/api/orders/';
      if (filter.key && filter.value) {
        query = '/api/orders/' + filter.key + '/' + filter.value;
      }
      const { data } = await axios.get(query);
      setBillsData(data);
      dispatch({
        type: 'HIDE_LOADING',
      });
      console.log(data);
    } catch (error) {
      dispatch({
        type: 'HIDE_LOADING',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(searchFilter);
    getAllBills(searchFilter);
  }, [searchFilter]);

  const dateParser = (datestring) => {
    let d = new Date(datestring.toString());
    return (
      d.toLocaleString('en-US', { timeZone: getConfig('timezone').logical }) +
      ' ' +
      getConfig('timezone').display
    );
  };

  const columns = [
    {
      title: 'Receipt No.',
      dataIndex: 'orderId',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      sorter: (prev, current) => prev.customerName.localeCompare(current.customerName),
    },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhone',
    },
    {
      title: 'Purchase Time',
      dataIndex: 'createdAt',
      render: (id, record) => {
        return <>{dateParser(record.createdAt)}</>;
      },
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      render: (id, record) => {
        return <>{record.totalSales.toFixed(2)}</>;
      },
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      render: (id, record) => {
        return <>{record.tax.toFixed(2)}</>;
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      sorter: (prev, current) => prev.totalAmount - current.totalAmount,
      render: (id, record) => {
        return <>{record.totalAmount.toFixed(2)}</>;
      },
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EyeOutlined
            className="cart-edit eye"
            onClick={() => {
              setSelectedBill(record);
              setPopModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Layout>
      <h2>All Invoice </h2>
      <Search
        className="search-box"
        placeholder="receipt number"
        //onSearch={(value) => handlerSearch(value)}
        onChange={(e) => {
          setSearchFilter({ key: 'orderId', value: e.target.value });
        }}
      />

      <Table dataSource={billsData} columns={columns} bordered />

      {popModal && (
        <Modal
          title="Invoice Details"
          width={440}
          pagination={false}
          visible={popModal}
          onCancel={() => setPopModal(false)}
          footer={false}
        >
          <div className="card" ref={componentRef}>
            <div className="cardHeader">
              <h2 className="logo">{getConfig('shop_brand')}</h2>
              <span>
                Number: <b>{getConfig('shop_phone')}</b>
              </span>
              <span>
                Address: <b>{getConfig('shop_address')}</b>
              </span>
            </div>
            <div className="cardBody">
              <div className="group">
                <span>Receipt Number:</span>
                <span>
                  <b>{selectedBill.orderId}</b>
                </span>
              </div>
              <div className="group">
                <span>Customer Name:</span>
                <span>
                  <b>{selectedBill.customerName}</b>
                </span>
              </div>
              <div className="group">
                <span>Customer Phone:</span>
                <span>
                  <b>{selectedBill.customerPhone}</b>
                </span>
              </div>
              <div className="group">
                <span>Customer Address:</span>
                <span>
                  <b>{selectedBill.customerAddress}</b>
                </span>
              </div>
              <div className="group">
                <span>Date:</span>
                <span>
                  <b>{dateParser(selectedBill.createdAt)}</b>
                </span>
              </div>
              <div className="group">
                <span>Total Sales:</span>
                <span>
                  <b>
                    {getConfig('active_currency')} {selectedBill.totalSales.toFixed(2)}
                  </b>
                </span>
              </div>
              <div className="group">
                <span>Tax:</span>
                <span>
                  <b>
                    {getConfig('active_currency')} {selectedBill.tax.toFixed(2)}
                  </b>
                </span>
              </div>
              <div className="group">
                <span>Total Amount:</span>
                <span>
                  <b>
                    {getConfig('active_currency')} {selectedBill.totalAmount.toFixed(2)}
                  </b>
                </span>
              </div>
            </div>
            <div className="cardFooter">
              <h4>Your Order</h4>
              {selectedBill.cartItems.map((product) => (
                <>
                  <div className="footerCard">
                    <Row>
                      <Col xs={16} s={18}>
                        <span>{product.name}</span>
                      </Col>
                      <Col xs={2} s={2}>
                        <span>{product.quantity}</span>
                      </Col>
                      <Col xs={6} s={4}>
                        <span>
                          {getConfig('active_currency')} {product.price.toFixed(2)}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </>
              ))}
              <div className="footerCardTotal">
                <div className="group">
                  <h3>Total:</h3>
                  <h3>
                    <b>
                      {getConfig('active_currency')}
                      {selectedBill.totalAmount.toFixed(2)}
                    </b>
                  </h3>
                </div>
              </div>
              <div className="footerThanks">
                <span>Thank you for shopping with us!</span>
              </div>
            </div>
          </div>
          <div className="bills-btn-add">
            <Button onClick={handlePrint} htmlType="submit" className="add-new">
              Print Invoice
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Orders;
