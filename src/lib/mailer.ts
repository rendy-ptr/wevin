import {
  getDeletionNotificationEmailHtml,
  getStatusNotificationEmailHtml,
  getUpdateNameAndEmailNotificationEmailHtml,
  getUpdateNotificationEmailHtml,
  getUpdatePasswordNotificationEmailHtml,
  getWelcomeEmailHtml,
} from '@/templates/email.template';
import { TUser, TUserStatus } from '@/types/user.type';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

export const sendAccountEmail = async (
  email: string,
  name: string,
  plainPassword: string,
  packageName: string,
) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/login`;

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject: 'Akun Member Wevin Anda Telah Dibuat',
    html: getWelcomeEmailHtml({
      name,
      email,
      plainPassword,
      loginUrl,
      packageName,
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email pendaftaran sukses terkirim ke ${email}`);
  } catch (error) {
    console.error(`[MAILER] Gagal mengirim email ke ${email}:`, error);
  }
};

export const sendUpdateNameAndPackageNotificationEmail = async (
  email: string,
  name: string,
  packageName: string,
) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/login`;

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject: 'Update Profil Member Wevin',
    html: getUpdateNotificationEmailHtml({ name, loginUrl, packageName }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email update sukses terkirim ke ${email}`);
  } catch (error) {
    console.error(`[MAILER] Gagal mengirim email update ke ${email}:`, error);
  }
};

export const sendDeletionNotificationEmail = async (
  email: string,
  name: string,
) => {
  const subscribeUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`;

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject: 'Akun Member Wevin Anda Telah Dihapus',
    html: getDeletionNotificationEmailHtml({ name, subscribeUrl }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email penghapusan sukses terkirim ke ${email}`);
  } catch (error) {
    console.error(
      `[MAILER] Gagal mengirim email penghapusan ke ${email}:`,
      error,
    );
  }
};

export const sendStatusNotificationEmail = async (
  email: string,
  name: string,
  status: TUserStatus,
) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/login`;
  const subject =
    status === 'active'
      ? 'Akun Member Wevin Anda Telah Diaktifkan'
      : 'Informasi Penonaktifan Akun Member Wevin';

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject,
    html: getStatusNotificationEmailHtml({ name, status, loginUrl }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `[MAILER] Email status (${status}) sukses terkirim ke ${email}`,
    );
  } catch (error) {
    console.error(`[MAILER] Gagal mengirim email status ke ${email}:`, error);
  }
};

export const sendUpdatePasswordNotificationEmail = async ({
  email,
  name,
}: Pick<TUser, 'email' | 'name'>) => {
  const subscribeUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`;

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject: 'Notifikasi Perubahan Password Akun Wevin',
    html: getUpdatePasswordNotificationEmailHtml({
      name,
      subscribeUrl,
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `[MAILER] Email notifikasi ganti password sukses terkirim ke ${email}`,
    );
  } catch (error) {
    console.error(
      `[MAILER] Gagal mengirim email notifikasi ganti password ke ${email}:`,
      error,
    );
  }
};

export const sendUpdateNameAndEmailNotificationEmail = async ({
  email,
  name,
}: Pick<TUser, 'email' | 'name'>) => {
  const subscribeUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`;

  const mailOptions = {
    from: `"Admin Wevin" <${process.env.SMTP_FROM || 'admin@wevin.local'}>`,
    to: email,
    subject: 'Notifikasi Perubahan Nama dan Email Akun Wevin',
    html: getUpdateNameAndEmailNotificationEmailHtml({
      name,
      subscribeUrl,
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `[MAILER] Email notifikasi ganti nama dan email sukses terkirim ke ${email}`,
    );
  } catch (error) {
    console.error(
      `[MAILER] Gagal mengirim email notifikasi ganti nama dan email ke ${email}:`,
      error,
    );
  }
};
