import React from "react";
import { List } from "antd";
import ICustomer from "../Interfaces/Customer";
import { UserOutlined } from "@ant-design/icons";

interface IProps {
	customersData: ICustomer[];
	loadMoreData: (customerId: number, init: boolean) => void;
	setSelectedCustomerId: React.Dispatch<React.SetStateAction<number>>;
	setWichComponent: React.Dispatch<React.SetStateAction<string>>;
}

const HomeCustomerList = (props : IProps) => {
	return (
		<div className="scrollList">
		<List
			dataSource={props.customersData}
			renderItem={(item) => (
				<div className="scrollListItem">
					<List.Item
						key={item.customerId}
						onClick={() => {
							props.loadMoreData(item.customerId, true);
							props.setSelectedCustomerId(
								item.customerId
							);
							props.setWichComponent("sales");
						}}
					>
						<List.Item.Meta
							avatar={
								<UserOutlined className="icon" />
							}
							title={
								<p>
									{item.lastName}{" "}
									{item.firstName}
								</p>
							}
							description={<p>{item.email}</p>}
						/>
					</List.Item>
					<span className="line"></span>
				</div>
			)}
		/>
	</div>
	);
}

export default HomeCustomerList;