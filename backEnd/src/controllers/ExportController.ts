import { Request, Response } from "express";
import { Between, ILike } from "typeorm";
import { Events } from "../models/Events";
import * as nodemailer from "nodemailer";
import * as puppeteer from "puppeteer";
import { Clients } from "../models/Clients";
import { Tickets } from "../models/Tickets";

export class ExportController {
  async downloadPdf(req: Request, res: Response) {
    let body = req.body;
    let html: string = '';
    let name;

    html = `<style>
        *{
          font-family: "Arial";
        }
        table{
          width:100%;
          text-align: left;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        table td{
          padding: 10px
        }
        table th{
          padding: 10px
        }
        </style>
        <h1>Relatório de Eventos</h1>
      <table border="1">`;

    let events: Events[] = await Events.find();
    html += `<tr>
      <th>Id</th>
      <th>Usuário</th>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Descrição</th>
      <th>Preço</th>
      <th>Endereço</th>
      <th>Data de entrada</th>
      <th>Data de saida</th>
      <th>Situação<th></tr>`;
    events.forEach((element) => {
      name = element.name
      html += `<tr>
        <td>${element.id}</td>
        <td>${element?.user?.name}</td>
        <td>${element.name}</td>
        <td>${element.type}</td>
        <td>${element.description}</td>
        <td>${element.price}</td>
        <td>${element.address}</td>
        <td>${element.startDate}</td>
        <td>${element.endDate}</td>
        <td>${element.situation}</td></tr>\r`;
    });
    html += "</table>";
    let today = new Date(Date.now());
    let data = today.toLocaleString(); // "30/1/2022"
    html += `<div>Gerado por: ${name} às ${data}</div>`;

    let pdf = await ExportController.pdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=seu_arquivo.pdf');
    res.send(pdf);

    return res.status(200)
  }

  async sendPdfPresence(req: Request, res: Response) {
    let body = req.body;
    let html: string = '';

    let id = Number(req.params.id);

    let client: Clients | any = await Clients.findOneBy({ id: id });

    id = Number(req.params.event)

    let event: Events | any = await Events.findOneBy({ id: id })

    html = `<style>
        *{
          font-family: "Arial";
        }
        table{
          width:100%;
          text-align: left;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        table td{
          padding: 10px
        }
        table th{
          padding: 10px
        }
        </style>
        <h1>Comprovante de comparecimento</h1>
      <table border="1">`;

    let ticket: Tickets | any = await Tickets.findOne({
      where: {
        client: {
          id: client.id
        },
        event: {
          id: event.id
        }
      }
    });

    html += `<tr>
      <th>Nome</th>
      <th>Evento</th>
      <th>Data</th>
      <th>Presente</th>`;

    let ok = "Esteve presente neste evento"
    html += `<tr>
        <td>${ticket.client.name}</td>
        <td>${ticket.event.name}</td>
        <td>${ticket.event.startDate}</td>
        
        <td>${ok}</td>`;

    html += "</table>";
    let today = new Date(Date.now());
    let data = today.toLocaleString();
    html += `<div>Gerado por: ${client.name} às ${data}</div>`;

    let pdf = await ExportController.pdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=seu_arquivo.pdf');
    res.send(pdf);

    return res.status(200);
  }

  static async pdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(html);

    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    return pdfBuffer;
  }

  async listCsv(req: Request, res: Response): Promise<Response> {
    let name = req.query.name;

    let events: Events[] = await Events.find();

    let header = '"ID";"nome";"Descrição";"Preço";"Endereço";"Inicio";"Fim";"Categoria";"Status"\n';
    let csv = header;
    console.log(events.length)

    events.forEach((element) => {
      csv += `"${element.id}";"${element.description}";"${element.name}";"${element.price}";"${element.address}";"${element.startDate}";"${element.endDate};"${element.type}";"${element.situation}"\r`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("eventos.csv");
    return res.status(200).send(csv);
  }

  async sendEmailWelcome(req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let emailConfig = {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
      auth: {
        user: "atur.albernas2002@outlook.com",
        pass: process.env.PASS,
      },
    };

    let mailOptions = {
      from: "atur.albernas2002@outlook.com",
      to: body.email,
      subject: "Bem vindo ao Crie_TI eventos",
      html: `Estamos muito felizes em ter você conosco${body.name}!`,
    };

    let transporter = nodemailer.createTransport(emailConfig);

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log("Erro ao enviar email:" + error);
        return res.status(401).send("Erro ao enviar email" + error);
      } else {
        console.log("Email enviado: " + info.response);
        return res.status(200).send("Email enviado: " + info.response);
      }
    });

    return res.status(401);
  }

  async sendEmailBuy(req: Request, res: Response): Promise<Response> {
    let event: Events = res.locals.event;
    let client: Clients = res.locals.client;

    let emailConfig = {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "atur.albernas2002@outlook.com",
        pass: "Turilalaguto2002",
      },
      tls: {
        ciphers: "SSLv3",
      },
    };

    let mailOptions = {
      from: "atur.albernas2002@outlook.com",
      to: client.email,
      subject: "Crie_TI eventos agradece a preferência",
      html: `Estamos muito felizes em contar com você ${client.name} no evento ${event.name}!`,
    };

    let transporter = nodemailer.createTransport(emailConfig);
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log("Erro ao enviar email:" + error);
        return res.status(401).send("Erro ao enviar email" + error);
      } else {
        console.log("Email enviado: " + info.response);
        return res.status(200);
      }
    });

    return res.status(200);
  }
}