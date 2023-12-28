import { Publisher, Subjects, TicketCreatedEvent } from "@shahntickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
