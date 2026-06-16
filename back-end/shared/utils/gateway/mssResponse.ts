import type { MssServiceResponse } from "../../interfaces/gateway/gatewayInterfaces.js";

/**
 * Extrai o envelope { error, status, content, message } do body de um MSS.
 * Equivalente ao antigo `returnData(response)` que lia `response.data`.
 */
export function parseMssResponse<TContent = unknown>(
  data: unknown
): MssServiceResponse<TContent> {
  if (!data || typeof data !== "object") {
    return { error: true, message: "Resposta inválida do serviço" };
  }

  const body = data as Record<string, unknown>;

  return {
    error: Boolean(body.error),
    status: typeof body.status === "number" ? body.status : undefined,
    message: body.message as MssServiceResponse<TContent>["message"],
    content: body.content as TContent | undefined,
  };
}

/**
 * Converte mensagens de erro dos MSS em string para o front.
 * - string → retorna direto
 * - objeto (ex.: erros Zod `{ email: ["..."] }`) → junta em uma frase
 * Equivalente ao antigo `formatMessage`.
 */
export function formatMssMessage(
  message: MssServiceResponse["message"]
): string {
  if (typeof message === "string") return message;

  if (message && typeof message === "object") {
    return Object.values(message)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean)
      .join(". ");
  }

  return "Erro no servidor";
}
