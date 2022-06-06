//import axios from "axios";
import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  entertainment: 11,
  computer: 18
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'
const tempUrl = 'http://opentdb.com/api.php?amount=10&category=29&difficulty=easy&type=multiple'

const AppContext = React.createContext();


const AppProvider = ({children})=>{

    const [waiting, setWaiting] = useState(true)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])
    const [index, setIndex] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [error, setError] = useState(false)
    const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchQuestions = async (url) => {
      setLoading(true)
      setWaiting(false)
      const response = await axios(url).catch((err) => console.log(err))
      if (response) {
       const data = response.data.results
       if (data.length > 0) {
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  }
  const nextQuestion = ()=>{
      setIndex((oldIndex)=>{
          const index = oldIndex + 1;
          if(index> questions.length -1){
              openModal()
              return 0;
          }
          return index;
      })
  }
  const checkAnswer = value =>{
      if(value){
          setCorrect((oldValue)=> oldValue + 1)
      }
      nextQuestion()
  }
  const openModal = ()=>{
    setIsModalOpen(true)
  }
  const closeModal = ()=>{
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }
  const handleChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({...quiz, [name]: value});
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    const {amount, category, difficulty} = quiz;
    const newUrl = `http://opentdb.com/api.php?amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(newUrl);
  }

    return <AppContext.Provider value={{quiz,handleChange,handleSubmit, waiting, loading, questions, index, correct, error, isModalOpen, nextQuestion, checkAnswer, openModal, closeModal}}>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }