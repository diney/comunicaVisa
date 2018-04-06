export class Deslocamento {
    constructor(
        public data: Date,
        public estadoPartida: string,
        public cidadePartida: string,
        public horaPartida: number,
        public estadoDestino: string,
         public cidadeDestino: string,
        public horaDestino: number,
        public meioTransp: number



    ) { }


}