import React, { useState } from "react";
import { Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getConfig } from "../helpers/configHelper";

const Product = ({ product }) => {

    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.rootReducer);
    const [buttonText, setButtonText] = useState('Add To Cart');

    const handlerToCart = () => {
        dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
        setButtonText('Add More');
    };

    return (
        <Card
            className="product-card"
            hoverable
            style={{ width: 240, marginBottom: 30 }}
            cover={
                <img alt={product.name} src={"/images/products/" + product.image} style={{ height: 200 }} />
            }>
            <Card.Meta title={product.name} description={getConfig("active_currency") + ` ${product.price.toFixed(2)}`} />
            <div className="product-btn">
                <Button onClick={() => handlerToCart()}>{buttonText}</Button>
            </div>
            <p style={{ textAlign: "center" }}><small>{cartItems.find(item => item._id === product._id) !== undefined ? cartItems.find(item => item._id === product._id).quantity + " added to cart" : ""} </small></p>
        </Card>
    );
};

export default Product;
