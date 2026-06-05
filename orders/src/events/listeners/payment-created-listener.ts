import { Message, Stan } from 'node-nats-streaming';
import { OrderStatus } from '@shahntickets/common';
import { Order } from '../../models/order';

/**
 * Listens for payment:created events from the payments service.
 * Defined locally since PaymentCreated is not yet in the common module.
 */
export class PaymentCreatedListener {
    private client: Stan;
    readonly subject = 'payment:created';
    readonly queueGroupName = 'orders-service';
    private ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', async (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const data = typeof msg.getData() === 'string'
                ? JSON.parse(msg.getData() as string)
                : JSON.parse(msg.getData().toString('utf-8'));

            await this.onMessage(data, msg);
        });
    }

    async onMessage(data: { id: string; orderId: string; stripeId: string }, msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
}
