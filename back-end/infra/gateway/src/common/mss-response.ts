type MssMessage = string | Record<string, string> | Record<string, string[]> | undefined;

export type MssServiceResponse<TContent = unknown> = {
  error: boolean;
  status?: number;
  message?: MssMessage;
  content?: TContent;
};

export function parseMssResponse<TContent = unknown>(
  data: unknown,
): MssServiceResponse<TContent> {
  if (!data || typeof data !== 'object') {
    return { error: true, message: 'Resposta inválida do serviço' };
  }
  const body = data as Record<string, unknown>;
  return {
    error: Boolean(body.error),
    status: typeof body.status === 'number' ? body.status : undefined,
    message: body.message as MssMessage,
    content: body.content as TContent | undefined,
  };
}

export function formatMssMessage(message: MssMessage): string {
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object') {
    return Object.values(message)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean)
      .join('. ');
  }
  return 'Erro no servidor';
}

export const emptyGatewayFields = {
  query: {},
  params: {},
  headers: {},
} as const;

export function isGatewayTransportError(status: number): boolean {
  return status === 404 || status === 502;
}

export function extractUsuario(content: unknown): unknown {
  const record = content as Record<string, unknown> | undefined;
  return record?.usuario ?? content;
}

export function sessionFromContent(content: unknown) {
  const raw = (content ?? {}) as Record<string, unknown>;
  return {
    usuario: extractUsuario(raw),
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    expiresIn: raw.expiresIn,
    tokenType: raw.tokenType || 'Bearer',
  };
}
