
export interface SwapRequestCallback {
    on24HoursIntervalDone(senderUserId: string, receiverUserId: string, blockSender: boolean, blockReceiver: boolean);
}