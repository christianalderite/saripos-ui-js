import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  InsertRowAboveOutlined,

} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import './layout.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import { getConfig } from '../helpers/configHelper';


const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {

  const { cartItems, loading, totalQuantity } = useSelector(state => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["/"]);
  const navigate = useNavigate();
  const location = useLocation();

  // const dispatch = useDispatch();

  const toggle = () => {
    setCollapsed(!collapsed);
  }

  useEffect(() => {
    console.log("echo");
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalQuantity', totalQuantity);
  }, [cartItems, totalQuantity]);


  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="logo-title">{getConfig("shop_brand")}</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={['settings']}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Shop</Link>
          </Menu.Item>
          <Menu.Item key="/orders" icon={<MoneyCollectOutlined />}>
            <Link to="/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="/products" icon={<HomeOutlined />}>
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserSwitchOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.SubMenu key="settings" title="Settings" mode="inline">
            <Menu.Item key="/categories" icon={<InsertRowAboveOutlined />}>
              <Link to="/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>
            <Menu.Item key="/shop" icon={<SettingOutlined />}>
              <Link to="/shop">Shop</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="" icon={<LogoutOutlined />}>
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
          <div className="cart-items" onClick={() => navigate('/cart')}>
            <ShoppingCartOutlined />
            <span className="cart-badge">{totalQuantity}</span>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;