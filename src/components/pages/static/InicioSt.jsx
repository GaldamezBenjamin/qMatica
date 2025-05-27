import React from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import main1 from "../../../assets/images/main1.png";
import main3 from "../../../assets/images/main3.png";

const InicioPage = () => {
  return (
    <div className='bg-[#f7f7f8] grid grid-cols-4 gap-10 px-10 py-24'>
      <QuizCard/>
      <QuizCard/>
      <QuizCard/>
      <QuizCard/>
      <QuizCard/>
      <QuizCard/>
      <QuizCard/>
    </div>
  );
};

export default InicioPage;

const QuizCard = () => {
  return (
    <div className='bg-white rounded-lg p-4 flex flex-row'>
      <div className='bg-[#7ed957] rounded-lg min-h-[50px] w-[20px] mr-4 flex-none'/>

      <div className='flex flex-col grow'>
        <div className='text-xl font-semibold'>{ QuizInfo.title }</div>

        <div className='flex justify-between'>
          <p className='text-md font-medium'>{ QuizInfo.category }</p>
          <button className='bg-[#7ed957] rounded-lg h-[60px] w-[60px]'>
            <p className='text-6xl text-white'>﹥</p>
          </button>
        </div>

        <div className='text-md font-medium'>
          <p>{ QuizInfo.questions } preguntas</p>
          <p className='text-gray-400'>Tiempo estimado: { QuizInfo.eta } mins</p>
        </div>
      </div>
    </div>
  );
}

const QuizInfo = {
  "title": "Áreas de Figuras Simples",
  "category": "Perímetro y Área",
  "questions": 20,
  "eta": 6
}