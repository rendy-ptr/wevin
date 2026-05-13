import { USER_STATUS } from '@/constants/user.constant';
import { TUserStatus } from '@/types/user.type';

export const getWelcomeEmailHtml = ({
  name,
  email,
  plainPassword,
  loginUrl,
  packageName,
}: {
  name: string;
  email: string;
  plainPassword: string;
  loginUrl: string;
  packageName: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f4; font-family: 'DM Sans', Arial, sans-serif; color: #2e2e2e; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #e8d5cc; max-width: 600px;">

              <tr>
                <td align="center" style="padding: 45px 0 25px 0; background-color: #ffffff;">
                  <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 600; color: #8b5e6a; letter-spacing: 1.5px;">Wevin</h1>
                  <p style="margin: 6px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #c9a0a0; font-style: italic; letter-spacing: 0.5px;">Digital Wedding Invitation</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 45px 45px 45px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 500; color: #2e2e2e;">Selamat Datang, ${name}!</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Akun member Wevin Anda telah berhasil dibuat. Saat ini Anda sudah bisa masuk ke dalam <em>dashboard</em> untuk mulai mengatur undangan pernikahan digital Anda.
                  </p>
                  <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Berikut adalah detail akses login Anda:
                  </p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5eae6; border-radius: 8px; border: 1px solid #e8d5cc; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #7a7069;"><strong>Paket:</strong> <span style="color: #2e2e2e;">${packageName}</span></p>
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #7a7069;"><strong>Email:</strong> <span style="color: #2e2e2e;">${email}</span></p>
                        <p style="margin: 0; font-size: 14px; color: #7a7069;"><strong>Password Sementara:</strong>
                          <span style="font-family: monospace; font-size: 16px; letter-spacing: 1px; color: #8b5e6a; background: #ffffff; padding: 5px 10px; border-radius: 4px; border: 1px solid #e8d5cc; margin-left: 5px; display: inline-block;">${plainPassword}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 35px 0; font-size: 13px; line-height: 1.6; color: #c0625a; font-style: italic; text-align: center;">
                    * Demi keamanan, kami sangat menyarankan Anda untuk segera mengganti password ini setelah berhasil login.
                  </p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${loginUrl}" style="display: inline-block; background-color: #c9a0a0; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; padding: 15px 36px; border-radius: 30px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(201, 160, 160, 0.3);">Login ke Dashboard</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #8b5e6a; border-radius: 0 0 12px 12px;">
                  <p style="margin: 0; font-size: 13px; color: #f5eae6; letter-spacing: 0.5px;">
                    Pesan ini dikirimkan otomatis oleh sistem <strong style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; color: #ffffff;">Wevin</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getUpdateNotificationEmailHtml = ({
  name,
  loginUrl,
  packageName,
}: {
  name: string;
  loginUrl: string;
  packageName: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f4; font-family: 'DM Sans', Arial, sans-serif; color: #2e2e2e; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #e8d5cc; max-width: 600px;">

              <tr>
                <td align="center" style="padding: 45px 0 25px 0; background-color: #ffffff;">
                  <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 600; color: #8b5e6a; letter-spacing: 1.5px;">Wevin</h1>
                  <p style="margin: 6px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #c9a0a0; font-style: italic; letter-spacing: 0.5px;">Digital Wedding Invitation</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 45px 45px 45px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 500; color: #2e2e2e;">Halo, ${name}!</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Kami ingin memberitahu Anda bahwa data profil member Anda telah berhasil diperbarui.
                  </p>
                  <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Berikut adalah ringkasan data terbaru Anda:
                  </p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5eae6; border-radius: 8px; border: 1px solid #e8d5cc; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #7a7069;"><strong>Nama:</strong> <span style="color: #2e2e2e;">${name}</span></p>
                        <p style="margin: 0; font-size: 14px; color: #7a7069;"><strong>Paket Saat Ini:</strong> <span style="color: #2e2e2e;">${packageName}</span></p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Anda bisa memeriksa perubahan tersebut dengan masuk ke dashboard Anda melalui tombol di bawah ini:
                  </p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${loginUrl}" style="display: inline-block; background-color: #c9a0a0; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; padding: 15px 36px; border-radius: 30px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(201, 160, 160, 0.3);">Ke Dashboard Saya</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.7; color: #7a7069; text-align: center;">
                    Jika Anda merasa tidak melakukan perubahan ini, harap hubungi tim support kami segera.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #8b5e6a; border-radius: 0 0 12px 12px;">
                  <p style="margin: 0; font-size: 13px; color: #f5eae6; letter-spacing: 0.5px;">
                    Pesan ini dikirimkan otomatis oleh sistem <strong style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; color: #ffffff;">Wevin</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getDeletionNotificationEmailHtml = ({
  name,
  subscribeUrl,
}: {
  name: string;
  subscribeUrl: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f4; font-family: 'DM Sans', Arial, sans-serif; color: #2e2e2e; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #e8d5cc; max-width: 600px;">

              <tr>
                <td align="center" style="padding: 45px 0 25px 0; background-color: #ffffff;">
                  <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 600; color: #8b5e6a; letter-spacing: 1.5px;">Wevin</h1>
                  <p style="margin: 6px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #c9a0a0; font-style: italic; letter-spacing: 0.5px;">Digital Wedding Invitation</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 45px 45px 45px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 500; color: #2e2e2e;">Halo, ${name}</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Kami ingin menginformasikan bahwa akun member Wevin Anda telah resmi dihapus dari sistem kami.
                  </p>

                  <div style="background-color: #fff5f5; border-left: 4px solid #c0625a; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #c0625a;">
                      <strong>Penting:</strong> Seluruh data undangan dan profil Anda kini tidak lagi dapat diakses.
                    </p>
                  </div>

                  <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Jika penghapusan ini merupakan kesalahan atau Anda tidak merasa melakukannya, harap hubungi Admin kami segera. Namun, jika Anda ingin kembali menggunakan layanan kami, Anda dapat melakukan pendaftaran/langganan paket kembali.
                  </p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${subscribeUrl}" style="display: inline-block; background-color: #c9a0a0; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; padding: 15px 36px; border-radius: 30px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(201, 160, 160, 0.3);">Lihat Paket Langganan</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.7; color: #7a7069; text-align: center;">
                    Terima kasih telah sempat menjadi bagian dari Wevin.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #8b5e6a; border-radius: 0 0 12px 12px;">
                  <p style="margin: 0; font-size: 13px; color: #f5eae6; letter-spacing: 0.5px;">
                    Pesan ini dikirimkan otomatis oleh sistem <strong style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; color: #ffffff;">Wevin</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getStatusNotificationEmailHtml = ({
  name,
  status,
  loginUrl,
}: {
  name: string;
  status: TUserStatus;
  loginUrl: string;
}) => {
  const isEnabling = status === USER_STATUS.ACTIVE;
  const statusLabel = isEnabling ? 'Aktif' : 'Non-Aktif';
  const statusColor = isEnabling ? '#7a9e7e' : '#c0625a';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f4; font-family: 'DM Sans', Arial, sans-serif; color: #2e2e2e; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #e8d5cc; max-width: 600px;">

              <tr>
                <td align="center" style="padding: 45px 0 25px 0; background-color: #ffffff;">
                  <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 600; color: #8b5e6a; letter-spacing: 1.5px;">Wevin</h1>
                  <p style="margin: 6px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #c9a0a0; font-style: italic; letter-spacing: 0.5px;">Digital Wedding Invitation</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 45px 45px 45px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 500; color: #2e2e2e;">Halo, ${name}</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    Kami ingin menginformasikan bahwa status akun member Wevin Anda saat ini telah diperbarui menjadi:
                  </p>

                  <div style="background-color: #f5eae6; border-left: 4px solid ${statusColor}; padding: 20px; margin-bottom: 25px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${statusColor}; letter-spacing: 1px; text-transform: uppercase;">
                      ${statusLabel}
                    </p>
                  </div>

                  <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #7a7069;">
                    ${
                      isEnabling
                        ? 'Senang melihat Anda kembali! Sekarang Anda dapat mengakses kembali seluruh fitur di dashboard undangan digital Anda.'
                        : 'Saat ini Anda tidak dapat mengakses fitur dashboard undangan untuk sementara waktu. Jika Anda merasa ini adalah kesalahan, harap hubungi administrator kami.'
                    }
                  </p>

                  ${
                    isEnabling
                      ? `
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${loginUrl}" style="display: inline-block; background-color: #c9a0a0; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; padding: 15px 36px; border-radius: 30px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(201, 160, 160, 0.3);">Login ke Dashboard</a>
                      </td>
                    </tr>
                  </table>
                  `
                      : ''
                  }

                  <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.7; color: #7a7069; text-align: center;">
                    Terima kasih atas perhatian Anda.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #8b5e6a; border-radius: 0 0 12px 12px;">
                  <p style="margin: 0; font-size: 13px; color: #f5eae6; letter-spacing: 0.5px;">
                    Pesan ini dikirimkan otomatis oleh sistem <strong style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; color: #ffffff;">Wevin</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
