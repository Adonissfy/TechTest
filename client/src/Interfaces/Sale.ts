interface ISale {
    saleId: number;
    createdAt: string;
    completedAt: string;
    customerId: number;
    currency: string;
    total: string;
}

export default ISale;