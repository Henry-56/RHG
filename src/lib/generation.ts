// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

export function getGeneration(birthYear: number | null): string {
    if (!birthYear) return 'No clasificado'
    if (birthYear >= 1946 && birthYear <= 1964) return 'Baby Boomers'
    if (birthYear >= 1965 && birthYear <= 1980) return 'Gen X'
    if (birthYear >= 1981 && birthYear <= 1996) return 'Millennials'
    if (birthYear >= 1997 && birthYear <= 2012) return 'Gen Z'
    return 'Otra'
}
