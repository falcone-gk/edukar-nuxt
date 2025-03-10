import { H3Event } from "h3";

export const apiFetch = async <T>(
  event: H3Event,
  endpoint: string,
  options: any = {},
): Promise<T> => {
  const config = useRuntimeConfig(); // Accede a las variables de entorno
  const token = getCookie(event, "token"); // Obtén el token de la cookie

  // Configura las opciones de la petición
  const fetchOptions = {
    baseURL: config.public.apiURL, // Usa la URL base de tu API de Django
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Token ${token}` : "", // Añade el token si existe
    },
  };

  try {
    const response = await $fetch(endpoint, fetchOptions);
    return response as T;
  } catch (error: any) {
    // Maneja errores de autenticación (401)
    if (error.status === 401) {
      // Redirige al login o maneja el error como prefieras
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
    throw error; // Relanza otros errores
  }
};
