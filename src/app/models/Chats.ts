class Notifications {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: number;
    message_time: Date;
    sender_username: string;
    receiver_username: string;
}

export default Notifications;
