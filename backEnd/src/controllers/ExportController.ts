import { Request, Response } from "express";
import { Between, ILike } from "typeorm";
import { Events } from "../models/Events";
import * as nodemailer from "nodemailer";
import * as puppeteer from "puppeteer";

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
        <h1>Lista de usuários</h1>
      <table border="1">`;

      let servicos: Events[] = await Events.find({

        where: {
          startDate: Between(dataStart, dataEnd),
          endDate: Between(dataStart, dataEnd)
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
      html += `<div>Gerado por: Juca às ${data}</div>`;

    }
    return res.status(200).json({ message: "PDF enviado" })
  }

  static async pdf(html: string) {
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

    let users: Events[] = await Events.findBy({
      name: name ? ILike(`${name}`) : undefined,
    });

    let header = '"ID";"nome";"Email"\n';
    let csv = header;

    users.forEach((element) => {
      csv += `"${element.id}";"${element.name}";"${element.startDate}";"${element.endDate}"\r`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("usuarios.csv");
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