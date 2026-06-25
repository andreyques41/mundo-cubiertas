import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
      port: Number(this.config.get('SMTP_PORT', '587')),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async enviarCotizacion(params: {
    destinatario: string;
    nombreCliente: string;
    idCotizacion: number;
    pdfBuffer: Buffer;
  }): Promise<void> {
    const from = this.config.get('EMAIL_FROM', 'Mundo Cubiertas <no-reply@mundocubiertas.com>');

    await this.transporter.sendMail({
      from,
      to: params.destinatario,
      subject: `Tu cotización #${params.idCotizacion} — Mundo Cubiertas`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Hola, ${params.nombreCliente}</h2>
          <p>Adjunto encontrás tu cotización <strong>#${params.idCotizacion}</strong> de <strong>Mundo Cubiertas</strong>.</p>
          <p>Si tenés alguna duda o querés ajustar algo, no dudes en contactarnos por WhatsApp.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Mundo Cubiertas · Costa Rica</p>
        </div>
      `,
      attachments: [
        {
          filename: `cotizacion-${params.idCotizacion}.pdf`,
          content: params.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    this.logger.log(`Email enviado a ${params.destinatario} para cotización #${params.idCotizacion}`);
  }
}
