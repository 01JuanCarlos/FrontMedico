export class Especialista {
    nombres: string;
    estado: string;
    especialidad: string;
    locales: number[]; 

    constructor(nombres:string,estado:string,especialidad:string,locales: number[]){
        this.nombres=nombres;
        this.estado=estado;
        this.especialidad=especialidad;
        this.locales=locales;

    }
}