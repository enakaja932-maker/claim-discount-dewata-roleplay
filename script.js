const webhookURL =
  "https://discord.com/api/webhooks/1503821309191393370/BIezdj2t1mWobWShAIqqZ86VG33QH_y6sTZ89hKB3eVrBVIPo5GzubVPfWA7pP08J1T7";

// CLIENT ID DISCORD
const clientId =
  "1503823971051638964";

// REDIRECT WEBSITE
const redirectUri =
  window.location.origin +
  window.location.pathname;

// USER DISCORD
let discordUser = null;

// LIST KODE DISCOUNT
const discountCodes = [
  "DEWATA01",
  "DEWATA02",
  "DEWATA03",
  "DEWATA04",
  "DEWATA05",
  "DEWATA06",
  "DEWATA07",
  "DEWATA08",
  "DEWATA09",
  "DEWATA10"
];

// AUTO CHECK LOGIN
window.onload = async () => {

  const params =
    new URLSearchParams(
      window.location.hash.substring(1)
    );

  const accessToken =
    params.get("access_token");

  // LOGIN BERHASIL
  if(accessToken){

    try {

      const response = await fetch(
        "https://discord.com/api/users/@me",
        {
          headers:{
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

      discordUser =
        await response.json();

      // TAMPILKAN BUTTON CLAIM
      document.getElementById(
        "claimBtn"
      ).style.display = "block";

      // UBAH BUTTON LOGIN
      document.querySelector(
        ".discord-btn"
      ).innerHTML =
        `LOGIN BERHASIL (${discordUser.username})`;

    } catch(err){

      console.log(err);

    }
  }
};

// JOIN DISCORD
function joinDiscord(){

  // BUKA INVITE
  window.open(
    "https://discord.gg/EGHa3mc8R",
    "_blank"
  );

  // LOGIN OAUTH
  setTimeout(() => {

    const oauthURL =
      `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`;

    window.location.href =
      oauthURL;

  },3000);
}

// CLAIM REWARD
function claimReward(){

  // HARUS LOGIN
  if(!discordUser){

    alert(
      "Login Discord terlebih dahulu!"
    );

    return;
  }

  // DATABASE CLAIM
  let claims =
    JSON.parse(
      localStorage.getItem(
        "dewata_claims"
      )
    ) || {};

  // USER ID
  const userId =
    discordUser.id;

  let userCode;

  // CEK SUDAH CLAIM
  if(claims[userId]){

    userCode =
      claims[userId];

  } else {

    // AMBIL KODE TERSEDIA
    const usedCodes =
      Object.values(claims);

    userCode =
      discountCodes.find(
        code =>
          !usedCodes.includes(code)
      );

    // JIKA HABIS
    if(!userCode){

      alert(
        "Semua kode discount sudah habis!"
      );

      return;
    }

    // SIMPAN CLAIM
    claims[userId] =
      userCode;

    localStorage.setItem(
      "dewata_claims",
      JSON.stringify(claims)
    );
  }

  // TAMPILKAN KODE
  document.getElementById(
    "successText"
  ).style.display = "block";

  document.getElementById(
    "discountCode"
  ).style.display = "block";

  document.getElementById(
    "discountCode"
  ).innerHTML =
    userCode;

  // DATA WEBHOOK
  const data = {

    username:
      "DEWATA ROLEPLAY",

    avatar_url:
      "https://cdn.discordapp.com/embed/avatars/0.png",

    embeds: [
      {
        title:
          "🎁 CLAIM DISCOUNT BARU",

        description:
          "Ada user yang claim hadiah discount.",

        color:
          16711680,

        thumbnail: {
          url:
            `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        },

        fields: [

          {
            name:
              "👤 Username Discord",

            value:
              `${discordUser.username}`,

            inline: true
          },

          {
            name:
              "🆔 Discord ID",

            value:
              `${discordUser.id}`,

            inline: true
          },

          {
            name:
              "🎟️ Kode Discount",

            value:
              userCode,

            inline: false
          },

          {
            name:
              "🕒 Waktu Claim",

            value:
              new Date().toLocaleString(
                "id-ID"
              ),

            inline: false
          }
        ],

        footer: {
          text:
            "DEWATA ROLEPLAY"
        }
      }
    ]
  };

  // KIRIM WEBHOOK
  fetch(
    webhookURL,
    {
      method:"POST",

      headers:{
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify(data)
    }

  ).then(() => {

    console.log(
      "Webhook berhasil dikirim"
    );

  }).catch((err) => {

    console.log(err);

  });
}
