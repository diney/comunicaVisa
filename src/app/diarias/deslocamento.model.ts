export class Deslocamento {
    constructor(
        public id:number,
        public data: string,
        public estadoPartida: string,
        public cidadePartida: string,
        public horaPartida: number,
        public estadoDestino: string,
        public cidadeDestino: string,
        public horaDestino: number,
        public meioTransp: string



    ) { }


}