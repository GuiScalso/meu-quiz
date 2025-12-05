'use client'

import { useState } from 'react'

type Question = {
  id: number
  title: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Quanto tempo você costuma passar sentado por dia?',
    options: ['Menos de 4 horas', 'Entre 4 e 8 horas', 'Mais de 8 horas por dia'],
  },
  {
    id: 2,
    title:
      'Você costuma se alongar ou fazer qualquer tipo de mobilidade durante a semana?',
    options: ['Sim, com frequência', 'Às vezes', 'Não faço alongamento'],
  },
  {
    id: 3,
    title: 'Você sente que tem ou já teve postura curvada?',
    options: ['Não, minha postura é excelente', 'Às vezes percebo', 'Sim, e me incomoda'],
  },
  {
    id: 4,
    title: 'Você consegue encostar as mãos nos pés sem dobrar os joelhos?',
    options: ['Sim, tranquilamente', 'Chego perto', 'Não chego nem perto'],
  },
  {
    id: 5,
    title: 'Já sentiu dores ou tensão em alguma dessas regiões?',
    options: ['Lombar', 'Pescoço', 'Posterior da coxa', 'Nenhuma das anteriores'],
  },
  {
    id: 6,
    title: 'Você acredita que perdeu altura desde a adolescência?',
    options: ['Sim, percebo isso no espelho', 'Talvez, nunca medi direito', 'Não percebi diferença'],
  },
  {
    id: 7,
    title: 'Em fotos ou espelhos, você já se sentiu "menor" do que realmente é?',
    options: ['Sim, frequentemente', 'Raramente', 'Nunca pensei nisso'],
  },
  {
    id: 8,
    title: 'Você toparia dedicar 20 minutos por dia para ganhar até 8cm de altura?',
    options: ['Sim, quero meu plano agora', 'Talvez, dependendo da rotina', 'Não tenho certeza'],
  },
]

