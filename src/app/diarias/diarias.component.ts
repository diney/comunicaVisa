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
  teste: any
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
    if (this.cidadePartida !== "undefined" &&
      this.horaPartida !== "undefined" &&
      this.cidadeDestino !== "undefined" &&
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
  //update user
  public atualizaCargo(cargo: string): void {
    this.cargo = cargo;
  }
  public atualizaMatricula(matricula: string): void {
    this.matricula = matricula;
  }
  public atualizaVinculo(vinculo: string): void {
    this.vinculo = vinculo;
  }
  public atualizaGrupo(grupo: string): void {
    this.grupo = grupo;
  }
  public atualizaLocal(local: string): void {
    this.local = local;
  }
  public atualizaMunicipio(municipio: string): void {
    this.municipio = municipio;
  }
  public atualizaBanco(banco: string): void {
    this.banco = banco;
  }
  public atualizaAgencia(agencia: string): void {
    this.agencia = agencia;
  }
  public atualizaConta(conta: string): void {
    this.conta = conta;
  }

  public atualizaObjViagem(objDaViagem: string): void {

    this.objDaViagem = objDaViagem;
    console.log(objDaViagem)
  }

  public atualizaCidadePartida(cidadePartida: string): void {
    this.cidadePartida = cidadePartida;
    if (this.cidadePartida.length > 0) {
      this.cidadePartida = cidadePartida;
    } else {
      this.cidadePartida = "undefined";
    }
    this.habilitaForm()
  }

  public atualizaMeioTranp(meioTransp: string): void {
    this.transporte = meioTransp;
    if (this.transporte.length > 0) {
      this.transporte = meioTransp;
    } else {
      this.transporte = "undefined";
    }
    this.habilitaForm()
  }

  public atualizaHp(horaPartida: string): void {
    this.horaPartida = horaPartida
    if (this.horaPartida.length > 0) {
      this.horaPartida = horaPartida;
    } else {
      this.horaPartida = "undefined";
    }
    this.habilitaForm()
  }
  public atualizaCidadeDestino(cidadeDestino: string): void {
    this.cidadeDestino = cidadeDestino;
    if (this.cidadeDestino.length > 0) {
      this.cidadeDestino = cidadeDestino;
    } else {
      this.cidadeDestino = "undefined";
    }
    this.habilitaForm()
  }

  public atualizaHd(horaDestino: string): void {
    this.horaDestino = horaDestino
    if (this.horaDestino.length > 0) {
      this.horaDestino = horaDestino;
    } else {
      this.horaDestino = "undefined";
    }
    this.habilitaForm()
  }

  public geraPdf() {
    var logo = require('assets/images/logos/brasao.png');
    var doc = new jsPDF('p', 'mm', 'a4');
    //pega tabela 
    //var res = doc.autoTableHtmlToJson(document.getElementById("table"));

    doc.addImage(logo, 'PNG', 5, 7, 18, 16)
    doc.setFontSize(12);

    doc.setFont("helvetica");
    doc.setFontType("bold");
    doc.text(23, 20, 'Estado de Santa Catarina');
    doc.text(150, 20, 'Solicitação de Diárias');
    doc.setDrawColor(0)
    //primeira linha
    doc.text(10, 30, 'Nome');
    doc.rect(9, 26, 141, 10);

    doc.text(151, 30, 'CPF');
    doc.rect(150, 26, 45, 10);
    //segunda linha
    doc.text(10, 40, 'Cargo/Emprego');
    doc.rect(9, 36, 66, 10);

    doc.text(76, 40, 'Matricula');
    doc.rect(75, 36, 40, 10);

    doc.text(116, 40, 'Vínculo');
    doc.rect(115, 36, 45, 10);

    doc.text(161, 40, 'Grupo');
    doc.rect(160, 36, 35, 10);

    //terceira linha
    doc.text(10, 50, 'Local do Exercicio');
    doc.rect(9, 46, 80, 10);

    doc.text(90, 50, 'Município');
    doc.rect(89, 46, 106, 10)
    //quarta  linha
    doc.text(10, 60, 'Banco');
    doc.rect(9, 56, 65, 10);

    doc.text(75, 60, 'Agência(com dígito)');
    doc.rect(74, 56, 60, 10);

    doc.text(135, 60, 'Conta Corrente (com dígito)');
    doc.rect(134, 56, 61, 10);



    doc.setFontSize(10);


    //primeira linha
    doc.text(10, 35, this.nome);
    doc.text(151, 35, this.cpf);
    //segunda linha
    doc.text(10, 45, this.cargo);
    doc.text(76, 45, this.matricula);
    doc.text(116, 45, this.vinculo);
    doc.text(150, 45, this.grupo);
    //terceira linha
    doc.text(10, 55, this.local);
    doc.text(90, 55, this.municipio);
    //quarta  linha
    doc.text(10, 65, this.banco);
    doc.text(75, 65, this.agencia);
    doc.text(135, 65, this.conta);
    // final retangulo dados pessoais
    doc.text(10, 71, 'DESLOCAMENTOS');



    var options = {
      theme: 'grid',
      margin: {
        top: 72,
        left: 9

      },
    };
    var columns = ["DATA", "CIDADE PARTIDA", "HORÁRIO", "CIDADE DESTINO", "HORÁRIO", "MEIO DE TRANSPORTE"]
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

    doc.text(10, finalY, '(*)No caso de uso de passagens é obrigatória a devolução dos respectivos bilhetes.');
    doc.text(10, finalY + 5, 'OBJETIVO DA VIAGEM');
    doc.text(11, finalY + 10, this.objDaViagem);
    doc.setDrawColor(0)
    doc.rect(9, finalY + 6, 187, 20);
    doc.text(10, finalY + 30, 'DECLARAÇÃO DO SERVIDOR OU RESPONSÁVEL');
    doc.text(10, finalY + 36, 'Declaro, ainda que não me enquadro em qualquer das situções impeditivas para o recebimento de diárias');
    doc.rect(9, finalY + 32, 187, 5);
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


    //iframe mosta pdf
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }
  public delete() {
  }
}








