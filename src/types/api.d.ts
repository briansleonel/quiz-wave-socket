/**
 * Interfaz para una Respuesta del servidor a una determinada Petición
 *
 * @property status HTTP Status Code
 * @property data Datos que serán enviados al cliente
 * @property message Mensaje como respuesta a la petición
 */
export interface APIResponse<I> {
    status: number;
    data: I;
    message: string | Array<string>;
    pagination?: ApiPagination;
}