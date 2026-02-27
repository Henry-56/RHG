// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

export function calculateScores(resp: { [key: string]: number }) {
    let sumDesempeno = 0
    let sumProductividad = 0

    for (let i = 1; i <= 10; i++) sumDesempeno += resp[`q${i}`]
    for (let i = 11; i <= 20; i++) sumProductividad += resp[`q${i}`]

    const scoreDesempeno = sumDesempeno / 10
    const scoreProductividad = sumProductividad / 10
    const scoreTotal = (scoreDesempeno + scoreProductividad) / 2

    let etiqueta = 'Medio'
    if (scoreTotal < 3.0) etiqueta = 'Bajo'
    else if (scoreTotal >= 4.0) etiqueta = 'Alto'

    return { scoreDesempeno, scoreProductividad, scoreTotal, etiqueta }
}
