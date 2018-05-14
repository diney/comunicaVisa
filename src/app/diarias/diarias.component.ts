import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Deslocamento } from './deslocamento.model'
import { NgForm } from "@angular/forms";
import { ESTADO } from './estadoCidade-mock'
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { DiariaService } from "../diaria.service";
import { PopoverModule } from "ngx-popover";

import { ChatService } from './../chat.service';

let jsPDF = require('jspdf');
require('jspdf-autotable');
//let rasterizeHTML = require('rasterizeHTML');

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-diarias',
  templateUrl: './diarias.component.html',
  styleUrls: ['./diarias.component.css'],
  providers: [DiariaService]
})
export class DiariasComponent implements OnInit {

  outputPath: string = 'http://sigrhportal.sea.sc.gov.br/SIGRHNovoPortal/login2.html?cb470603-f14a-460f-908d-c2f397666a84';


  vinculo: any;
  municipio: any;
  cargo: any;
  grupo: string;
  local: string;
  estadoBuscaPartida: any;
  estadoBuscaDestino: any;
  teste: boolean = false;
  startDate: any;
  estadoPartida: any;
  estadoDestino: any;
  cidadePartida: any;
  cidadeDestino: any;
  horaPartida: any;
  horaDestino: any;
  valido: boolean = true;
  token: any;
  currentUser: any;
  userId = null;
  nome: String;
  cpf: String;
  matricula: String;
  conta: string;
  banco: string;
  agencia: string;
  funcao: string;
  competência: string;
  qual: string;
  competencia: string = " ";
  email: string;
  dataAtual = new Date();
  meioTrans = [
    { nome: 'Veículo Oficial' },
    { nome: 'Veículo Próprio' },
    { nome: 'Ônibus' },
    { nome: 'Avião' }
  ];


  transporte: any
  idTabela = 1
  id = 1

  outro = ""; adm3 = ""; adm8 = ""; dgi1 = ""; fg3 = ""; fg2 = ""; fg1 = ""; ftg3 = ""; ftg2 = ""; ftg1 = ""; dgs3 = ""; dgs2 = ""; dgs1 = "";
  outroQual = "";
  objViagem: string;

  selecionado: string
deslocamento = new Deslocamento(this.idTabela, this.startDate, '', 'cidadePartida', 0, 'estadoDestino', 'cidadeDestino', 0, 'Selecione')
  //controles de validação
  @ViewChild('deslocamentoForm') public form: NgForm;

  

  //private subjectPesquisa: Subject<string> = new Subject<string>()

  estado: Array<any> = ESTADO
  cidadesPartida: Array<any> = [];
  //cd: Array<any> = [];
  cidadesDestino: Array<any> = [];
  deslocamentoTabela: Array<any> = [];
  novoDeslocamento: Deslocamento
  public municipiosPartida: Observable<any[]>
  public municipiosDestino: Observable<any[]>


  constructor(private diariaService: DiariaService, private chatService: ChatService) {

    this.objViagem = "";
    this.transporte = ""

    this.estadoPartida = this.estado[0].sigla;

    this.estadoDestino = this.estado[0].sigla;

    this.municipiosDestino = this.diariaService.pesquisaMunicipios('42')
    this.municipiosDestino.subscribe(
      (municipios: any[]) => this.cidadesDestino = municipios
    )
    this.municipiosPartida = this.diariaService.pesquisaMunicipios('42')
    this.municipiosPartida.subscribe(
      (municipios: any[]) => this.cidadesPartida = municipios
    )

  }

