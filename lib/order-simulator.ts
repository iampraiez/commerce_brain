/**
 * Order Status Simulator
 * Simulates automatic status updates for demo purposes
 * In production, this would be handled by webhooks and scheduled tasks
 */

export async function simulateOrderDelivery(orderId: string) {
  // Wait 30 seconds then update status to delivered (simulated)
  setTimeout(async () => {
    try {
      // This would need an admin endpoint to update order status
      console.log(`[DEMO] Order ${orderId} would be marked as delivered after 30 seconds`);
    } catch (error) {
      console.error("Error simulating delivery:", error);
    }
  }, 30000); // 30 seconds
}

export const ORDER_STATUS_FLOW = {
  processing: "pending",
  pending: "paid",
  paid: "shipped",
  shipped: "delivered",
  delivered: "delivered", // final state
  cancelled: "cancelled" // final state
};

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  processing: "Your order is being processed",
  pending: "Payment is pending",
  paid: "Payment received, preparing to ship",
  shipped: "Order is on its way",
  delivered: "Order has been delivered",
  cancelled: "Order has been cancelled"
};
