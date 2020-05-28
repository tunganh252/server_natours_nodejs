const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Active in gmail "less secure app" option
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Nguyen Tung Anh <tunganhtest1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: registerSuccessEmail(data)
  };

  // 3. Actually send the email
  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// const registerSuccessEmail = data => {
//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//           <title>>Sự kiện "Tinh Hoa Đất Việt"</title>
//       </head>
//       <body>
//         <h1>Xin chào bạn <span style="color: #0662a5">${data.name}</span></h1>
//           <h2 style="font-weight: bold">Bạn đã đăng kí tham gia sự kiện "Tinh Hoa Đất Việt" thành công.</h2>
//           <p style="font-weight: bold">Đây là thông tin chi tiết vé của bạn:</p>
//           <p style="font-style: italic" >- Tên: ${data.name}</p>
//           <p style="font-style: italic">- Tuổi: ${data.age}</p>
//           <p style="font-style: italic">- Số điện thoại: ${data.phone}</p>
//           <p>- Sự kiện sẽ diễn ra vào lúc: <span style="color: #0597ff">18:00 Giờ, ngày 07 tháng 03 năm 2020</span></p>
//           <p>- Địa điểm: <span style="color: #0597ff">Cung văn hóa lao động TP.HCM </span>- Địa chỉ: <span style="color: #0597ff">558 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, Hồ Chí Minh</span></p>
//           <hr>
//           <p style="color: #ee5353">(*) Lưu ý: Khi tham gia sự kiện bạn cần xuất trình vé chứa mã QRCode để được Checkin và tham gia chương trình</span></p>
//           <br>
//           <h1>Link: <a href="${data.linkTicket}">Vé tham gia sự kiện "Tinh Hoa Đất Việt"</a></h1>
//           <p style="font-weight: bold">Hotline: ...................</p>
//           <img src="https://i.imgur.com/elNI4Vh.png" alt="Avatar" style="width:100%">
//       </body>
//     </html>
//     `;
// };
