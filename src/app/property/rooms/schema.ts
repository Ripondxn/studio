

import { z } from 'zod';

export const roomSchema = z.object({
  id: z.string(),
  roomCode: z.string().min(1, "Room code is required."),
  roomName: z.string().optional(),
  propertyCode: z.string().min(1, "Property code is required."),
  floorCode: z.string().optional(),
  unitCode: z.string().optional(),
  roomType: z.string().optional(),
  rentAmount: z.number().optional(),
  rentFrequency: z.enum(['Monthly', 'Yearly']).optional(),
  occupancyStatus: z.enum(['Vacant', 'Occupied']).optional(),
});

export type Room = z.infer<typeof roomSchema>;
