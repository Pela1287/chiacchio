export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code || 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export function handleApiError(error: unknown): { error: string; code?: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error);
    return {
      error: 'Error interno del servidor',
      statusCode: 500
    };
  }

  console.error('Unknown error:', error);
  return {
    error: 'Error desconocido',
    statusCode: 500
  };
}

export function logError(error: unknown, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, error);
  if (context) {
    console.error('Context:', context);
  }
}