  ngOnInit() {

   

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = this.currentUser.token;// your token
    this.userId = this.token.userId;
    this.chatService.userSessionCheck(this.userId, (error, response) => {
      console.log(response)
      if (error) {
      } else {
        this.nome = (response.nome === undefined) ? " " : response.nome;
        this.cpf = (response.cpf === undefined) ? " " : response.cpf;
        this.funcao = (response.funcao === undefined) ? " " : response.matricula;
        this.matricula = (response.matricula === undefined) ? " " : response.matricula;
        this.banco = (response.banco === undefined) ? " " : response.banco;
        this.agencia = (response.agencia === undefined) ? " " : response.agencia;
        this.conta = (response.conta === undefined) ? " " : response.conta;
        this.local = (response.unidade === undefined) ? " " : response.unidade;
        this.cargo = (response.cargo === undefined) ? " " : response.cargo;
        this.municipio = (response.municipio === undefined) ? " " : response.municipio;
        this.vinculo = (response.vinculo === undefined) ? " " : response.vinculo;
        this.grupo = (response.grupo === undefined) ? " " : response.grupo;
        this.email = (response.email === undefined) ? " " : response.email;

      }
    });


    this.estadoPartida = this.estado[0].sigla;
    this.estadoDestino = this.estado[0].sigla;
  }

  removerEspaco(valor: string) {
    console.log(valor)
    let espacoBranco = (valor || '').trim().length === 0
    this.valido = !espacoBranco;
    if (!this.valido) {
      this.cpf = null
    }

    return this.valido
  }

  removerDeslocamento(id: number): void {
    var index = this.deslocamentoTabela.indexOf(id)
   
  
    for (var i = 0; i < this.deslocamentoTabela.length; i++) {
      if (this.deslocamentoTabela[i] === id) {
       this.deslocamentoTabela.splice(index,1);
       return
      }

    }

  }

  adicionarDeslocamento(): void {

    this.deslocamento.id = this.idTabela,
    this.deslocamento.data = this.alterarData(this.dataAtual);
    this.deslocamento.estadoPartida = this.estadoPartida;
    this.deslocamento.cidadePartida = this.cidadePartida;
    this.deslocamento.horaPartida = this.horaPartida;
    this.deslocamento.estadoDestino = this.estadoDestino;
    this.deslocamento.cidadeDestino = this.cidadeDestino;
    this.deslocamento.horaDestino = this.horaDestino;
    this.deslocamento.meioTransp = this.transporte;
    this.deslocamentoTabela.push(this.deslocamento)
    this.idTabela = ++this.id;

    this.deslocamento = new Deslocamento(this.idTabela, this.startDate, '', '', 0, '', '', 0, '');

    this.cidadePartida = null;
    this.horaPartida = null;
    this.cidadeDestino = null;
    this.horaDestino = null;
    this.transporte = null;
    this.estadoPartida = this.estado[0].sigla;
    this.estadoDestino = this.estado[0].sigla;

    this.municipiosPartida = this.diariaService.pesquisaMunicipios('42')
    this.municipiosPartida.subscribe(
      (municipios: any[]) => this.cidadesPartida = municipios
    )
    this.municipiosDestino = this.diariaService.pesquisaMunicipios('42')
    this.municipiosDestino.subscribe(
      (municipios: any[]) => this.cidadesDestino = municipios
    )

  }

  getCidadesByEstado() {
    this.estado.forEach((item, index) => {
      this.estado.push({
        id: item.id,
        sigla: item.sigla
      })
    })
  }

  public pesquisaCidadePartida(partida: any): void {
    for (let entry of this.estado) {
      if (entry.sigla == partida) {
        this.estadoBuscaPartida = entry.id
      }
    }
    this.municipiosPartida = this.diariaService.pesquisaMunicipios(this.estadoBuscaPartida)
    this.municipiosPartida.subscribe(
      (municipios: any[]) => this.cidadesPartida = municipios
    )
  }

  public pesquisaCidadeDestino(destino: any): void {
    for (let entry of this.estado) {
      if (entry.sigla == destino) {
        this.estadoBuscaDestino = entry.id
      }
    }
    this.municipiosDestino = this.diariaService.pesquisaMunicipios(this.estadoBuscaDestino)
    this.municipiosDestino.subscribe(
      (municipios: any[]) => this.cidadesDestino = municipios
    )
  }

