import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({ namespace: 'support', cors: { origin: '*' } })
export class RealtimeGateway {
  @WebSocketServer() server: Server;
  emitToOrg(orgId: string, event: string, payload: unknown) { this.server?.to(orgId).emit(event, payload); }
  broadcast(event: string, payload: unknown) { this.server?.emit(event, payload); }
}
