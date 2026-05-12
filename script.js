const webhookURL = "https://discord.com/api/webhooks/1503821309191393370/BIezdj2t1mWobWShAIqqZ86VG33QH_y6sTZ89hKB3eVrBVIPo5GzubVPfWA7pP08J1T7";

// CLIENT ID DISCORD
const clientId = "PASTE_CLIENT_ID_DISCORD";

// REDIRECT WEBSITE
const redirectUri = window.location.origin + window.location.pathname;

let discordUser = null;

// AUTO CEK LOGIN DISCORD
window.onload = async () => {

  const params = new URLSearchParams(
    window.location.hash.substring(1)
  );

  const accessToken = params.get("access_token");

  if(accessToken){

    const response = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      }
    );

    discordUser = await response.json();

    document.getElementById(
      "claimBtn"
    ).style.display = "block";

    document.querySelector(
      ".discord-btn"
    ).innerHTML =
      `LOGIN BERHASIL (${discordUser.username})`;
  }
};

function joinDiscord(){

  // BUKA INVITE DISCORD
  window.open(
    "https://discord.gg/EGHa3mc8R",
    "_blank"
  );

  // LOGIN OAUTH DISCORD
  setTimeout(() => {

    const oauthURL =
      `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`;

    window.location.href = oauthURL;

  },3000);
}

function claimReward(){

  if(!discordUser){

    alert(
      "Login Discord terlebih dahulu!"
    );

    return;
  }

  document.getElementById(
    "successText"
  ).style.display = "block";

  document.getElementById(
    "discountCode"
  ).style.display = "block";

  const data = {

    username: "DEWATA ROLEPLAY",

    avatar_url:
      "https://cdn.discordapp.com/embed/avatars/0.png",

    embeds: [
      {
        title: "🎁 CLAIM DISCOUNT BARU",
        description:
          "Ada user yang claim hadiah discount.",

        color: 16711680,

        thumbnail: {
          url:
            `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        },

        fields: [
          {
            name: "👤 Username Discord",
            value:
              `${discordUser.username}`,
            inline: true
          },

          {
            name: "🆔 Discord ID",
            value:
              `${discordUser.id}`,
            inline: true
          },

          {
            name: "🎟️ Kode Discount",
            value: "DEWATA20",
            inline: false
          },

          {
            name: "🕒 Waktu Claim",
            value:
              new Date().toLocaleString("id-ID"),
            inline: false
          }
        ],

        footer: {
          text: "DEWATA ROLEPLAY"
        }
      }
    ]
  };

  fetch(webhookURL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)

  }).then(() => {

    console.log("Webhook berhasil dikirim");

  }).catch((err) => {

    console.log(err);

  });
}