  public alterarData(x: any): string {
    let diaMes = new Date(x);
    return (diaMes.getUTCDate() + " / " + (diaMes.getUTCMonth() + 1))
  }

  handleChange(numero) {
    this.teste = false;
    this.outroQual = "";
    this.codigoFuncao(numero);
  }

  qualChange(numero) {
    this.teste = true;
    this.codigoFuncao(numero);
  }

  codigoFuncao(numero) {
    switch (numero) {
      case 0:
        this.limpaRadio();
        this.dgs1 = "X";
        break;
      case 1:
        this.limpaRadio();
        this.dgs2 = "X";
        break;
      case 2:
        this.limpaRadio();
        this.dgs3 = "X";
        break;
      case 3:
        this.limpaRadio();
        this.ftg1 = "X";
        break;
      case 4:
        this.limpaRadio();
        this.ftg2 = "X";
        break;
      case 5:
        this.limpaRadio();
        this.ftg3 = "X";
        break;
      case 6:
        this.limpaRadio();
        this.fg1 = "X";
        break;
      case 7:
        this.limpaRadio();
        this.fg2 = "X";
        break;
      case 8:
        this.limpaRadio();
        this.fg3 = "X";
        break;
      case 9:
        this.limpaRadio();
        this.dgi1 = "X";
        break;
      case 10:
        this.limpaRadio();
        this.adm3 = "X";
        break;
      case 11:
        this.limpaRadio();
        this.adm8 = "X";
        break;
      case 12:
        this.limpaRadio();
        this.outro = "X";
        break;
    }
  }

  limpaRadio() {
    this.outro = "";
    this.adm3 = "";
    this.adm8 = "";
    this.dgi1 = "";
    this.fg3 = "";
    this.fg2 = "";
    this.fg1 = "";
    this.ftg3 = "";
    this.ftg2 = "";
    this.ftg1 = "";
    this.dgs3 = "";
    this.dgs2 = "";
    this.dgs1 = "";
    this.outroQual = "";
  }

