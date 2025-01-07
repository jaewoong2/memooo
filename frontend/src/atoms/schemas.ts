import { z } from 'zod';

import { Event, Gifticon, Image, Participant, User } from './types';

function makePropertiesOptional<T extends z.ZodTypeAny>(schema: T): T {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const optionalShape: any = {};

    for (const key in shape) {
      optionalShape[key] = makePropertiesOptional(shape[key]).optional().nullable();
    }

    return z.object(optionalShape) as any;
  } else if (schema instanceof z.ZodArray) {
    return z.array(makePropertiesOptional(schema.element)) as any;
  } else if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return schema as any;
  } else {
    return schema.optional().nullable() as any;
  }
}
export const GifticonCategorySchema = z.enum(['FOOD', 'OTHER', 'LOSE']);
export type GifticonCategory = z.infer<typeof GifticonCategorySchema>;

export const imageSchema: z.ZodType<Image, z.ZodTypeDef> = z.lazy(() =>
  z.object({
    id: z.number(),
    imageUrl: z.string(),
    name: z.string(),
    gifticon: GifticonSchema.nullable().optional(),
    event: EventSchema.nullable().optional(),
  })
);

export const UserSchema: z.ZodType<User, z.ZodTypeDef> = z.lazy(() =>
  z.object({
    id: z.number(),
    avatar: z.string(),
    email: z.string(),
    userName: z.string(),
    events: z.array(EventSchema).optional(),
    gifticons: z.array(GifticonSchema).optional(),
  })
);

export const EventSchema: z.ZodType<Event, z.ZodTypeDef> = z.lazy(() =>
  z.object({
    id: z.number(),
    user: UserSchema.optional(),
    eventName: z.string(),
    eventDescription: z.string(),
    eventStartDate: z.string(),
    eventEndDate: z.string(),
    maxParticipants: z.number(),
    totalGifticons: z.number(),
    gifticons: z.array(makePropertiesOptional(GifticonSchema).optional()).optional(),
    participants: z.array(ParticipantSchema.optional()).optional(),
    thumbnails: z.array(imageSchema.optional()).optional(),
    repetition: z.number(),
    blocks: z.array(z.any().optional().nullable()),
  })
);

export const ParticipantSchema: z.ZodType<Participant, z.ZodTypeDef> = z.lazy(() =>
  z.object({
    id: z.number(),
    event: EventSchema.optional(),
    user: UserSchema.optional(),
    participatedAt: z.string(),
    isApply: z.boolean(),
  })
);

export const GifticonSchema: z.ZodType<Gifticon, z.ZodTypeDef> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    category: GifticonCategorySchema,
    description: z.string().optional(),
    isClaimed: z.boolean(),
    event: EventSchema.optional().nullable(),
    user: UserSchema.optional().nullable(),
    claimedBy: UserSchema.optional().nullable(),
    claimedAt: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    image: imageSchema.optional().nullable(),
  })
);

export const FcFsErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});
