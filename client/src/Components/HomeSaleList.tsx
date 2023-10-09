import { ShoppingCartOutlined } from "@ant-design/icons";
import { Divider, List, Skeleton } from "antd";
import axios from "axios";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import IProduct from "../Interfaces/Product";
import ISale from "../Interfaces/Sale";

interface IProps {
	salesData: ISale[];
	saleDataLength: number;
	loadMoreData: (customerId: number, init: boolean) => void;
	selectedCustomerId: number;
	setProductsData: React.Dispatch<React.SetStateAction<IProduct[]>>;
	setWichComponent: React.Dispatch<React.SetStateAction<string>>;
}

const HomeSaleList = (props : IProps) => {
	const getProductsOfSale = async (saleId: number) => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}sales/${saleId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                if (res.data.response[0] && res.data.response[0]?.line_items?.length) {
                    const products = res.data.response[0].line_items.map((product: any) => {
                        return {
                            productId: product.product_id,
                            quantity: product.quantity,
                            productPrice: product.product_price,
                            productCurrency: product.product_currency,
                            detailCommandeId: product.detail_commande_id,
                            name: product.product_model,
                            details: product.size_name,
                        };
                    });
                    props.setProductsData(products);
                }
                else {
                    props.setProductsData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div id="scrollableDiv" className="scrollList">
            <InfiniteScroll
                dataLength={props.salesData.length}
                next={() => props.loadMoreData(props.selectedCustomerId, false)}
                hasMore={props.salesData.length < props.saleDataLength}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>That's all folks!</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={props.salesData}
                    renderItem={(item) => (
                        <div className="scrollListItem">
                            <List.Item
                                key={item.saleId}
                                onClick={() => {
                                    getProductsOfSale(item.saleId);
                                    props.setWichComponent("products");
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <ShoppingCartOutlined className="icon" />
                                    }
                                    title={<p>Vente {item.saleId}</p>}
                                    description={
                                        <p>
                                            {item.total} {item.currency}
                                        </p>
                                    }
                                />
                            </List.Item>
                        </div>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
};

export default HomeSaleList;
