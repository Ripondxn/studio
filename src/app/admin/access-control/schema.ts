import { z } from 'zod';

export const moduleSettingsSchema = z.record(z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.boolean(),
}));

export type ModuleSettings = z.infer<typeof moduleSettingsSchema>;
