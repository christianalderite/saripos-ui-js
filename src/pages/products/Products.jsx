import React, { useState, useEffect } from "react";
import AppLayout from "../../components/Layout";
import axios from "axios";
import {
  Table, Space, Tag, Button, Switch, Input, Modal, Form,
  Select, InputNumber, Upload, message
} from "antd";
import { DeleteFilled, EyeFilled, EditFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import configs from '../../utils/configs.json';
import { getConfig, parseConfigs, returnConfig } from "../../helpers/configHelper";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editProduct, setEditProduct] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Search } = Input;
  const { confirm } = Modal;

  const getAllProducts = async (key, value) => {
    setLoading(true);
    let result;
    if (key && value) {
      result = await axios.get("/api/products/" + key + "/" + value);
    } else {
      result = await axios.get("/api/products");
    }
    setProducts(result.data);
    setLoading(false);
  };

  useEffect(() => {
    setCategories(parseConfigs("categories"));
    setStatuses(parseConfigs("statuses"));
  }, []);

  useEffect(() => {
    getAllProducts('name', searchFilter).catch(console.error);
  }, [searchFilter]);

  useEffect(() => {
    form.setFieldsValue(editProduct);
  }, [form, editProduct]);

  // const handlerSearch = async (value) => {
  //   getAllProducts('name', value);
  // };

  const handlerBeforeUpload = (file) => {
    const acceptedFileTypes = [
      'image/png',
      'image/jpeg'
    ]
    const pass = acceptedFileTypes.includes(file.type);
    if (!pass) {
      message.error(`${file.name} is not a png or jpeg file`);
      return Upload.LIST_IGNORE;
    }
    return false; // return false to prevent auto upload
  }

  const handlerFormSubmit = async (value) => {
    console.log(editProduct);
    try {
      if (!editProduct) {
        await axios.post('/api/products', value);
      } else {
        await axios.put('/api/products/' + editProduct._id, value);
      }
      message.success(value.name + " details saved successfully!")
      getAllProducts('name', searchFilter);
      setPopModal(false);
    } catch {
      message.error(value.name + " already exists.");
    }
  }

  const handlerDelete = async (record) => {
    try {
      await axios.delete('/api/products/' + record._id);
      message.success(record.name + " deleted successfully.")
      getAllProducts();
      setPopModal(false);
    } catch {
      message.error(record.name + " deletion failed.");
    }
  }

  const confirmDelete = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you sure you want to proceed with deleting <strong>{record.name}</strong> ({record.category})? You cannot recover it once done.</p>,
      onOk() { handlerDelete(record) },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleToggle = async (record) => {
    try {
      let status = "inactive";
      let d_status = 'disabled';
      if (record.status === 'inactive') {
        status = 'active';
        d_status = 'enabled';
      };
      await axios.put('/api/products/' + record._id, { status: status });
      message.success(record.name + " has been " + d_status + " in the shop.");
      getAllProducts('name', searchFilter);
      setPopModal(false);
    } catch {
      message.error(record.name + " status update failed.");
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (prev, current) => prev.name.localeCompare(current.name)
    },
    {
      title: "Category",
      dataIndex: "category",
      filterSearch: true,
      filters: categories,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      render: (category) => {
        return (
          <>{getConfig("categories")[category]}</>
        )
      }
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (prev, current) => prev.price - current.price,
      render: (price) => (
        <>{price.toFixed(2)}</>
      )
    },
    {
      title: "Enabled",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <><Switch checked={status !== "inactive"} onClick={() => handleToggle(record)} /></>
      ),
      filters: statuses.map((item) => {
        return {
          text: item.text.toUpperCase(),
          value: item.value,
        };
      }),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => {
        return (
          <Space size="middle">
            <Button className="primary-btn" shape="circle"><EyeFilled /></Button>
            <Button className="secondary-btn" shape="circle" onClick={() => { setEditProduct(record); setPopModal(true); }}><EditFilled /></Button>
            <Button className="danger-btn" shape="circle" onClick={() => { confirmDelete(record); }}><DeleteFilled /></Button>
          </Space >
        );
      },
    },
  ];

  return (
    <AppLayout>
      <h2>Products</h2>

      <Search
        className="search-box"
        placeholder="product name"
        //onSearch={(value) => handlerSearch(value)}
        onChange={(e) => { setSearchFilter(e.target.value) }} />

      <Button
        className="add-new"
        onClick={() => { setEditProduct(false); form.resetFields(); setPopModal(true); console.log(editProduct) }}>
        Add New</Button>

      <Table
        dataSource={products}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading} />

      <Modal
        title={`${editProduct !== false ? "Edit Product" : "Add New Product"}`}
        open={popModal}
        onCancel={() => {
          setPopModal(false);
        }}
        footer={false}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={handlerFormSubmit}
          layout="horizontal">
          <Form.Item name="name" label="Name">
            <Input placeholder="product name" required />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select
              options={categories} />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber min={0.01} step={0.01} required />
          </Form.Item>
          {/* <Form.Item name="image_file" label="Image">
            <Upload
              maxCount={1}
              listType="picture"
              beforeUpload={(file) => handlerBeforeUpload(file)}
              onChange={handlerGetFile}>
              <Button icon={<UploadOutlined />}>
                Upload PNG or JPEG
              </Button>
            </Upload>
          </Form.Item> */}
          <Button className="primary-btn" htmlType="submit">Save</Button>
        </Form>
      </Modal>
    </AppLayout >
  );
};

export default Products;
