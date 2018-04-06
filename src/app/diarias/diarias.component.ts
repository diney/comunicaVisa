import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Deslocamento } from './deslocamento.model'
import { NgForm } from "@angular/forms";
import { ESTADO } from './estadoCidade-mock'
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { DiariaService } from "../diaria.service";

import { ChatService } from './../chat.service';
//var pdfMake = require('pdfmake/build/pdfmake.js');
//var pdfFonts = require('pdfmake/build/vfs_fonts.js');
let jsPDF = require('jspdf');
let rasterizeHTML = require('rasterizeHTML');

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-diarias',
  templateUrl: './diarias.component.html',
  styleUrls: ['./diarias.component.css'],
  providers: [DiariaService]
})
export class DiariasComponent implements OnInit {


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

  meioTrans = [
    { nome: 'Selecione...' },
    { nome: 'VEÍCULO OFICIAL' },
    { nome: 'VEÍCULO PRÓPRIO' },
    { nome: 'ÔNIBUS' },
    { nome: 'AVIÃO' }
  ];

  deslocamento = new Deslocamento(this.startDate, '', 'cidadePartida', 0, 'estadoDestino', 'cidadeDestino', 0, 1)

  private subjectPesquisa: Subject<string> = new Subject<string>()

  estado: Array<any> = ESTADO
  cidadesPartida: Array<any> = [];
  cd: Array<any> = [];
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

    //this.teste= true;
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
    })


    this.transporte = this.meioTrans[0].nome;
    this.estadoPartida = this.estado[0].sigla;
    this.estadoDestino = this.estado[0].sigla;
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

  public teste1(): void {
    var logo = require('assets/images/logos/brasao.png');

    var doc = new jsPDF();
    doc.addImage(logo, 'PNG', 5, 10, 18, 16)
    doc.setFontSize(12);
    doc.text(23, 20, 'Estado de Santa Catarina');
    doc.text(150, 20, 'Solicitação de Diárias');
    doc.text(10, 33, 'Nome');
    doc.text(150, 33, 'CPF');
    doc.text(10, 50, 'Cargo/Emprego');
    doc.text(50, 50, 'Matricula');
    doc.text(90, 50, 'Vínculo');
    doc.text(150, 50, 'Grupo');
    doc.text(10, 60, 'Local do Exercicio');
    doc.text(90, 60, 'Município');
    doc.text(10, 70, 'Banco');
    doc.text(65, 70, 'Agência(com dígito)');
    doc.text(150, 70, 'Conta Corrente (com dígito)');


    //set fonte  value do obj
    doc.setFont("times");
    doc.setFontType("italic");

    doc.text(10, 40, this.nome);
    doc.text(150, 40, this.cpf);
    doc.text(10, 55, this.cargo);
    doc.text(50, 55, this.matricula);
    doc.text(90, 55, this.vinculo);
    doc.text(150, 55, this.grupo);
    doc.text(10, 65, this.local);
    doc.text(90, 65, this.municipio);
    doc.text(10, 75, this.banco);
    doc.text(65, 75, this.agencia);
    doc.text(150, 75, this.conta)


    doc.addPage(); // add new page in pdf  
    // doc.setTextColor(165, 0, 0);
    //doc.text(150, 20, 'extra page to write');

    doc.save('katara.pdf'); // Save the PDF with name "katara"...  

    // doc.setFont("courier");
    //var element = document.getElementById('customers');
    //var options = {
    //pagesplit: true,
    // background: '#f8f8ff' 
    //  }
    // doc.fromHTML(element, options, function() {
    // doc.autoPrint();
    // doc.save('web.pdf');



  }



  // $(document).ready(function(){
  // $('#btnPDF').click(function() {
  //  savePDF(document.querySelector('#customers'));
  //});
  //});

  //function savePDF(codigoHTML) {
  //var doc = new jsPDF('portrait', 'pt', 'a4'),
  ///  data = new Date();
  //var margins = {
  // top: 20,
  //bottom: 20,
  // left: 20,
  // width: 1000
  // };
  //doc.fromHTML(codigoHTML,
  //      margins.left, // x coord
  //     margins.top, { pagesplit: true },
  ///     function(dispose){
  // doc.save("Relatorio - "+data.getDate()+"/"+data.getMonth()+"/"+data.getFullYear()+".pdf");
  //});
  //}

  //var doc = new jsPDF('p', 'pt', 'letter');
  //doc.canvas.height = 72 * 11;
  //doc.canvas.width = 72 * 8.5;
  //doc.setFont("courier");

  //var element = document.getElementById('customers');
  //var options = {
  //	pagesplit: true,
  //background: '#fff',  
  //}
  //doc.addHTML(element, options, function() {
  // doc.save('web.pdf');



  // })
  //  }


  //var pdf = new jsPDF('p', 'pt', 'letter');
  //pdf.canvas.height = 72 * 11;
  // pdf.canvas.width = 72 * 8.5;

  //pdf.addHTML(document.body);

  // pdf.save('test.pdf');

  //var doc = new jsPDF('p', 'pt', 'letter');


  ///doc.fromHTML(element, options, document.getElementById('table'),function() {

  //  doc.save('web.pdf')
  //}
  //)

  public buildTableBody(data, columns) {
    var body = [];

    body.push(columns);
    for (var row of data) {
      var dataRow = [];
      for (var column of columns) {

        dataRow.push(row, column);
      }

      body.push(dataRow);
    };

    return body;
  }

  public table(data, columns) {

    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns)
      }
    };
  }







}
