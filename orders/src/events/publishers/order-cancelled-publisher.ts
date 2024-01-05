import { OrderCancelledEvent, Publisher, Subjects } from "@shahntickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
