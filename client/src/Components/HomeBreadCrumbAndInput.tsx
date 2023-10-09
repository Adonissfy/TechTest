import React, { useState } from "react";
import { Input, Breadcrumb } from "antd";
import axios from "axios";
import IProduct from "../Interfaces/Product";
import ISale from "../Interfaces/Sale";
import ICustomer from "../Interfaces/Customer";

interface IProps {
	wichComponent: string;
	setWichComponent: React.Dispatch<React.SetStateAction<string>>;
	setCustomersData: React.Dispatch<React.SetStateAction<ICustomer[]>>;
	setSalesData: React.Dispatch<React.SetStateAction<ISale[]>>;
	setSalesDataPage: React.Dispatch<React.SetStateAction<number>>;
	setSaleDataLength: React.Dispatch<React.SetStateAction<number>>;
	setProductsData: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

const HomeBreadCrumbAndInput = (props : IProps) => {
	const [searchValue, setSearchValue] = useState<string>("");

	const searchCustomers = async (searchTerm: string) => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}customers/search/` + searchTerm, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                const customers = res.data.response.map((customer: any) => {
                    return {
                        customerId: customer.customers_id,
                        lastName: customer.last_name,
                        firstName: customer.first_name,
                        email: customer.email,
                        phone: customer.phone,
                        lastOrderDate: customer.last_order_date,
                    };
                });
                props.setCustomersData(customers);
            })
            .catch((err) => {
                console.log(err);
            });
    };

	return (
		<>
		{props.wichComponent === "customers" ? (
			<Input
				placeholder="last name or email"
				allowClear={true}
				className="searchInput"
				value={searchValue}
				onChange={(e) => {
					setSearchValue(e.target.value);
					if (e.target.value.length > 2) {
						searchCustomers(e.target.value);
					} else props.setCustomersData([]);
				}}
			/>
		) : props.wichComponent === "sales" ? (
			<div className="breadCrumb">
				<Breadcrumb
					items={[
						{
							title: "Customers",
							onClick: () => {
								props.setWichComponent("customers");
								props.setSalesData([]);
								props.setSalesDataPage(1);
								props.setSaleDataLength(0);
							},
						},
						{
							title: "Sales",
						},
					]}
				/>
			</div>
		) : props.wichComponent === "products" ? (
			<div className="breadCrumb">
				<Breadcrumb
					items={[
						{
							title: "Customers",
							onClick: () => {
								props.setWichComponent("customers");
								props.setSalesData([]);
								props.setSalesDataPage(1);
								props.setSaleDataLength(0);
								props.setProductsData([]);
							},
						},
						{
							title: "Sales",
							onClick: () => {
								props.setWichComponent("sales");
								props.setProductsData([]);
							},
						},
						{
							title: "Products",
						},
					]}
				/>
			</div>
		) : null}
		</>
	);
}

export default HomeBreadCrumbAndInput;