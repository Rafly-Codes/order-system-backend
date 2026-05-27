import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinSession(sessionToken: string, client: Socket): {
        event: string;
        room: string;
    };
    handleJoinKitchen(client: Socket): {
        event: string;
        room: string;
    };
    handleJoinKasir(client: Socket): {
        event: string;
        room: string;
    };
    emitNewOrder(order: any): void;
    emitOrderStatusUpdate(order: any, sessionToken?: string): void;
    emitPaymentConfirmed(orderId: string, sessionToken?: string): void;
    emitQueueCalled(queueNumber: number, sessionToken: string): void;
}
