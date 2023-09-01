import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout';
import axios from 'axios';
import { Row, Col } from 'antd';
import Product from '../../components/Product';
import { useDispatch } from 'react-redux';
import { parseConfigs } from '../../helpers/configHelper';

const Home = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const categories = parseConfigs('categories');

  useEffect(() => {
    const getAllProducts = async () => {
      dispatch({ type: 'SHOW_LOADING' });
      const { data } = await axios.get('/api/products/status/active');
      setProducts(data);
      setSelectedCategory('snacks');
      dispatch({ type: 'HIDE_LOADING' });
    };
    getAllProducts();
  }, [dispatch]);

  const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  return (
    <AppLayout>
      <div className="category">
        <Row>
          {categories.map((category) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} xxl={2}>
              <div
                key={category.value}
                className={`categoryFlex ${
                  selectedCategory === category.value && 'category-active'
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <h3>{category.label}</h3>
                <img
                  src={'/images/categories/default_category.png'}
                  alt={category.label}
                  height={60}
                  width={60}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <Row>
        {products
          .filter((i) => i.category === selectedCategory)
          .map((product) => {
            return (
              <>
                <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                  <Product key={product.id} product={product} />
                </Col>
              </>
            );
          })}
      </Row>
    </AppLayout>
  );
};

export default Home;
