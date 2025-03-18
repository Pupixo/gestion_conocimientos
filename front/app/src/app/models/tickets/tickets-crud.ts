export interface TicketsCrud {
    id: number,
    usuario_actual: string,

}


export interface TicketsInfo {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    is_active: boolean,
    is_superuser:boolean,
    last_login:string
    is_staff:boolean
    date_joined:string
}