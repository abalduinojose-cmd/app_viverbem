// Gera o ícone do site a partir do logo real.
//
// O logo é um wordmark deitado ("Viver Bem" + subtítulo + onda), que
// vira um borrão em 16px. Então o ícone usa só o "V" do script,
// recortado do próprio arquivo, sobre um quadrado branco arredondado,
// com a onda vermelha embaixo — os dois elementos que identificam a
// marca mesmo quando bem pequenos.
//
// Rode com: node scripts/gerar-favicon.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAIZ = process.cwd();
const LOGO = path.join(RAIZ, "public", "logo.png");
const DESTINO = path.join(RAIZ, "src", "app");

// Recorte do "V" dentro de public/logo.png (1133x497)
const RECORTE_V = { left: 70, top: 30, width: 195, height: 262 };

const LADO = 512;

function fundo() {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}">
       <rect width="${LADO}" height="${LADO}" rx="112" fill="#ffffff"/>
     </svg>`
  );
}

// A onda do logo, redesenhada grossa o bastante para sobreviver a 16px
function onda() {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}">
       <path d="M74 418 C 180 372, 320 462, 438 406"
             fill="none" stroke="#E02129" stroke-width="30" stroke-linecap="round"/>
     </svg>`
  );
}

async function principal() {
  const alturaV = 300;
  const larguraV = Math.round((RECORTE_V.width / RECORTE_V.height) * alturaV);

  const letra = await sharp(LOGO)
    .extract(RECORTE_V)
    .resize({ height: alturaV })
    .png()
    .toBuffer();

  const icone = await sharp(fundo())
    .composite([
      { input: letra, left: Math.round((LADO - larguraV) / 2), top: 62 },
      { input: onda(), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  // Favicon das abas e ícone da tela inicial do iPhone
  await sharp(icone).resize(192, 192).png().toFile(path.join(DESTINO, "icon.png"));
  await sharp(icone).resize(180, 180).png().toFile(path.join(DESTINO, "apple-icon.png"));
  // Versão grande, para o compartilhamento e a instalação como app
  await sharp(icone).resize(512, 512).png().toFile(path.join(RAIZ, "public", "icone-512.png"));

  // O .ico ainda é pedido direto em /favicon.ico por buscadores e
  // agregadores, então vale manter um nosso no lugar do padrão do Next.
  const partes = await Promise.all(
    [16, 32, 48].map(async (lado) => ({
      lado,
      png: await sharp(icone).resize(lado, lado).png().toBuffer(),
    }))
  );
  fs.writeFileSync(path.join(DESTINO, "favicon.ico"), montarIco(partes));

  console.log("icon.png (192), apple-icon.png (180), favicon.ico (16/32/48) e public/icone-512.png gerados.");
}

/** Empacota PNGs em um .ico (o formato aceita PNG embutido desde o Vista). */
function montarIco(partes) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0); // reservado
  cabecalho.writeUInt16LE(1, 2); // 1 = ícone
  cabecalho.writeUInt16LE(partes.length, 4);

  let deslocamento = 6 + partes.length * 16;
  const entradas = partes.map((p) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(p.lado === 256 ? 0 : p.lado, 0); // largura
    e.writeUInt8(p.lado === 256 ? 0 : p.lado, 1); // altura
    e.writeUInt8(0, 2); // sem paleta
    e.writeUInt8(0, 3); // reservado
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por pixel
    e.writeUInt32LE(p.png.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += p.png.length;
    return e;
  });

  return Buffer.concat([cabecalho, ...entradas, ...partes.map((p) => p.png)]);
}

principal();
