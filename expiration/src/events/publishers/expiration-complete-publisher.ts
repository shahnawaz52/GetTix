import { Publisher, Subjects, ExpirationCompleteEvent } from "@shahntickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
