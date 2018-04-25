import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Deslocamento } from './deslocamento.model'
import { NgForm } from "@angular/forms";
import { ESTADO } from './estadoCidade-mock'
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { DiariaService } from "../diaria.service";

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
  objDaViagem: string = '';
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
  transporte: any;
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
  competencia: string;
  outro = ""; adm3 = ""; adm8 = ""; dgi1 = ""; fg3 = ""; fg2 = ""; fg1 = ""; ftg3 = ""; ftg2 = ""; ftg1 = ""; dgs3 = ""; dgs2 = ""; dgs1 = "";
  selecionado: string
  //controlar botão 'ADICIONAR DESLOCAMENTO'
  formDeslocamento: string = 'disabled'


  meioTrans = [
    { nome: 'Selecione...' },
    { nome: 'Veículo Oficial' },
    { nome: 'Veículo Próprio' },
    { nome: 'Ônibus' },
    { nome: 'Avião' }
  ];

  deslocamento = new Deslocamento(this.startDate, '', 'cidadePartida', 0, 'estadoDestino', 'cidadeDestino', 0, 1)

  private subjectPesquisa: Subject<string> = new Subject<string>()

  estado: Array<any> = ESTADO
  cidadesPartida: Array<any> = [];
  //cd: Array<any> = [];
  cidadesDestino: Array<any> = [];
  deslocamentoTabela: Array<any> = [];
  novoDeslocamento: Deslocamento
  public municipiosPartida: Observable<any[]>
  public municipiosDestino: Observable<any[]>

  constructor(private diariaService: DiariaService, private chatService: ChatService) {

    this.transporte = this.meioTrans[0].nome;
    this.startDate = new Date();
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
      if (error) {
        console.log(error)
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

      }
    });

    this.transporte = this.meioTrans[0].nome;
    this.estadoPartida = this.estado[0].sigla;
    this.estadoDestino = this.estado[0].sigla;
  }

  public habilitaForm() {
    console.log('opa')
    if (this.cidadePartida !== "Selecione" &&
      this.horaPartida !== "undefined" &&
      this.cidadeDestino !== "Selecione" &&
      this.horaDestino !== "undefined" &&
      this.transporte !== "Selecione...") {
      this.formDeslocamento = ''
    } else {
      this.formDeslocamento = 'disabled'
    }
  }

  adicionarDeslocamento(deslocamentoForm: NgForm): void {

    this.deslocamento.data = this.startDate.toISOString().substring(0, 10);
    this.deslocamento.estadoPartida = this.estadoPartida;
    this.deslocamento.cidadePartida = this.cidadePartida;
    this.deslocamento.horaPartida = this.horaPartida;
    this.deslocamento.estadoDestino = this.estadoDestino;
    this.deslocamento.cidadeDestino = this.cidadeDestino;
    this.deslocamento.horaDestino = this.horaDestino;
    this.deslocamento.meioTransp = this.transporte;
    this.deslocamentoTabela.push(this.deslocamento)
    this.deslocamento = new Deslocamento(this.startDate, '', '', 0, '', '', 0, 1);
    this.cidadePartida = null;
    this.horaPartida = null;
    this.cidadeDestino = null;
    this.horaDestino = null;
    this.transporte = this.meioTrans[0].nome;
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
    this.formDeslocamento = 'disabled';
  }
  set humanDate(e) {
    e = e.split('-');
    let d = new Date(Date.UTC(e[0], e[1] - 1, e[2]));
    this.startDate.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  get humanDate() {
    return this.startDate.toISOString().substring(0, 10);
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

  public delete() {
  }

  handleChange(numero) {
    this.teste = false;
    this.qual = null;
    this.codigoFuncao(numero);
  }

  qualChange(numero) {
    this.teste = true;
    this.codigoFuncao(numero);
  }

  codigoFuncao(numero) {
    switch (numero) {
      case 1:
        this.dgs1 = "X";
        break;
      case 2:
        this.dgs2 = "X";
        break;
      case 3:
        this.dgs3 = "X";
        break;
      case 4:
        this.ftg1 = "X";
        break;
      case 5:
        this.ftg2 = "X";
        break;
      case 6:
        this.ftg3 = "X";
        break;
      case 7:
        this.fg1 = "X";
        break;
      case 8:
        this.fg2 = "X";
        break;
      case 9:
        this.fg3 = "X";
        break;
      case 10:
        this.dgi1 = "X";
        break;
      case 11:
        this.adm3 = "X";
        break;
      case 12:
        this.adm8 = "X";
        break;
      case 13:
        this.outro = "X";
        break;
    }
  }

  public geraPdf() {
    var logo = require('assets/images/logos/brasao.png');
    var doc = new jsPDF('p', 'mm', 'a4');

    doc.addImage(logo, 'PNG', 5, 7, 18, 16)
    doc.setFontSize(9);
    doc.text(10, 29, 'DESCRIÇÃO DO ÓRGÃO/ENTIDADE');
    doc.rect(9, 25, 190, 13);
    doc.setFontSize(10);
    doc.setDrawColor(0)
    doc.text(10, 42, 'SERVIDOR');
    doc.text(73, 50, 'DADOS CADASTRAIS E FUNCIONAIS');
    doc.setFontSize(9);
    doc.setFillColor(205, 205, 205);
    doc.rect(9, 45, 190, 7);
    doc.text(10, 56, 'CPF');
    doc.rect(9, 52, 45, 10);
    doc.text(55, 56, 'NOME COMPLETO');
    doc.rect(9, 52, 141, 10);
    doc.text(151, 56, 'MATRÍCULA-DV-VÍNCULO');
    doc.rect(9, 52, 190, 10);
    doc.text(10, 66, 'LOCAL DE TRABALHO (LOTAÇÃO)');
    doc.rect(9, 62, 95, 10);
    doc.text(105, 66, 'MUNICÍPIO DO LOCAL DE TRABALHO');
    doc.rect(9, 62, 190, 10);
    doc.text(10, 76, 'CARGO/EMPREGO');
    doc.rect(9, 72, 135, 10);
    doc.text(145, 76, 'COMPETÊNCIA');
    doc.rect(144, 72, 55, 10);
    doc.text(10, 86, 'CÓDIGO/NÍVEL DO CARGO/FUNÇÃO OCUPAÇÃO');
    doc.rect(9, 82, 190, 25);
    doc.text(15, 92, 'DGS-1');
    doc.rect(11, 89, 3, 3);

    doc.text(32, 92, 'DGS-2');
    doc.rect(28, 89, 3, 3);

    doc.text(49, 92, 'DGS-3');
    doc.rect(45, 89, 3, 3);

    doc.text(66, 92, 'FTG-1');
    doc.rect(62, 89, 3, 3);

    doc.text(83, 92, 'FTG-2');
    doc.rect(79, 89, 3, 3);

    doc.text(99, 92, 'FTG-3');
    doc.rect(95, 89, 3, 3);

    doc.text(115, 92, 'FG-1');
    doc.rect(111, 89, 3, 3);

    doc.text(129, 92, 'FG-2');
    doc.rect(125, 89, 3, 3);

    doc.text(143, 92, 'FG-3');
    doc.rect(139, 89, 3, 3);

    doc.text(159, 88, 'ADM. SUPERIOR - 3');
    doc.setFontSize(8);
    doc.text(159, 92, '(AGENTE POLITICO)');
    doc.rect(155, 85, 3, 3);
    doc.setFontSize(9);

    doc.text(160, 98, 'ADM. SUPERIOR - 8');
    doc.setFontSize(8);
    doc.text(159, 102, '(NÃO CODIFICADO)');
    doc.rect(155, 95, 3, 3);

    doc.setFontSize(9);
    doc.text(15, 105, 'DGI -1 (CODIFICADO)');
    doc.rect(11, 102, 3, 3);

    doc.text(58, 105, 'OUTRO QUAL?');
    doc.rect(54, 102, 3, 3);

    doc.text(10, 111, 'E-MAIL');
    doc.rect(9, 107, 75, 18);

    doc.text(126, 111, 'DADOS BANCÁRIOS');
    doc.rect(84, 107, 115, 6);

    doc.text(85, 117, 'BANCO');
    doc.rect(84, 113, 40, 12);

    doc.text(125, 117, 'AGÊNCIA');
    doc.rect(124, 113, 35, 12);

    doc.text(160, 117, 'NÚMERO DA CONTA');
    doc.rect(159, 113, 40, 12);
    doc.setFontSize(10);
    //primeira linha
    doc.text(10, 61, this.cpf);
    doc.text(55, 61, this.nome);
    doc.text(151, 61, this.matricula);
    doc.text(10, 71, this.local);
    doc.text(105, 71, this.municipio);
    doc.text(9, 81, this.cargo);
    doc.setFontSize(11);
    doc.text(11, 92, this.dgs1);
    doc.text(28, 92, this.dgs2);
    doc.text(45, 92, this.dgs3);
    doc.text(62, 92, this.ftg1);
    doc.text(79, 92, this.ftg2);
    doc.text(96, 92, this.ftg3);
    //doc.text(145, 76, this.competência);
    // 
    //segunda linha
    // 
    //  d
    //  doc.text(116, 45, this.vinculo);
    // doc.text(150, 45, this.grupo);
    //terceira linha
    //  doc.text(10, 55, this.local);
    //  doc.text(90, 55, this.municipio);
    //quarta  linha
    //   doc.text(10, 65, this.banco);
    //   doc.text(75, 65, this.agencia);
    //  doc.text(135, 65, this.conta);
    // final retangulo dados pessoais
    doc.setFontSize(10);
    doc.text(85, 130, 'DESLOCAMENTOS');
    doc.rect(159, 113, 40, 12);

    var options = {
      theme: 'grid',
      margin: {
        top: 131,
        left: 9

      },
    };
    var columns = ["DATA", "DE", "HORÁRIO", "PARA", "HORÁRIO", "MEIO DE TRANSPORTE"]
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
    let finalY = doc.autoTable.previous.finalY + 4;

    //  doc.text(10, finalY, '(*)No caso de uso de passagens é obrigatória a devolução dos respectivos bilhetes.');
    doc.text(85, finalY + 1, 'OBJETIVO(S) DA VIAGEM');
    doc.text(11, finalY + 5, this.objDaViagem);
    doc.setDrawColor(0)
    doc.rect(9, finalY + 2, 187, 12);
    //doc.text(10, finalY + 30, 'DECLARAÇÃO DO SERVIDOR OU RESPONSÁVEL');
    doc.text(10, finalY + 18, 'Declaro, ainda que não me enquadro em qualquer das situções impeditivas para o recebimento de diárias');
    doc.rect(9, finalY + 14, 187, 5);
    doc.text(10, finalY + 41, 'LOCAL E DATA');
    doc.rect(9, finalY + 38, 100, 12);
    doc.text(110, finalY + 41, 'IDENTIFICAÇÃO E ASSINATURA');
    doc.rect(109, finalY + 38, 87, 12);
    doc.text(10, finalY + 54, 'AUTORIZAÇÃO DA CHEFIA IMEDIATA ');
    doc.rect(9, finalY + 55, 100, 12);
    doc.text(110, finalY + 54, 'AUTORIZAÇÃO DA DIRETORIA ');
    doc.rect(109, finalY + 55, 87, 12);
    doc.setFontSize(9);
    doc.text(10, finalY + 71, 'AUTORIZAÇÃO DA DIRETORIA RESPONSÁVEL PELO PAGAMENTO DE DIÁRIAS (DIRETORIA GERAL OU EQUIVALENTE)');

    doc.text(10, finalY + 76, 'IDENTIFICAÇÃO E ASSINATURA');
    doc.rect(9, finalY + 73, 110, 12);

    doc.text(120, finalY + 76, 'DATA');
    doc.rect(119, finalY + 73, 45, 12);

    doc.text(165, finalY + 76, 'HORÁRIO');
    doc.rect(164, finalY + 73, 32, 12);

    doc.text(10, finalY + 89, 'RECEBIMENTO DO FORMULÁRIO PELA GERÊNCIA OU SETOR RESPONSÁVEL PELO PAGAMENTO DAS DIÁRIAS')
    doc.text(10, finalY + 93, '(GERÊNCIA DE ADMINISTRAÇÃO OU ONDE ESTEJA LOTADO O CARGO DO DETENTOR DO ADIANTAMENTO)');

    doc.text(10, finalY + 97, 'IDENTIFICAÇÃO E ASSINATURA');
    doc.rect(9, finalY + 94, 110, 12);

    doc.text(120, finalY + 97, 'DATA');
    doc.rect(119, finalY + 94, 45, 12);

    doc.text(165, finalY + 97, 'HORÁRIO');
    doc.rect(164, finalY + 94, 32, 12);

    doc.text(10, finalY + 110, 'DIÁRIAS A PAGAR (PREENCHIMENTO PELO DETENTOR DO ADIANTAMENTO)');


    var options1 = {
      theme: 'grid',
      margin: {
        top: finalY + 112,
        left: 9

      },
    };
    var columns = ["DESLOCAMENTO                 ", "QUANTIDADE", "DIÁRIA VALOR", "TOTAL POR TIPO"]
    var linha = [
      ['', "", "", ""],
      ['', "", "  ", ""],
      ["                        TOTAL", "   ", "   ", ""]

    ];

    doc.autoTable(columns, linha, options1, );

    doc.text(10, finalY + 150, '  PAGAS POR MEIO DO CHEQUE BANCO DO BRASIL NÚMERO:');
    doc.rect(9, finalY + 142, 187, 10);
    doc.setDrawColor(0);
    doc.text(10, finalY + 156, 'LEMBRETE');
    doc.rect(9, finalY + 157, 187, 12);
    doc.setFontSize(8);
    doc.text(9, finalY + 160, '- AS SOLICITAÇÃOES QUE DESATENDEREM AO QUE É SOLICITADO NÃO DEVEM SER PAGAS.')
    doc.text(9, finalY + 164, '- OBTER,JUNTO AO DETENTOR DO ADIANTAMENTO, O NÚMERO DA CONTA PARA DEPÓSITO IMEDIATO DOS VALORES E RECEBIDOS');
    doc.text(9, finalY + 168, ' INDEVIDAMENTE OU A MAIOR.');


    //iframe mosta pdf
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }

}








