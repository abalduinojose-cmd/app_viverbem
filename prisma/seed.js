// ============================================================
// Seed — popula o banco com dados de exemplo para demonstração.
//
// Rode com: npm run db:seed
// ATENÇÃO: este script APAGA os produtos/categorias existentes
// e recria os de exemplo. Não rode em produção com dados reais.
// O usuário admin é criado apenas se ainda não existir.
// ============================================================

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  // ---------- Usuário admin (não recria se já existir) ----------
  const adminExiste = await db.usuario.findUnique({
    where: { email: "admin@viverbem.com.br" },
  });
  if (!adminExiste) {
    await db.usuario.create({
      data: {
        nome: "Administrador",
        email: "admin@viverbem.com.br",
        // Senha inicial: viverbem123 (troque depois!)
        senhaHash: bcrypt.hashSync("viverbem123", 10),
        papel: "ADMIN",
      },
    });
    console.log("Usuário admin criado: admin@viverbem.com.br / viverbem123");
  }

  // ---------- Usuário operador de exemplo (Fase 2: acesso restrito) ----------
  const operadorExiste = await db.usuario.findUnique({
    where: { email: "operador@viverbem.com.br" },
  });
  if (!operadorExiste) {
    await db.usuario.create({
      data: {
        nome: "Operador da Loja",
        email: "operador@viverbem.com.br",
        // Senha inicial: operador123 (troque depois!)
        senhaHash: bcrypt.hashSync("operador123", 10),
        papel: "OPERADOR",
      },
    });
    console.log("Usuário operador criado: operador@viverbem.com.br / operador123");
  }

  // ---------- Avaliações / depoimentos de exemplo ----------
  // ATENÇÃO: textos abaixo são EXEMPLOS. Substitua pelas avaliações
  // reais do Google no painel (Depoimentos) — nota = estrelas, fonte = "Google".
  await db.depoimento.deleteMany();
  const depoimentos = [
    {
      nome: "Maria Helena",
      texto:
        "Manipulo minhas fórmulas na Viver Bem há mais de 10 anos. O atendimento é atencioso e a dosagem é sempre certinha para mim.",
      nota: 5,
      fonte: "Google",
    },
    {
      nome: "Carlos Eduardo",
      texto:
        "O creme que o dermatologista receitou ficou pronto rapidinho e o resultado foi muito melhor que o industrializado.",
      nota: 5,
      fonte: "Google",
    },
    {
      nome: "Fernanda S.",
      texto:
        "Amo que eles montam a vitamina do meu jeito, sem excesso de cápsulas. Confiança total no trabalho da equipe.",
      nota: 5,
      fonte: "Google",
    },
    {
      nome: "Roberto Almeida",
      texto:
        "Equipe muito preparada. Explicaram cada ativo da fórmula com paciência e o preço ficou bem melhor que na drogaria.",
      nota: 5,
      fonte: "Google",
    },
    {
      nome: "Juliana Martins",
      texto:
        "Peço meus manipulados sempre aqui. Entrega no prazo, embalagem impecável e resultado que eu realmente sinto.",
      nota: 5,
      fonte: "Google",
    },
  ];
  for (let i = 0; i < depoimentos.length; i++) {
    await db.depoimento.create({ data: { ...depoimentos[i], ordem: i } });
  }

  // ---------- Limpa e recria categorias/produtos de exemplo ----------
  await db.produto.deleteMany();
  await db.categoria.deleteMany();

  const categorias = {};
  const listaCategorias = [
    { nome: "Dermatologia & Estética", slug: "dermatologia-estetica" },
    { nome: "Vitaminas & Suplementos", slug: "vitaminas-suplementos" },
    { nome: "Cabelos & Unhas", slug: "cabelos-unhas" },
    { nome: "Saúde da Mulher", slug: "saude-da-mulher" },
    { nome: "Saúde do Homem", slug: "saude-do-homem" },
    { nome: "Homeopatia & Florais", slug: "homeopatia-florais" },
  ];
  for (let i = 0; i < listaCategorias.length; i++) {
    const c = listaCategorias[i];
    categorias[c.slug] = await db.categoria.create({
      data: { nome: c.nome, slug: c.slug, ordem: i },
    });
  }

  // Produtos de exemplo (fotos são placeholders SVG em public/uploads/)
  const produtos = [
    // --- Dermatologia & Estética ---
    {
      nome: "Creme Facial Ácido Hialurônico",
      descricao:
        "Hidratação profunda e preenchimento de linhas finas. Fórmula personalizada para o seu tipo de pele. 30g.",
      precoCentavos: 8990,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/creme.svg",
      novidade: true,
    },
    {
      nome: "Sérum Vitamina C 10%",
      descricao:
        "Ação antioxidante, clareadora e iluminadora. Uniformiza o tom da pele e previne o envelhecimento. 30ml.",
      precoCentavos: 7990,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/serum.svg",
    },
    {
      nome: "Gel Redutor de Medidas",
      descricao:
        "Gel corporal com ativos que auxiliam na firmeza da pele e na redução de medidas. 150g.",
      precoCentavos: 6990,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/gel.svg",
    },
    // --- Vitaminas & Suplementos ---
    {
      nome: "Colágeno Verisol® 30 doses",
      descricao:
        "Colágeno hidrolisado com peptídeos bioativos para firmeza da pele, cabelos e unhas.",
      precoCentavos: 9850,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/capsulas.svg",
    },
    {
      nome: "Vitamina D3",
      descricao:
        "Suporte para imunidade e saúde dos ossos. 60 cápsulas manipuladas na dosagem ideal para você.",
      precoCentavos: 5490,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/vitamina.svg",
      dosagens: "1.000UI, 2.000UI, 5.000UI",
    },
    {
      nome: "Polivitamínico Energia 30 doses",
      descricao:
        "Combinação completa de vitaminas e minerais para disposição no dia a dia. Fórmula sob medida.",
      precoCentavos: 6200,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/vitamina.svg",
      novidade: true,
    },
    {
      nome: "Fórmula Sono Reparador",
      descricao:
        "Melatonina, triptofano, magnésio quelado e Vit. B6. Regula o ciclo do sono, promove o relaxamento e você acorda com mais energia e bom humor. 30 cápsulas.",
      precoCentavos: 7490,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/sono.svg",
      novidade: true,
    },
    // --- Linha própria Viver Bem (fotos reais) — todos em destaque ---
    {
      nome: "CitoRepair™ 2.0",
      descricao:
        "Longevidade celular: imita os efeitos do jejum e contribui para a renovação das células. 30 cápsulas.",
      precoCentavos: 18900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/citorepair.png",
      novidade: true,
      destaque: true,
    },
    {
      nome: "Ômega 3 Viver Bem",
      descricao:
        "Suplemento de óleo de peixe em cápsulas, rico em EPA e DHA para o coração e o cérebro. 90 cápsulas.",
      precoCentavos: 8900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/omega3.png",
      destaque: true,
    },
    {
      nome: "VitaFlex",
      descricao:
        "Curcumina, colágeno, ácido hialurônico, magnésio e vitaminas C, D e K para articulações. 60 cápsulas de 500mg.",
      precoCentavos: 12900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/vitaflex.png",
      destaque: true,
    },
    {
      nome: "Creatina Gummy",
      descricao:
        "Creatina em gomas sabor frutas vermelhas — prática e gostosa de tomar todos os dias.",
      precoCentavos: 9900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/creatina-gummy.png",
      novidade: true,
      destaque: true,
    },
    {
      nome: "Caramelo de Creatina",
      descricao:
        "Creatina em caramelo com farinha de amêndoa. 500g com 35 unidades de 10g — energia com sabor.",
      precoCentavos: 11900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/caramelo-creatina.png",
      novidade: true,
      destaque: true,
    },
    {
      nome: "Composto Emagrecedor",
      descricao:
        "Fórmula para controle do apetite e saciedade, manipulada conforme o seu perfil. 30 doses.",
      precoCentavos: 13900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/composto-emagrecedor.png",
      destaque: true,
    },
    {
      nome: "Glow Cream",
      descricao:
        "Ceramida 6% + Niacinamida 4% + Ácido Hialurônico 0,5% + Copper Peptide. Viço e firmeza para o rosto.",
      precoCentavos: 16900,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/glow-cream.png",
      novidade: true,
      destaque: true,
    },
    {
      nome: "Firm Defense Serum",
      descricao:
        "Ceramidas + Centella + Colágeno. Sérum de firmeza e proteção da barreira da pele. Uso 2x ao dia.",
      precoCentavos: 15900,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/firm-defense-serum.png",
      destaque: true,
    },
    {
      nome: "ZincBlock FPS",
      descricao:
        "Protetor solar mineral com óxido de zinco, toque seco e alta proteção. Ideal para peles sensíveis.",
      precoCentavos: 11900,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/zincblock-fps.png",
      novidade: true,
      destaque: true,
    },
    {
      nome: "Bastão Clareador",
      descricao:
        "Bastão prático para áreas de manchas e hiperpigmentação, com ativos clareadores manipulados.",
      precoCentavos: 9900,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/bastao-clareador.png",
      destaque: true,
    },
    {
      nome: "Pó Finalizador FPB 20",
      descricao:
        "Pó finalizador com proteção, controla a oleosidade e sela a maquiagem com acabamento natural.",
      precoCentavos: 8900,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/po-finalizador.png",
      destaque: true,
    },
    {
      nome: "Ômega 3 Concentrado",
      descricao:
        "EPA e DHA de alta pureza para saúde cardiovascular e cerebral. 60 cápsulas.",
      precoCentavos: 7500,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/capsulas.svg",
    },
    // --- Cabelos & Unhas ---
    {
      nome: "Loção Capilar Minoxidil",
      descricao:
        "Estimula o crescimento dos fios e reduz a queda. Uso contínuo com acompanhamento. 100ml.",
      precoCentavos: 6590,
      categoria: "cabelos-unhas",
      fotoUrl: "/uploads/locao.svg",
      dosagens: "2%, 5%",
    },
    {
      nome: "Cápsulas Cabelos & Unhas Fortes",
      descricao:
        "Biotina, silício orgânico e nutrientes essenciais para fios mais fortes e unhas saudáveis. 60 cápsulas.",
      precoCentavos: 8490,
      categoria: "cabelos-unhas",
      fotoUrl: "/uploads/capsulas.svg",
    },
    // --- Saúde da Mulher ---
    {
      nome: "Composto Feminino Equilíbrio",
      descricao:
        "Blend natural para bem-estar e equilíbrio hormonal feminino. 30 doses personalizadas.",
      precoCentavos: 9200,
      categoria: "saude-da-mulher",
      fotoUrl: "/uploads/feminino.svg",
      novidade: true,
    },
    {
      nome: "Cranberry",
      descricao:
        "Auxilia na saúde do trato urinário. 60 cápsulas com extrato concentrado.",
      precoCentavos: 5890,
      categoria: "saude-da-mulher",
      fotoUrl: "/uploads/capsulas.svg",
      dosagens: "250mg, 500mg",
    },
    // --- Saúde do Homem ---
    {
      nome: "Composto Masculino Vigor",
      descricao:
        "Fórmula com nutrientes que auxiliam a energia, disposição e vitalidade masculina. 30 doses.",
      precoCentavos: 9600,
      categoria: "saude-do-homem",
      fotoUrl: "/uploads/capsulas.svg",
    },
    {
      nome: "Saw Palmetto",
      descricao:
        "Extrato padronizado que auxilia na saúde da próstata. 60 cápsulas.",
      precoCentavos: 7250,
      categoria: "saude-do-homem",
      fotoUrl: "/uploads/capsulas.svg",
      dosagens: "160mg, 320mg",
    },
    // --- Homeopatia & Florais ---
    {
      nome: "Floral Tranquilidade 30ml",
      descricao:
        "Composição floral para momentos de tensão e ansiedade do dia a dia. Uso sublingual.",
      precoCentavos: 4500,
      categoria: "homeopatia-florais",
      fotoUrl: "/uploads/floral.svg",
    },
    {
      nome: "Homeopatia Personalizada",
      descricao:
        "Medicamento homeopático preparado conforme a receita do seu prescritor. Consulte nossos farmacêuticos.",
      precoCentavos: 3990,
      categoria: "homeopatia-florais",
      fotoUrl: "/uploads/floral.svg",
    },
    // --- Mais produtos de exemplo ---
    {
      nome: "Magnésio Dimalato",
      descricao:
        "Auxilia na função muscular, no combate ao cansaço e no relaxamento. 60 cápsulas manipuladas.",
      precoCentavos: 5990,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/capsulas.svg",
      dosagens: "300mg, 600mg",
    },
    {
      nome: "Creatina Monohidratada",
      descricao:
        "Ganho de força e desempenho nos treinos. Pura, sem aditivos, na dose que você precisa.",
      precoCentavos: 8990,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/vitamina.svg",
      dosagens: "3g, 5g",
    },
    {
      nome: "Coenzima Q10",
      descricao:
        "Antioxidante que apoia a saúde do coração e a energia celular. 30 cápsulas.",
      precoCentavos: 11900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/capsulas.svg",
      dosagens: "100mg, 200mg",
    },
    {
      nome: "Protetor Solar Facial FPS 50",
      descricao:
        "Toque seco, sem oleosidade, com proteção UVA/UVB. Base ideal para peles sensíveis. 50g.",
      precoCentavos: 7890,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/creme.svg",
      novidade: true,
    },
    {
      nome: "Creme Ácido Retinoico",
      descricao:
        "Renovação celular, controle da acne e antienvelhecimento. Uso noturno com orientação. 30g.",
      precoCentavos: 6490,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/creme.svg",
      dosagens: "0,025%, 0,05%",
    },
    {
      nome: "Shampoo Antiqueda",
      descricao:
        "Fortalece o couro cabeludo e reduz a queda, com ativos manipulados. 200ml.",
      precoCentavos: 5490,
      categoria: "cabelos-unhas",
      fotoUrl: "/uploads/locao.svg",
    },
    {
      nome: "Colágeno + Ácido Hialurônico",
      descricao:
        "Firmeza e hidratação da pele de dentro para fora. Sabor neutro, fácil de dissolver. 30 doses.",
      precoCentavos: 10900,
      categoria: "saude-da-mulher",
      fotoUrl: "/uploads/feminino.svg",
      novidade: true,
    },
    {
      nome: "Testoviver Homem 45+",
      descricao:
        "Blend com zinco, maca peruana e tribulus para energia e vitalidade masculina. 30 doses.",
      precoCentavos: 9900,
      categoria: "saude-do-homem",
      fotoUrl: "/uploads/capsulas.svg",
    },

    // --- Combos ---
    {
      nome: "Combo Pele Radiante",
      descricao:
        "Sérum Vitamina C 10% + Creme Facial Ácido Hialurônico. A dupla perfeita para uma pele iluminada e hidratada.",
      precoCentavos: 14990,
      categoria: "dermatologia-estetica",
      fotoUrl: "/uploads/combo.svg",
      tipo: "COMBO",
    },
    {
      nome: "Combo Cabelos Fortes",
      descricao:
        "Loção Capilar Minoxidil 5% + Cápsulas Cabelos & Unhas. Tratamento completo de dentro para fora.",
      precoCentavos: 12990,
      categoria: "cabelos-unhas",
      fotoUrl: "/uploads/combo.svg",
      tipo: "COMBO",
      novidade: true,
    },
    {
      nome: "Combo Imunidade em Dia",
      descricao:
        "Vitamina D3 + Ômega 3 + Polivitamínico Energia. Proteção e disposição para toda a estação.",
      precoCentavos: 16900,
      categoria: "vitaminas-suplementos",
      fotoUrl: "/uploads/combo.svg",
      tipo: "COMBO",
    },
  ];

  for (let i = 0; i < produtos.length; i++) {
    const p = produtos[i];
    await db.produto.create({
      data: {
        nome: p.nome,
        descricao: p.descricao,
        precoCentavos: p.precoCentavos,
        tipo: p.tipo || "PRODUTO",
        fotoUrl: p.fotoUrl,
        novidade: p.novidade || false,
        destaque: p.destaque || false,
        dosagens: p.dosagens || null,
        ordem: i,
        categoriaId: categorias[p.categoria].id,
      },
    });
  }

  console.log(`Seed concluído: ${listaCategorias.length} categorias, ${produtos.length} produtos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
