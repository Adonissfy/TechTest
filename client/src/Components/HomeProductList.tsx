import { CoffeeOutlined } from "@ant-design/icons";
import { List } from "antd";
import React from "react";
import IProduct from "../Interfaces/Product";

interface IProps {
    productsData: IProduct[];
}

const HomeProductList = (props : IProps) => {
    return (
        <div className="scrollList">
            <List
                dataSource={props.productsData}
                renderItem={(item) => (
                    <div className="scrollListItem">
                        <List.Item key={item.productId}>
                            <List.Item.Meta
                                avatar={<CoffeeOutlined className="icon" />}
                                title={
                                    <p>
                                        {item.quantity} x {item.name}
                                        {item.details ? (
                                            <span> ({item.details})</span>
                                        ) : null}
                                    </p>
                                }
                                description={
                                    <p>
                                        {item.productPrice}{" "}
                                        {item.productCurrency}
                                    </p>
                                }
                            />
                        </List.Item>
                    </div>
                )}
            />
        </div>
    );
};

export default HomeProductList;