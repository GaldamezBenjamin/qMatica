import { useState } from "react";

import {
  UserRound,
  BookCopy,
  Puzzle,
  FileQuestion,
  MessageSquare
} from "lucide-react";

import { UsuariosCRUD } from './UsuariosCRUD'
import { CategoriasCRUD } from "./CategoriasCRUD";
import { QuizzesCRUD } from "./QuizzesCRUD";
import { ForosCRUD } from "./ForosCRUD";
import { TemarioReader } from "./TemarioReader";
import LoginComponent from "./LoginTest";

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('usuarios');
  
  const renderCrudComponent = () => {
    switch (selectedItem) {
      case 'usuarios':
        return <UsuariosCRUD />;
      case 'categorias':
        return <CategoriasCRUD />;
      case 'quizzes':
        return <QuizzesCRUD />;
      case 'foros':
        return <ForosCRUD />;
      case 'subir_temarios': // Asegúrate de que este ID coincida con el onClick en SelectionPanel
        return <LoginComponent />;
      default:
        return <h2 className="text-xl text-gray-600">Selecciona una opción del menú.</h2>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-auto bg-gray-100 ">
        <SelectionPanel 
          selectedItem={selectedItem}
          onSelect={setSelectedItem}
        />
      </div>
      <div className="w-full bg-white p-4 overflow-y-auto ">
        {renderCrudComponent()}
      </div>
    </div>
  );
};

export default AdminPanel;

const SelectionPanel = ({ selectedItem, onSelect }) => {
  const getItemClasses = (itemKey) => {
    return selectedItem === itemKey ? 'text-white bg-primary' : '';
  };
  return (
    <ul className="menu bg-base-200 rounded-box w-56 h-full">
      <li className="menu-title text-gray-800 text-lg font-bold">
        Colecciones
      </li>
      <li className="py-1" onClick={() => onSelect('usuarios')}>
        <a className={getItemClasses('usuarios')}>
          <UserRound />
          Usuarios
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('categorias')}>
        <a className={getItemClasses('categorias')}>
          <BookCopy />
          Categorías
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('quizzes')}>
        <a className={getItemClasses('quizzes')}>
          <Puzzle />
          Quizzes
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('foros')}>
        <a className={getItemClasses('foros')}>
          <MessageSquare />
          Foros
        </a>
      </li>
      <li className="menu-title text-gray-800 text-lg font-bold pt-3">Temario</li>
      <li className="py-1" onClick={() => onSelect('subir_temarios')}>
        <a className={getItemClasses('subir_temarios')}>
          <FileQuestion />
          Subir Temarios
        </a>
      </li>
    </ul>
  );
};