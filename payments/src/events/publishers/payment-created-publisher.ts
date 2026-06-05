import { Stan } from 'node-nats-streaming';

/**
 * Publishes a payment:created event on NATS.
 * Defined locally since PaymentCreated is not yet in the common module.
 */
export class PaymentCreatedPublisher {
    private client: Stan;
    readonly subject = 'payment:created';

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: { id: string; orderId: string; stripeId: string }): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to subject', this.subject);
                resolve();
            });
        });
    }
}
