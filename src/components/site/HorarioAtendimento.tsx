"use client";
// Horário das lojas com o estado ao vivo ("Aberto agora" / "Fechado").
// Os horários são os do perfil do Google das unidades.
//
// O cálculo roda só depois de montar, no fuso de Brasília: se saísse
// do servidor, o horário do build ficaria congelado no HTML e poderia
// dizer "aberto" de madrugada.

import { useEffect, useState } from "react";

// Índice 0 = domingo, igual ao getDay() do JavaScript
const GRADE = [
  { dia: "Domingo", abre: null, fecha: null },
  { dia: "Segunda", abre: 9, fecha: 19 },
  { dia: "Terça", abre: 9, fecha: 19 },
  { dia: "Quarta", abre: 9, fecha: 19 },
  { dia: "Quinta", abre: 9, fecha: 19 },
  { dia: "Sexta", abre: 9, fecha: 19 },
  { dia: "Sábado", abre: 9, fecha: 13 },
];

// Como as linhas aparecem na lista (dias úteis agrupados)
const LINHAS = [
  { rotulo: "Segunda a sexta", horas: "9h às 19h", dias: [1, 2, 3, 4, 5] },
  { rotulo: "Sábado", horas: "9h às 13h", dias: [6] },
  { rotulo: "Domingo", horas: "Fechado", dias: [0] },
];

type Estado = { aberto: boolean; diaSemana: number } | null;

export function HorarioAtendimento() {
  const [estado, setEstado] = useState<Estado>(null);

  useEffect(() => {
    function calcular() {
      // Hora de Brasília, independente do fuso de quem acessa
      const agora = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );
      const diaSemana = agora.getDay();
      const faixa = GRADE[diaSemana];
      const minutos = agora.getHours() * 60 + agora.getMinutes();
      const aberto =
        faixa.abre !== null &&
        faixa.fecha !== null &&
        minutos >= faixa.abre * 60 &&
        minutos < faixa.fecha * 60;
      setEstado({ aberto, diaSemana });
    }

    calcular();
    // Reavalia a cada minuto para virar o selo na hora certa
    const relogio = setInterval(calcular, 60_000);
    return () => clearInterval(relogio);
  }, []);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      {/* Selo do estado atual */}
      <div className="flex items-center gap-2 h-6">
        {estado && (
          <>
            <span className="relative flex w-2 h-2" aria-hidden="true">
              {estado.aberto && (
                <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-70 animate-ping" />
              )}
              <span
                className={`relative inline-flex w-2 h-2 rounded-full ${
                  estado.aberto ? "bg-green-400" : "bg-white/35"
                }`}
              />
            </span>
            <span
              className={`text-sm font-semibold ${
                estado.aberto ? "text-green-400" : "text-white/50"
              }`}
            >
              {estado.aberto ? "Aberto agora" : "Fechado agora"}
            </span>
          </>
        )}
      </div>

      {/* Grade da semana, com o dia de hoje em destaque */}
      <ul className="flex flex-col mt-3">
        {LINHAS.map((linha) => {
          const hoje = estado ? linha.dias.includes(estado.diaSemana) : false;
          return (
            <li
              key={linha.rotulo}
              className={`flex items-baseline justify-between gap-4 text-sm py-2 border-t border-white/[0.07] first:border-t-0 ${
                hoje ? "text-white" : "text-white/50"
              }`}
            >
              <span className="flex items-center gap-2">
                {linha.rotulo}
                {hoje && (
                  <span className="text-[0.6rem] font-semibold tracking-wider uppercase bg-white/10 text-white/70 px-1.5 py-0.5 rounded">
                    hoje
                  </span>
                )}
              </span>
              <span className={`whitespace-nowrap ${hoje ? "font-semibold" : ""}`}>
                {linha.horas}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
