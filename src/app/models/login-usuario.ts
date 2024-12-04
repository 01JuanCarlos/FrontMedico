export class LoginUsuario {
    nombreUsuario: string; // Es el correo usado para autenticación
    password: string;
    constructor(nombreUsuario:string,password:string){
        this.nombreUsuario=nombreUsuario;
        this.password=password;
    }
}
