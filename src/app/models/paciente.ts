export class Paciente {
    id?: number;
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    codigoLetra?: string;
    codigoNro?: number;
    fechaNacimiento?: string; // Formato 'yyyy-MM-dd'
    local: { id: number };
    email: string;
    celular: string;
    domicilio: string;
    peso: number;
    estatura: number;
    calzado: number;
    cardiovascular: boolean;
    diabetes: boolean;
    hemofilia: boolean;
    otros?: string;
    derivado?: string;
    plantillas?: string;
    ortesicos?: string;
    onicomicosis: boolean;
    onicocriptosis: boolean;
    helomas: boolean;
    onicogrifosis: boolean;
    halluxvalgus: boolean;
    vph: boolean;
    dermatomicosis: boolean;
    otrasafectaciones?: string;
  
    constructor(
      nombres: string,
      apellidos: string,
      dni: string,
      telefono: string,
      local: { id: number },
      email: string,
      celular: string,
      domicilio: string,
      peso: number,
      estatura: number,
      calzado: number,
      cardiovascular: boolean,
      diabetes: boolean,
      hemofilia: boolean,
      onicomicosis: boolean,
      onicocriptosis: boolean,
      helomas: boolean,
      onicogrifosis: boolean,
      halluxvalgus: boolean,
      vph: boolean,
      dermatomicosis: boolean,
      codigoLetra?: string,
      codigoNro?: number,
      fechaNacimiento?: string,
      otros?: string,
      derivado?: string,
      plantillas?: string,
      ortesicos?: string,
      otrasafectaciones?: string
    ) {
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.dni = dni;
      this.telefono = telefono;
      this.local = local;
      this.email = email;
      this.celular = celular;
      this.domicilio = domicilio;
      this.peso = peso;
      this.estatura = estatura;
      this.calzado = calzado;
      this.cardiovascular = cardiovascular;
      this.diabetes = diabetes;
      this.hemofilia = hemofilia;
      this.onicomicosis = onicomicosis;
      this.onicocriptosis = onicocriptosis;
      this.helomas = helomas;
      this.onicogrifosis = onicogrifosis;
      this.halluxvalgus = halluxvalgus;
      this.vph = vph;
      this.dermatomicosis = dermatomicosis;
      this.codigoLetra = codigoLetra;
      this.codigoNro = codigoNro;
      this.fechaNacimiento = fechaNacimiento;
      this.otros = otros;
      this.derivado = derivado;
      this.plantillas = plantillas;
      this.ortesicos = ortesicos;
      this.otrasafectaciones = otrasafectaciones;
    }
  }
  