export default function Page() {
  const [stage, setStage] = useState<'hero' | 'quiz' | 'finalForm' | 'result' | 'plans'>(
    'hero'
  )
  const [step, setStep] = useState(0) // 0..7 for questions
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null))
  const [heightCm, setHeightCm] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [name, setName] = useState<string>('')

  function selectOption(option: string) {
    const copy = [...answers]
    copy[step] = option
    setAnswers(copy)
  }

  function nextQuestion() {
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      // go to last form
      setStage('finalForm')
    }
  }

  function prevQuestion() {
    if (step > 0) setStep(step - 1)
  }

  // compute potential based on answers + height/age
  function computeResult() {
    // Simple scoring: assign weights to options to determine potential (0..1), then multiply by 8cm max
    let score = 0
    // Q1: seated time -> less seated = better
    const a1 = answers[0]
    if (a1 === 'Menos de 4 horas') score += 2
    if (a1 === 'Entre 4 e 8 horas') score += 1
    if (a1 === 'Mais de 8 horas por dia') score += 0

    // Q2: stretching frequency
    const a2 = answers[1]
    if (a2 === 'Sim, com frequência') score += 2
    if (a2 === 'Às vezes') score += 1
    if (a2 === 'Não faço alongamento') score += 0

    // Q3: posture
    const a3 = answers[2]
    if (a3 === 'Não, minha postura é excelente') score += 2
    if (a3 === 'Às vezes percebo') score += 1
    if (a3 === 'Sim, e me incomoda') score += 0

    // Q4: reach feet
    const a4 = answers[3]
    if (a4 === 'Sim, tranquilamente') score += 2
    if (a4 === 'Chego perto') score += 1
    if (a4 === 'Não chego nem perto') score += 0

    // Q5: pain regions - presence reduces potential
    const a5 = answers[4]
    if (a5 === 'Nenhuma das anteriores') score += 2
    else if (a5 === 'Posterior da coxa') score += 1
    else score += 0

    // Q6: lost height
    const a6 = answers[5]
    if (a6 === 'Sim, percebo isso no espelho') score += 0 // if lost, potential to regain higher? but we'll treat as neutral
    if (a6 === 'Talvez, nunca medi direito') score += 1
    if (a6 === 'Não percebi diferença') score += 2

    // Q7: feels smaller
    const a7 = answers[6]
    if (a7 === 'Sim, frequentemente') score += 0
    if (a7 === 'Raramente') score += 1
    if (a7 === 'Nunca pensei nisso') score += 2

    // Q8: willingness
    const a8 = answers[7]
    if (a8 === 'Sim, quero meu plano agora') score += 2
    if (a8 === 'Talvez, dependendo da rotina') score += 1
    if (a8 === 'Não tenho certeza') score += 0

    // Normalize: max possible score = 16
    const normalized = Math.max(0, Math.min(1, score / 16))
    const maxGainCm = 8
    // We'll give the potential as scaled: minimum 0cm, maximum 8cm
    const potentialGain = Math.round(normalized * maxGainCm * 10) / 10 // 1 decimal

    // Height fallback
    const currentHeight = parseFloat(heightCm.replace(',', '.')) || 0
    const potentialHeight = Math.round((currentHeight + potentialGain) * 10) / 10

    // Projections: 30d = 70% of gain, 60d = 96% of gain, 90d = 100% of gain (as sample progression)
    const h30 = Math.round((currentHeight + potentialGain * 0.7) * 10) / 10
    const h60 = Math.round((currentHeight + potentialGain * 0.96) * 10) / 10
    const h90 = potentialHeight

    // Percent potential (relative)
    const potentialPercent = Math.round((potentialGain / maxGainCm) * 100)

    return {
      currentHeight,
      potentialGain,
      potentialHeight,
      h30,
      h60,
      h90,
      potentialPercent,
    }
  }

  function handleCalculate() {
    // basic validation
    if (!heightCm || !age) {
      alert('Por favor informe sua altura e idade.')
      return
    }
    setStage('result')
  }

  // UI pieces
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      {/* HERO / Header */}
      <header className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-tight leading-tight">
            OSTEO GROWTH
          </h1>

          <div className="max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Seu corpo está escondendo até 8cm de altura. Você pode desbloquear isso agora.
            </h2>

            <p className="text-gray-300 mb-4 leading-relaxed">
              Você foi enganado: não é que você parou de crescer — é que sua estrutura foi comprimida. A verdade que ninguém te contou.
            </p>

            <p className="text-gray-300 mb-6">
              O Método OG não promete milagre. Ele corrige o que a vida entortou e libera sua altura real em apenas 30 dias.
            </p>

            {stage === 'hero' && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStage('quiz')
                    setStep(0)
                    setAnswers(Array(QUESTIONS.length).fill(null))
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg"
                >
                  REVELAR MEU POTENCIAL
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* QUIZ SECTION */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        {stage === 'quiz' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Análise de Potencial OG</h3>
                <p className="text-sm text-gray-400">Descubra quanto você pode crescer nos próximos 30 dias.</p>
              </div>
              <div className="text-sm text-gray-400">Pergunta {step + 1} de {QUESTIONS.length}</div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">{QUESTIONS[step].title}</h4>

              <div className="space-y-3">
                {QUESTIONS[step].options.map((opt) => {
                  const selected = answers[step] === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(opt)}
                      className={
                        'w-full text-left px-4 py-3 rounded-lg border transition ' +
                        (selected
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-400 text-black border-transparent'
                          : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700')
                      }
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={prevQuestion}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-sm"
                  disabled={step === 0}
                >
                  Voltar
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400 mr-2">{/* spacer */}</div>
                  <button
                    onClick={() => {
                      if (!answers[step]) {
                        alert('Selecione uma opção para continuar.')
                        return
                      }
                      nextQuestion()
                    }}
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-400 text-black font-semibold"
                  >
                    Próxima Pergunta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final form for height + age */}
        {stage === 'finalForm' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Análise de Potencial OG</h3>
                <p className="text-sm text-gray-400">Descubra quanto você pode crescer nos próximos 30 dias.</p>
              </div>
              <div className="text-sm text-gray-400">Última etapa</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Qual é a sua altura atual (em cm)?</label>
                <input
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Ex: 175"
                  inputMode="numeric"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Qual é a sua idade?</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 25"
                  inputMode="numeric"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setStage('quiz')
                    setStep(QUESTIONS.length - 1)
                  }}
                  className="px-4 py-2 rounded-lg border border-zinc-700"
                >
                  Voltar
                </button>

                <button
                  onClick={handleCalculate}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-400 text-black font-semibold"
                >
                  Calcular Resultado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {stage === 'result' && (
          <ResultBlock
            computeResult={computeResult()}
            onStartGrowth={() => setStage('plans')}
          />
        )}

        {/* Plans */}
        {stage === 'plans' && <PlansBlock />}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 pt-8 pb-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
          <p className="font-semibold">MÉTODO OG — Desbloqueie sua altura real. Naturalmente.</p>
          <p className="mt-3">© 2025 Método OG. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">
            Este site não é afiliado a qualquer empresa farmacêutica ou médica. Os resultados podem variar de pessoa para pessoa.
          </p>
        </div>
      </footer>
    </main>
  )
}

/* ---------- Components ---------- */

function ResultBlock({
  computeResult,
  onStartGrowth,
}: {
  computeResult: ReturnType<typeof computeResultHelper>
  onStartGrowth: () => void
}) {
  // computeResult is already prepared above; typing flexible
  const res: any = computeResult

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Seu corpo tem potencial para ganhar até +{res.potentialGain}cm de Altura.</h2>
        <p className="text-gray-300 mt-2">Projeção de crescimento baseada em potencial de +{res.potentialGain}cm em 90 dias</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 rounded-lg p-4">
          <p className="text-sm text-gray-400">Altura atual</p>
          <p className="text-xl font-bold">{res.currentHeight}cm</p>
        </div>

        <div className="bg-black/40 rounded-lg p-4">
          <p className="text-sm text-gray-400">Altura potencial</p>
          <p className="text-xl font-bold">{res.potentialHeight}cm</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-400">Projeção de crescimento</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">30d</p>
            <p className="font-bold">{res.h30}cm</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">60d</p>
            <p className="font-bold">{res.h60}cm</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">90d</p>
            <p className="font-bold">{res.h90}cm</p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-black/30 rounded-lg">
        <p className="text-sm text-gray-300">
          Seu corpo tem potencial para alcançar {res.potentialHeight}cm em 90 dias, conseguindo já chegar em até {res.h30}cm em apenas 30 dias. Potencial {res.potentialPercent}% maior que outros usuários com perfil similar.
        </p>
        <p className="text-sm text-gray-400 mt-2">{res.potentialGain} cm de {8} cm desbloqueados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onStartGrowth}
          className="flex-1 bg-green-500 text-black font-bold py-3 rounded-lg"
        >
          INICIAR MEU CRESCIMENTO
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 border border-zinc-700 py-3 rounded-lg"
        >
          Diagnóstico personalizado em 2 minutos
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <StatBox value="3-8 cm" label="Ganho de altura" />
        <StatBox value="20 min" label="Por dia" />
        <StatBox value="30 dias" label="Programa completo" />
      </div>

      <div className="mt-6 bg-zinc-800 p-4 rounded-lg">
        <h4 className="font-bold mb-2">A Verdade Sobre Sua Altura Real</h4>
        <p className="text-sm text-gray-300">Seu corpo esconde centímetros de altura que foram bloqueados por anos de má postura e compressão vertebral</p>

        <ol className="mt-4 space-y-3 text-sm text-gray-300">
          <li><strong>01</strong> Compressão Vertebral — Seus discos intervertebrais são comprimidos diariamente pela gravidade e postura incorreta, reduzindo sua altura em até 2cm.</li>
          <li><strong>02</strong> Encurtamento Muscular — Músculos tensos e encurtados na cadeia posterior puxam sua coluna para baixo, roubando até 3cm de sua altura real.</li>
          <li><strong>03</strong> Desalinhamento Postural — O desalinhamento da coluna vertebral causa uma perda adicional de 1-3cm que poderia ser recuperada com técnicas corretas.</li>
        </ol>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="text-4xl font-bold">{res.h30}</div>
        <div>
          <p className="text-sm text-gray-400">em 30 dias</p>
          <p className="font-bold text-green-400">+{res.potentialGain} cm</p>
        </div>
      </div>
    </div>
  )
}