  public geraPdf() {
    var logo = require('assets/images/logos/brasao.png');

    var doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(25, 17, 'ESTADO DE SANTA CATARINA');
    doc.text(148, 17, 'REQUERIMENTO DE DIÁRIAS');
    doc.addImage(logo, 'PNG', 5, 5, 18, 16)
    doc.setFontSize(9);
    doc.text(10, 26, 'DESCRIÇÃO DO ÓRGÃO/ENTIDADE');
    doc.rect(9, 22, 190, 13);

    doc.setFontSize(10);
    doc.setDrawColor(0)
    doc.text(10, 39, 'SERVIDOR');
    // doc.setFillColor(205, 205, 205);
    doc.text(73, 44, 'DADOS CADASTRAIS E FUNCIONAIS');
    doc.setFontSize(10);

    doc.rect(9, 40, 190, 5);

    doc.text(10, 49, 'CPF');
    doc.rect(9, 45, 45, 10);

    doc.text(55, 49, 'NOME COMPLETO');
    doc.rect(9, 45, 141, 10);

    doc.text(151, 49, 'MATRÍCULA-DV-VÍNCULO');
    doc.rect(9, 45, 190, 10);

    doc.text(10, 59, 'LOCAL DE TRABALHO (LOTAÇÃO)');
    doc.rect(9, 55, 95, 10);

    doc.text(105, 59, 'MUNICÍPIO DO LOCAL DE TRABALHO');
    doc.rect(9, 55, 190, 10);

    doc.text(10, 69, 'CARGO/EMPREGO');
    doc.rect(9, 65, 135, 10);

    doc.text(145, 69, 'COMPETÊNCIA');
    doc.rect(144, 65, 55, 10);

    doc.text(10, 79, 'CÓDIGO/NÍVEL DO CARGO/FUNÇÃO OCUPAÇÃO');
    doc.rect(9, 75, 190, 25);
    doc.text(15, 85, 'DGS-1');
    doc.rect(11, 82, 3, 3);

    doc.text(32, 85, 'DGS-2');
    doc.rect(28, 82, 3, 3);

    doc.text(49, 85, 'DGS-3');
    doc.rect(45, 82, 3, 3);

    doc.text(66, 85, 'FTG-1');
    doc.rect(62, 82, 3, 3);

    doc.text(83, 85, 'FTG-2');
    doc.rect(79, 82, 3, 3);

    doc.text(99, 85, 'FTG-3');
    doc.rect(95, 82, 3, 3);

    doc.text(115, 85, 'FG-1');
    doc.rect(111, 82, 3, 3);

    doc.text(129, 85, 'FG-2');
    doc.rect(125, 82, 3, 3);

    doc.text(143, 85, 'FG-3');
    doc.rect(139, 82, 3, 3);

    doc.text(159, 82, 'ADM. SUPERIOR - 3');
    doc.setFontSize(8);
    doc.text(159, 86, '(AGENTE POLITICO)');
    doc.rect(155, 80, 3, 3);
    doc.setFontSize(9);

    doc.text(160, 94, 'ADM. SUPERIOR - 8');
    doc.setFontSize(8);
    doc.text(159, 98, '(NÃO CODIFICADO)');
    doc.rect(155, 91, 3, 3);

    doc.setFontSize(9);
    doc.text(15, 98, 'DGI -1 (CODIFICADO)');
    doc.rect(11, 95, 3, 3);

    doc.text(58, 98, 'OUTRO QUAL?');
    doc.rect(54, 95, 3, 3);

    doc.text(10, 104, 'E-MAIL');
    doc.rect(9, 100, 75, 17);

    doc.text(126, 104, 'DADOS BANCÁRIOS');
    doc.rect(84, 100, 115, 5);

    doc.text(85, 108, 'BANCO');
    doc.rect(84, 105, 40, 12);

    doc.text(125, 108, 'AGÊNCIA');
    doc.rect(124, 105, 35, 12);

    doc.text(160, 108, 'NÚMERO DA CONTA');
    doc.rect(159, 105, 40, 12);
    doc.setFontSize(9);
    //primeira linha
    doc.text(10, 54, this.cpf);
    doc.text(55, 54, this.nome);
    doc.text(151, 54, this.matricula);
    doc.text(10, 64, this.local);
    doc.text(105, 64, this.municipio);
    doc.text(9, 74, this.cargo);
    doc.text(144, 74, this.competencia)
    doc.setFontSize(12);
    doc.text(11, 85, this.dgs1);
    doc.text(28, 85, this.dgs2);
    doc.text(45, 85, this.dgs3);
    doc.text(62, 85, this.ftg1);
    doc.text(79, 85, this.ftg2);
    doc.text(95, 85, this.ftg3);
    doc.text(111, 85, this.fg1);
    doc.text(125, 85, this.fg2);
    doc.text(139, 85, this.fg3);
    doc.text(155, 83, this.adm3);
    doc.text(155, 94, this.adm8);
    doc.text(11, 98, this.dgi1);
    doc.text(54, 98, this.outro);
    doc.text(82, 98, this.outroQual);
    doc.setFontSize(10);
    doc.text(11, 116, this.email)
    doc.text(85, 116, this.banco);
    doc.text(125, 116, this.agencia);
    doc.text(160, 116, this.conta);

    doc.setFontSize(9);
    doc.text(85, 121, 'DESLOCAMENTOS');
    doc.rect(9, 117, 190, 5);

    var options = {
      theme: 'grid',
      margin: {
        horizontal: 0,
        top: 122,
        width: 100

      },
      headerStyles: {
        cellPadding: 1,
        lineWidth: 0.2,
        lineColor: [192, 192, 192], //Silver gray
        valign: 'top',
        fontStyle: 'bold',
        halign: 'center', //'center' or 'right'
        fillColor: [26, 188, 156], //green
        textColor: [255, 255, 255], //White
        fontSize: 9
      }

    };
    var columns = ["DIA / MÊS  ", "DE  ", "HORÁRIO  ", "PARA  ", "HORÁRIO", "MEIO DE TRANSPORTE"]
    let newTable = [];
    for (var i = 0; i < this.deslocamentoTabela.length; i++) {
      var parse = [
        this.deslocamentoTabela[i].data,
        this.deslocamentoTabela[i].cidadePartida + "/" + this.deslocamentoTabela[i].estadoPartida,
        this.deslocamentoTabela[i].horaPartida,
        this.deslocamentoTabela[i].cidadeDestino + "/" + this.deslocamentoTabela[i].estadoDestino,
        this.deslocamentoTabela[i].horaDestino,
        this.deslocamentoTabela[i].meioTransp
      ]
      newTable.push(parse)
    }

    doc.autoTable(columns, newTable, options, );
 
    //posiciona texto abaixo da tabela dinâmica
    let finalY = doc.autoTable.previous.finalY + 2;
     doc.setDrawColor(0)
   doc.rect(9, 117, 190,doc.autoTable.previous.finalY-115 );
    //  doc.text(10, finalY, '(*)No caso de uso de passagens é obrigatória a devolução dos respectivos bilhetes.');
   
    doc.setFontSize(9);

    doc.text(85, finalY + 3, 'OBJETIVO(S) DA VIAGEM');
    doc.rect(9, finalY, 190, 4);
    doc.setFontSize(10);
    doc.text(10, finalY + 7, this.objViagem) ? " " : this.objViagem;
    doc.setDrawColor(0)
    doc.rect(9, finalY + 4, 190, 9);
    doc.setFontSize(9);
    doc.text(10, finalY + 16, 'Declaro, ainda que não me enquadro em qualquer das situções impeditivas para o recebimento de diárias');
    doc.rect(9, finalY + 13, 190, 4);

    doc.text(10, finalY + 21, 'LOCAL');
    doc.rect(9, finalY + 17, 70, 12);

    doc.text(80, finalY + 21, 'DATA');
    doc.text(83, finalY + 28, '  /      / ');
    doc.rect(79, finalY + 17, 34, 12);

    doc.text(114, finalY + 21, ' ASSINATURA DO SERVIDOR');
    doc.rect(113, finalY + 17, 86, 12);


    doc.text(10, finalY + 32, 'CHEFIA IMEDIATA DO SERVIDOR REQUERENTE ');
    doc.rect(9, finalY + 33, 70, 12);
    doc.rect(11, finalY + 39, 3, 3);

    doc.text(15, finalY + 42, 'AUTORIZO ');
    doc.rect(35, finalY + 39, 3, 3);
    doc.text(39, finalY + 42, 'NÃO AUTORIZO ');


    doc.text(80, finalY + 37, 'DATA');
    doc.text(83, finalY + 44, '  /      / ');
    doc.rect(79, finalY + 33, 34, 12);

    doc.text(114, finalY + 37, 'ASSINATURA E CARIMBO - CHEFIA IMEDIATA ');
    doc.rect(113, finalY + 33, 86, 12);


    doc.text(10, finalY + 49, 'DIRETOR OU EQUIVALENTE DA ÁREA DE LOTAÇÃO (EXERCÍCIO) DO SERVIDOR REQUERENTE');

    doc.rect(9, finalY + 50, 70, 12);
    doc.rect(11, finalY + 54, 3, 3);

    doc.text(15, finalY + 57, 'AUTORIZO ');
    doc.rect(35, finalY + 54, 3, 3);
    doc.text(39, finalY + 57, 'NÃO AUTORIZO ');

    doc.text(80, finalY + 54, 'DATA');
    doc.text(83, finalY + 61, '  /      / ');
    doc.rect(79, finalY + 50, 34, 12);


    doc.text(114, finalY + 54, 'ASSINATURA E CARIMBO - DIRETOR ');
    doc.rect(113, finalY + 50, 86, 12);


    doc.text(10, finalY + 66, 'ORDENADOR DE DESPESA OU AGENTE DELEGADO (DIRETOR OU EQUIVALENTE DA ÁREA FINANCEIRA/FUNDO)');
    doc.rect(9, finalY + 67, 70, 12);
    doc.rect(11, finalY + 71, 3, 3);

    doc.text(15, finalY + 74, 'AUTORIZO ');
    doc.rect(35, finalY + 71, 3, 3);
    doc.text(39, finalY + 74, 'NÃO AUTORIZO ');

    doc.text(80, finalY + 71, 'DATA');
    doc.text(83, finalY + 78, '  /      / ');
    doc.rect(79, finalY + 67, 34, 12);

    doc.text(114, finalY + 71, 'ASSINATURA E CARIMBO - DIRETOR ');
    doc.rect(113, finalY + 67, 86, 12);

    doc.text(10, finalY + 83, 'SERVIDOR RESPONSÁVEL PELO CÁLCULO E PAGAMENTO/ADIANTAMENTO DE DIÁRIAS');
    doc.text(85, finalY + 87, 'DIÁRIAS A PAGAR');
    doc.rect(9, finalY + 84, 190, 4);
    doc.setFontSize(7);
    doc.text(12, finalY + 91, 'GRUPO');
    doc.text(10, finalY + 94, 'DO CARGO');
    doc.rect(9, finalY + 88, 15, 8);
    doc.setFontSize(8);
    doc.text(60, finalY + 93, 'DESLOCAMENTO');
    doc.rect(24, finalY + 88, 90, 8);
    doc.text(115, finalY + 93, 'QUANTIDADE');
    doc.rect(114, finalY + 88, 20, 8);
    doc.setFontSize(8);
    doc.text(160, finalY + 91, 'DIÁRIA');
    doc.rect(134, finalY + 88, 65, 8);
    doc.text(142, finalY + 95, 'VALOR');
    doc.rect(134, finalY + 92, 30, 4);
    doc.text(168, finalY + 95, 'TOTAL POR TIPO');
    doc.rect(164, finalY + 92, 35, 4);
    doc.setFontSize(9);
    doc.rect(9, finalY + 96, 15, 15);
    doc.text(15, finalY + 100, '1º ');
    doc.rect(11, finalY + 97, 3, 3);

    doc.text(15, finalY + 105, '2º ');
    doc.rect(11, finalY + 102, 3, 3);

    doc.text(15, finalY + 110, '3º ');
    doc.rect(11, finalY + 107, 3, 3);

    doc.rect(24, finalY + 96, 90, 5);
    doc.rect(114, finalY + 96, 20, 5);
    doc.rect(134, finalY + 96, 30, 5);
    doc.rect(164, finalY + 96, 35, 5);

    doc.rect(24, finalY + 101, 90, 5);
    doc.rect(114, finalY + 101, 20, 5);
    doc.rect(134, finalY + 101, 30, 5);
    doc.rect(164, finalY + 101, 35, 5);

    doc.text(70, finalY + 110, 'TOTAL');
    doc.rect(24, finalY + 106, 90, 5);
    doc.rect(114, finalY + 106, 20, 5);
    doc.rect(134, finalY + 106, 30, 5);
    doc.rect(164, finalY + 106, 35, 5);

    doc.text(10, finalY + 114, 'DATA');
    doc.text(20, finalY + 121, '  /      / ');
    doc.rect(9, finalY + 111, 65, 11);
    doc.text(75, finalY + 114, 'ASSINATURA E CARINBO DO RESPONSÁVEL PELO PAGTO/ADIANT. DE DIÁRIAS');
    doc.rect(74, finalY + 111, 125, 11);


    //iframe mosta pdf
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();

  }

}