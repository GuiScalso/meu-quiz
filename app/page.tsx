'use client'

import { useState } from 'react'

const questions = [
  {
    id: 1,
    question: 'Qual sua idade?',
    options: ['Menos de 18', '18-25', '26-35', '36-50', 'Mais de 50'],
  },
  {
    id: 2,
    question: 'Você já tentou aumentar sua altura antes?',
    options: ['Nunca tentei', 'Já tentei exercícios', 'Já tentei suplementos', 'Já tentei de tudo'],
  },
  {
    id: 3,
    question: 'Qual seu maior objetivo hoje?',
    options: ['Ficar mais alto', 'Melhorar postura', 'Ganhar confiança', 'Tudo isso'],
  },
  {
    id: 4,
    question: 'Você aplicaria 30 minutos por dia se houvesse um método comprovado?',
    options: ['Sim, com certeza', 'Talvez', 'Não sei', 'Não'],
  },
]

export default function Page() {
  const [start, setStart] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  function handleAnswer(option: string) {
    const newAnswers = [...answers]
    newAnswers[step] = option
    setAnswers(newAnswers)

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      setFinished(true)
    }
  }

  // ✅ TELA INICIAL
  if (!start) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="text-center max-w-xl">
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            Descubra se você pode aumentar sua estatura de forma natural
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Leva menos de 30 segundos.
          </p>

          <button
            onClick={() => setStart(true)}
            className="bg-white text-black font-semibold px-8 py-4 rounded-xl text-lg hover:bg-gray-200 transition"
          >
            Começar teste
          </button>
        </div>
      </div>
    )
  }

  // ✅ TELA DE RESULTADO
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Seu perfil é compatível ✅
          </h2>

          <p className="text-gray-300 mb-8">
            Com base nas suas respostas, você tem grande potencial para aplicar o método
            natural de crescimento que vem ajudando milhares de pessoas.
          </p>

          <button
            onClick={() => (window.location.href = 'https://SEULINKAQUI.com')}
            className="bg-green-500 text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-green-400 transition"
          >
            Quero ver o método agora
          </button>
        </div>
      </div>
    )
  }

  // ✅ TELA DE PERGUNTAS
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {questions[step].question}
        </h2>

        <div className="flex flex-col gap-4">
          {questions[step].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-gray-800 hover:bg-gray-700 transition py-4 rounded-xl text-lg font-medium"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Pergunta {step + 1} de {questions.length}
        </div>
      </div>
    </div>
  )
}
