import React, { useState } from "react";
import axios from "axios";
import "./Home.scss";
import ISale from "../../Interfaces/Sale";
import ICustomer from "../../Interfaces/Customer";
import IProduct from "../../Interfaces/Product";
import HomeBreadCrumbAndInput from "../../Components/HomeBreadCrumbAndInput";
import HomeCustomerList from "../../Components/HomeCustomerList";
import HomeSaleList from "../../Components/HomeSaleList";
import HomeProductList from "../../Components/HomeProductList";

const Home = () => {
    const [loadingSales, setLoadingSales] = useState<boolean>(false);
    const [salesData, setSalesData] = useState<ISale[]>([]);
    const [saleDataLength, setSaleDataLength] = useState<number>(0);
    const [salesDataPage, setSalesDataPage] = useState<number>(1);
    const [customersData, setCustomersData] = useState<ICustomer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
    const [productsData, setProductsData] = useState<IProduct[]>([]);
    const [wichComponent, setWichComponent] = useState<string>("customers");

    const loadMoreData = async (customerId: number, init: boolean) => {
        if (loadingSales) {
            return;
        }
        setLoadingSales(true);
        await axios
            .get(
                `${process.env.REACT_APP_API_URL}customer/${customerId}/sales/?page=${
                    init ? 1 : salesDataPage
                }`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                const sales = res.data.response.map((sale: any) => {
                    return {
                        saleId: sale.sale_id,
                        createdAt: sale.created_at,
                        completedAt: sale.completed_at,
                        customerId: sale.customer_id,
                        currency: sale.currency,
                        total: sale.total,
                    };
                });
                setSaleDataLength(res.data.length);
                if (init) {
                    setSalesData(sales);
                    setSalesDataPage(2);
                } else {
                    setSalesData([...salesData, ...sales]);
                    setSalesDataPage(salesDataPage + 1);
                }
                setLoadingSales(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingSales(false);
            });
    };

    return (
        <div className="Home">
            <div className="inputAndList">
                <HomeBreadCrumbAndInput wichComponent={wichComponent} setWichComponent={setWichComponent} setCustomersData={setCustomersData} setSalesData={setSalesData} setSalesDataPage={setSalesDataPage} setSaleDataLength={setSaleDataLength} setProductsData={setProductsData} />
                {wichComponent === "customers" ? (
                    <HomeCustomerList customersData={customersData} loadMoreData={loadMoreData} setSelectedCustomerId={setSelectedCustomerId} setWichComponent={setWichComponent} />
                ) : wichComponent === "sales" ? (
                    <HomeSaleList salesData={salesData} saleDataLength={saleDataLength} loadMoreData={loadMoreData} selectedCustomerId={selectedCustomerId} setProductsData={setProductsData} setWichComponent={setWichComponent} />
                ) : wichComponent === "products" ? (
                    <HomeProductList productsData={productsData} />
                ) : null}
            </div>
        </div>
    );
};

export default Home;
