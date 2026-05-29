export const getSettings = () => {

    const saved =
        localStorage.getItem(
            "smartstock-settings"
        );

    if (saved) {

        return JSON.parse(saved);
    }

    return {

        profile: {
            name: "Ankit Dabad",
            email: "ankitdabad01@google.com",
            company: "SmartStock AI",
            role: "Administrator",
        },

        inventorySettings: {
            lowStockThreshold: 20,
            warehouseCapacity: 3000,
            autoStockAlerts: true,
        },

        orderSettings: {
            taxPercentage: 18,
            shippingCharge: 50,
        },

        notifications: {
            emailAlerts: true,
            lowStockAlerts: true,
            revenueReports: true,
            newOrders: true,
        },
    };
};