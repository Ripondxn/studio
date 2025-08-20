
import { z } from 'zod';

export const roomSchema = z.object({
  id: z.string(),
  roomCode: z.string().min(1, "Room code is required."),
  roomName: z.string().min(1, "Room name is required."),
  propertyCode: z.string().min(1, "Property code is required."),
  floorCode: z.string().min(1, "Floor code is required."),
  unitCode: z.string().optional(),
  roomType: z.string().min(1, "Room type is required."),
});

export type Room = z.infer<typeof roomSchema>;
