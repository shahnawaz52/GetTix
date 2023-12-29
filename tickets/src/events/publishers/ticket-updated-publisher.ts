import { Publisher, Subjects, TicketUpdatedEvent } from "@shahntickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