// helper type for computeResult signature
function computeResultHelper() {
  return {
    currentHeight: 0,
    potentialGain: 0,
    potentialHeight: 0,
    h30: 0,
    h60: 0,
    h90: 0,
    potentialPercent: 0,
  }
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-black/30 rounded-lg p-4">
      <div className="font-bold text-lg">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

function PlansBlock() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <h3 className="text-2xl font-bold">Planos OG</h3>
      <p className="text-gray-400">Escolha o plano ideal para desbloquear sua altura real e transformar sua postura</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanCard
          tag="INICIANTE"
          title="OG Essencial"
          price="R$ 14,90"
          bullets={[
            'Protocolo de 30 dias',
            'Ganho esperado: 2 a 4 cm',
            'Rotina prática (15 min/dia)',
            'Guia para sentar, dormir e se mover',
          ]}
        />
        <PlanCard
          tag="RECOMENDADO"
          title="OG Evolution"
          price="R$ 19,90"
          bullets={[
            'Protocolo de 60 dias',
            'Ganho esperado: 3 a 6 cm',
            'Treinos híbridos (20 min/dia)',
            'Guia alimentar',
          ]}
          popular
        />
        <PlanCard
          tag="PREMIUM"
          title="OG Elite"
          price="R$ 29,90"
          bullets={[
            'Protocolo de 90 dias',
            'Ganho esperado: 5 a 8 cm',
            'Sessão de análise postural',
            'Acompanhamento 1:1 via WhatsApp',
          ]}
        />
      </div>

      <div className="bg-black/30 p-4 rounded-lg">
        <h4 className="font-bold">Garantia Incondicional de 30 Dias</h4>
        <p className="text-sm text-gray-300">Se você não começar a ver resultados nos primeiros 30 dias, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.</p>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold">Resultados Reais</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <TestimonialCard name="Carlos Silva" txt="+3.5 cm em 30 dias" age="26 anos" plan="OG Essencial" />
          <TestimonialCard name="Rafael Mendes" txt="+5.2 cm em 60 dias" age="31 anos" plan="OG Evolution" />
          <TestimonialCard name="André Martins" txt="+7.8 cm em 90 dias" age="35 anos" plan="OG Elite" />
        </div>
      </div>
    </div>
  )
}

function PlanCard({
  tag,
  title,
  price,
  bullets,
  popular,
}: {
  tag: string
  title: string
  price: string
  bullets: string[]
  popular?: boolean
}) {
  return (
    <div className={'p-4 rounded-lg border ' + (popular ? 'border-yellow-500' : 'border-zinc-700')}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-400">{tag}</div>
        {popular && <div className="text-xs bg-yellow-500 px-2 py-1 rounded text-black font-bold">MAIS POPULAR</div>}
      </div>

      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <div className="text-2xl font-extrabold mb-4">{price}</div>

      <ul className="text-sm mb-4 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-green-400 font-bold">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => window.location.href = '#'}
        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-400 text-black font-bold py-3 rounded-lg"
      >
        ESCOLHER {title.toUpperCase()}
      </button>
    </div>
  )
}

function TestimonialCard({ name, txt, age, plan }: { name: string; txt: string; age: string; plan: string }) {
  return (
    <div className="p-4 border border-zinc-700 rounded-lg">
      <div className="font-bold">{name} <span className="text-sm text-gray-400">• {age}</span></div>
      <div className="text-sm text-gray-300 mt-2">{txt}</div>
      <div className="text-xs text-gray-400 mt-2">{plan}</div>
    </div>
  )
}
