import { Request, Response } from "express";
import { Between, ILike } from "typeorm";
import { Events } from "../models/Events";
import * as nodemailer from "nodemailer";
import * as puppeteer from "puppeteer";
import { Clients } from "../models/Clients";

export class ExportController {
  async downloadPdf(req: Request, res: Response) {
    let body = req.body;
    let html: string = '';

    let dataStart = body.dataStart;
    let dataEnd = body.dataEnd;
    let type: any = body.type;
    let id = body.id;

    if (type = typeof Events) {
      let event = Events.findOneBy({ id: id });
      if (!event) {
        return res.status(404).json({ mensagem: "Evento não encontrado" });
      }
      type = event;


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
        <h1>Lista eventos</h1>
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
        html += `<tr>
        <td>${element.id}</td>
        <td>${element.user}</td>
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
      html += `<div>Gerado por: Juca às ${data}</div>`;

    }
    let pdf = await ExportController.pdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=seu_arquivo.pdf');
    res.send(pdf);

    return res.status(200)
  }

  async sendPdfPresence(req: Request, res: Response) {
    let body = req.body;
    let html: string = '';

    let client: Clients | any = Clients.findOneBy({ id: body.clientId })
    let dataStart = body.dataStart;
    let dataEnd = body.dataEnd;
    let type: any = body.type;
    let id = body.id;

    if (!client) {
      return res.status(400).json({ message: "Cliente não encontrado" })
    }

    if (type = typeof Events) {
      let event = Events.findOneBy({ id: id });
      if (!event) {
        return res.status(404).json({ mensagem: "Evento não encontrado" });
      }
      type = event;


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
        <h1>Comprovante de presença no evento:</h1>
      <table border="1">`;

      let servicos: Events[] = await Events.find({

        where: {
          clientsPresence: client
        }
      });
      html += `<tr>
      <th>Id</th>
      <th>Usuário</th>
      <th>Nome</th>
      <th>Descrição</th>
      <th>Endereço</th>
      <th>Data de entrada</th>
      <th>Data de saida</th>
      <th>Situação<th></tr>`;
      servicos.forEach((element) => {
        html += `<tr>
        <td>${element.id}</td>
        <td>${element.user}</td>
        <td>${element.name}</td>
        <td>${element.description}</td>
        <td>${element.address}</td>
        <td>${element.startDate}</td>
        <td>${element.endDate}</td>
        <td>${element.situation}</td></tr>\r`;
      });
      html += "</table>";
      let today = new Date(Date.now());
      let data = today.toLocaleString(); // "30/1/2022"
      html += `<div>Gerado por: ${client.name} às ${data}</div>`;

    }
    return res.status(200).json({ message: "PDF enviado" })
  }

  static async pdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(html);
    console.log("hello")
    const pdfBuffer = await page.pdf();
    await page.close();
    await browser.close();

    return pdfBuffer;
  }
  async listCsv(req: Request, res: Response): Promise<Response> {
    let name = req.query.name;

    let event: Events[] = await Events.findBy({
      name: name ? ILike(`${name}`) : undefined,
    });

    let header = '"ID";"nome";"Descrição";"Preço";"Endereço";"Inicio";"Fim";"Categoria";"Status"\n';
    let csv = header;

    event.forEach((element) => {
      csv += `"${element.id}";"${element.description}";"${element.name}";"${element.price}";"${element.address}";"${element.startDate}";"${element.endDate};"${element.type}";"${element.situation}""\r`;
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
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
      auth: {
        user: "oficina.crieti@hotmail.com",
        pass: process.env.PASS,
      },
    };

    let mailOptions = {
      from: process.env.USER,
      to: body.email,
      subject: "Bem vindo ao Crie_TI eventos",
      html: `Estamo muito felizes em ter você conosco${body.name}!`,
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

}