import { z } from "zod";
import { apiFetch } from "~~/server/utils/fetch";

export default defineEventHandler(async (event) => {
  // Validate the ID parameter
  const idSchema = z.object({
    id: z.number({ coerce: true }).positive().int(),
  });
  const { id } = await getValidatedRouterParams(event, idSchema.parse);

  // Create the event stream
  const eventStream = createEventStream(event);

  // Function to fetch order status from Django backend
  const fetchOrderStatus = async () => {
    try {
      // Replace with your Django backend API URL
      const response = await apiFetch<{ state: string }>(
        event,
        `/store/sells/${id}/consult-order/`,
      );

      // Push the order status to the event stream
      await eventStream.push(JSON.stringify(response.state));
    } catch (error) {
      console.error("Error fetching order status:", error);
      await eventStream.push(
        JSON.stringify({ error: "Failed to fetch order status" }),
      );
    }
  };

  // Fetch order status periodically
  const interval = setInterval(fetchOrderStatus, 5000); // Fetch every 5 seconds

  // Clean up when the connection is closed
  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  // Send the initial response to establish the SSE connection
  return eventStream.send();
});
