export class Atencion {
    id: number;
    procedimiento:string;
    precio:number;
    

    constructor(id:number,procedimiento:string,precio:number){
        this.id = id;
        this.procedimiento=procedimiento;
        this.precio=precio;

    }
}