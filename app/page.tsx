'use client'

import { useState } from 'react'

type Question = {
  id: number
  title: string
  options: string[]
}

const QUESTIONS: Question[] = [
  { id: 1, title: 'Quanto tempo você costuma passar sentado por dia?', options: ['Menos de 4 horas', 'Entre 4 e 8 horas', 'Mais de 8 horas por dia'] },
  { id: 2, title: 'Você costuma se alongar ou fazer qualquer tipo de mobilidade durante a semana?', options: ['Sim, com frequência', 'Às vezes', 'Não faço alongamento'] },
  { id: 3, title: 'Você sente que tem ou já teve postura curvada?', options: ['Não, minha postura é excelente', 'Às vezes percebo', 'Sim, e me incomoda'] },
  { id: 4, title: 'Você consegue encostar as mãos nos pés sem dobrar os joelhos?', options: ['Sim, tranquilamente', 'Chego perto', 'Não chego nem perto'] },
]

export default function Page() {
  const [stage, setStage] = useState<'hero' | 'quiz' | 'finalForm' | 'result' | 'plans'>('hero')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null))
  const [heightCm, setHeightCm] = useState<string>('')
  const [age, setAge] = useState<string>('')

  function selectOption(option: string) {
    const copy = [...answers]
    copy[step] = option
    setAnswers(copy)
  }

  function nextQuestion() {
    if (step + 1 < QUESTIONS.length) setStep(step + 1)
    else setStage('finalForm')
  }

  function prevQuestion() {
    if (step > 0) setStep(step - 1)
  }

  function computeResult() {
    // Exemplo simples de resultado
    return `Você pode crescer aproximadamente ${Math.floor(Math.random() * 8) + 1} cm nos próximos 30 dias!`
  }

  function handleCalculate() {
    if (!heightCm || !age) {
      alert('Por favor informe sua altura e idade.')
      return
    }
    setStage('result')
  }

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      {/* HERO / Header */}
      <header className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-tight leading-tight text-white">
            OSTEO GROWTH
          </h1>

          <div className="max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-500">
              Seu corpo está escondendo até 8cm de altura. Você pode desbloquear isso agora.
            </h2>

            <p className="text-white mb-4 leading-relaxed">
              Você foi enganado: não é que você parou de crescer — é que sua estrutura foi comprimida. A verdade que ninguém te contou.
            </p>

            <p className="text-white mb-6">
              O Método OG corrige o que a vida entortou e libera sua altura real em apenas 30 dias.
            </p>

            {stage === 'hero' && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setStage('quiz'); setStep(0); setAnswers(Array(QUESTIONS.length).fill(null)) }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
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
                <h3 className="text-lg font-semibold text-white">Análise de Potencial OG</h3>
                <p className="text-sm text-red-500">Descubra quanto você pode crescer nos próximos 30 dias.</p>
              </div>
              <div className="text-sm text-red-500">Pergunta {step + 1} de {QUESTIONS.length}</div>
            </div>

            <h4 className="text-xl font-bold mb-4 text-white">{QUESTIONS[step].title}</h4>

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
                        ? 'bg-red-600 text-white border-transparent'
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
                className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-white"
                disabled={step === 0}
              >
                Voltar
              </button>

              <button
                onClick={() => {
                  if (!answers[step]) { alert('Selecione uma opção para continuar.'); return }
                  nextQuestion()
                }}
                className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Próxima Pergunta
              </button>
            </div>
          </div>
        )}

        {/* Final form */}
        {stage === 'finalForm' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white block mb-1">Qual é a sua altura atual (em cm)?</label>
                <input
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Ex: 175"
                  inputMode="numeric"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-white block mb-1">Qual é a sua idade?</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 25"
                  inputMode="numeric"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setStage('quiz'); setStep(QUESTIONS.length - 1) }}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-white"
                >
                  Voltar
                </button>

                <button
                  onClick={handleCalculate}
                  className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Calcular Resultado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {stage === 'result' && <ResultBlock computeResult={computeResult()} onStartGrowth={() => setStage('plans')} />}

        {/* Plans */}
        {stage === 'plans' && <PlansBlock />}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 pt-8 pb-12 text-white text-center text-sm">
        <p className="font-semibold">MÉTODO OG — Desbloqueie sua altura real. Naturalmente.</p>
        <p className="mt-3">© 2025 Método OG. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs text-white">
          Este site não é afiliado a qualquer empresa farmacêutica ou médica. Resultados podem variar.
        </p>
      </footer>
    </main>
  )
}

/* ----------------- Componentes auxiliares ----------------- */

function ResultBlock({ computeResult, onStartGrowth }: { computeResult: string; onStartGrowth: () => void }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Resultado do seu potencial OG</h3>
      <p className="text-white mb-6">{computeResult}</p>
      <button
        onClick={onStartGrowth}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
      >
        Ver Planos
      </button>
    </div>
  )
}

function PlansBlock() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">Escolha seu plano OG</h3>
      <PlanCard title="Plano Básico" price="R$99" features={['Acesso ao método', 'Suporte via email']} />
      <PlanCard title="Plano Premium" price="R$149" features={['Acesso ao método', 'Suporte via WhatsApp', 'Material extra']} />
    </div>
  )
}

function PlanCard({ title, price, features }: { title: string; price: string; features: string[] }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 shadow-md">
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-red-500 font-semibold mb-2">{price}</p>
      <ul className="text-white list-disc list-inside space-y-1">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  )
}
