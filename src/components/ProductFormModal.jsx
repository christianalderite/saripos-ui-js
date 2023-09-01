import React from "react";
import { Button, Card } from "antd";

const ProductFormModal = ({ product }) => {


    const handlerSubmitForm = () => {

    };

    return (
        <Card
            hoverable
            style={{ width: 240, marginBottom: 30 }}
            cover={
                <img alt={product.name} src={"images" + product.image} style={{ height: 200 }} />
            }>
            <Card.Meta title={product.name} description={`$${product.price}`} />
            <div className="product-btn">
                <Button onClick={() => handlerSubmitForm()}>Add To Cart</Button>
            </div>
        </Card>
    );
};

export default ProductFormModal;
