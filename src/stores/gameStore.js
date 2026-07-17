import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const score = ref(0)
  const streak = ref(0)
  const totalAttempts = ref(0)
  const correctAnswers = ref(0)

  function incrementScore(points = 1) {
    score.value += points
    correctAnswers.value++
    streak.value++
  }

  function resetStreak() {
    streak.value = 0
  }

  function recordAttempt() {
    totalAttempts.value++
  }

  function resetGame() {
    score.value = 0
    streak.value = 0
    totalAttempts.value = 0
    correctAnswers.value = 0
  }

  return {
    score,
    streak,
    totalAttempts,
    correctAnswers,
    incrementScore,
    resetStreak,
    recordAttempt,
    resetGame
  }
})
