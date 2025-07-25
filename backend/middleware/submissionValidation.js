import zod from 'zod';

const submissionSchema = zod.object({
  title: zod
    .string({ message: 'title is required' })
    .max(60, { message: 'the maximum length of title is 60 chars' }),
  description: zod
    .string({ message: 'description is required' })
    .max(500, { message: 'the maximum length of description is 500 chars' })
    .optional(),
  githubRepo: zod
    .string({ message: 'GitHub URL is required' })
    .regex(/github\.com\//, {
      message: 'invalid GitHub URL',
    }),

  liveUrl: zod.string().optional(),
  tools: zod.array(zod.string(), { message: 'invalid tools' }).optional(),
});

const submissionCreateSchema = submissionSchema.extend({
  projectId: zod.string({ message: 'submission project is invalid' }),
});

const submissionUpdateSchema = submissionSchema
  .pick({
    title: true,
    description: true,
    githubRepo: true,
    liveUrl: true,
    tools: true,
  })
  .partial()
  .extend({
    submissionId: zod.string({ message: 'submission project is invalid' }),
  });

export function validateCreateSubmission(req, res, next) {
  try {
    const zodResult = submissionCreateSchema.safeParse(req.body);

    if (!zodResult.success) {
      const zodError = zodResult.error.issues[0]?.message;
      return res.status(400).json({ message: 'Invalid data', error: zodError });
    }
    next();
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Internal server error', error: e.message });
  }
}

export function validateUpdateSubmission(req, res, next) {
  try {
    const zodResult = submissionUpdateSchema.safeParse(req.body);
    delete zodResult.data.submissionId;
    req.updateData = zodResult.data;
    if (!zodResult.success) {
      const zodError = zodResult.error.issues[0]?.message;
      return res.status(400).json({ message: 'Invalid data', error: zodError });
    }
    if (Object.keys(req.updateData).length === 0) {
      return res
        .status(400)
        .json({ message: 'Invalid data', error: 'no data to update' });
    }
    next();
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Internal server error', error: e.message });
  }
}
